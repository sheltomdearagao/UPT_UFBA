#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

// Load .env if present
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, { encoding: 'utf8' });
  content.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  });
}

const databaseUrl = process.env.DATABASE_URL || process.env.PG_CONNECTION;
if (!databaseUrl) {
  console.error('DATABASE_URL not set in .env (seed requires DB connection)');
  process.exit(2);
}

const client = new Client({ connectionString: databaseUrl });

async function ensureAluno(email) {
  const res = await client.query('SELECT id FROM alunos WHERE email = $1 LIMIT 1', [email]);
  if (res.rows.length) return res.rows[0].id;
  const ins = await client.query(
    `INSERT INTO alunos (id, nome_completo, cpf, email) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id`,
    ['Aluno Exemplo', '00000000000', email]
  );
  return ins.rows[0].id;
}

async function ensureSimulado(nome) {
  const res = await client.query('SELECT id FROM simulados WHERE nome_simulado = $1 LIMIT 1', [nome]);
  if (res.rows.length) return res.rows[0].id;
  const ins = await client.query(
    `INSERT INTO simulados (id, nome_simulado, data_aplicacao, gabarito_obj, gabarito_pdf_path) VALUES (gen_random_uuid(), $1, current_date, $2, $3) RETURNING id`,
    [nome, '[]', null]
  );
  return ins.rows[0].id;
}

async function ensureRedacao({ alunoId, simuladoId, tema }) {
  const res = await client.query('SELECT id FROM redacoes WHERE tema = $1 AND aluno_id = $2 LIMIT 1', [tema, alunoId]);
  if (res.rows.length) return res.rows[0].id;
    const ins = await client.query(
    `INSERT INTO redacoes (id, aluno_id, student_id, simulado_id, tema, caminho_imagem, status, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, now()) RETURNING id`,
    [alunoId, alunoId, simuladoId, tema, '', 'pending']
  );
  return ins.rows[0].id;
}

async function main() {
  try {
    await client.connect();
    console.log('Connected to DB — inserting seed data (if not exists)');

    // ensure sample aluno
    const alunoEmail = 'aluno@example.com';
    const alunoId = await ensureAluno(alunoEmail);
    console.log('Aluno id:', alunoId);

      // ensure a corresponding profile so student_id FK (profiles.user_id) exists
      // profiles table doesn't have an email column; use available columns
      // ensure an auth.users row exists (profiles.user_id references auth.users.id)
      await client.query(`INSERT INTO auth.users (id, email, raw_user_meta_data)
        SELECT $1, $2, $3
        WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE id = $1)`,
        [alunoId, alunoEmail, '{}']);

      await client.query(`INSERT INTO profiles (user_id, full_name, role, avatar_url)
        SELECT $1, $2, $3, $4
        WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = $1)`,
        [alunoId, 'Aluno Exemplo', 'student', null]);

    // ensure sample simulado
    const simuladoName = 'Simulado Exemplo';
    const simuladoId = await ensureSimulado(simuladoName);
    console.log('Simulado id:', simuladoId);

    // ensure sample redacao
    const tema = 'Tema Exemplo';
  const redacaoId = await ensureRedacao({ alunoId, simuladoId, tema });
    console.log('Redacao id:', redacaoId);

    console.log('Seed completed successfully');
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message || err);
    try { await client.end(); } catch(e) {}
    process.exit(3);
  }
}

main();
