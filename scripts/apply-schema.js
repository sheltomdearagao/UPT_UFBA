#!/usr/bin/env node
/*
 Apply SQL schema (config/schema.sql) to a Postgres database specified by DATABASE_URL or PG_CONNECTION env var.

 Usage:
  DATABASE_URL="postgres://user:pass@host:5432/db" node ./scripts/apply-schema.js

 Note: Keep your Service Role / DB credentials private. Do NOT paste them into public chat.
*/

import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

// Load simple .env if present (KEY=VALUE lines), do not override existing env vars
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

const schemaPath = path.resolve(process.cwd(), 'config', 'schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.error('config/schema.sql not found');
  process.exit(2);
}

const databaseUrl = process.env.DATABASE_URL || process.env.PG_CONNECTION;
if (!databaseUrl) {
  console.error('DATABASE_URL or PG_CONNECTION must be provided in environment');
  process.exit(2);
}

const sql = fs.readFileSync(schemaPath, { encoding: 'utf8' });

async function main() {
  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    console.log('Connected to database, applying schema...');
    await client.query(sql);
    console.log('Schema applied successfully');
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Error applying schema:', err.message || err);
    try { await client.end(); } catch(e) {}
    process.exit(3);
  }
}

main();
