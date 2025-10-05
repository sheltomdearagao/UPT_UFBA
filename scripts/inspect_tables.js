#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

// load .env
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

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) { console.error('DATABASE_URL not set'); process.exit(2); }

const client = new Client({ connectionString: databaseUrl });

async function main() {
  await client.connect();
  const tables = ['simulados','alunos','redacoes','temas_redacao'];
  for (const t of tables) {
    try {
      const res = await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name=$1`, [t]);
      console.log('Table', t, 'columns:');
      console.table(res.rows);
    } catch (err) {
      console.warn('Could not inspect table', t, err.message || err);
    }
  }
  await client.end();
}

main();
