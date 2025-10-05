#!/usr/bin/env node
/*
 ESM health-check script for Supabase integration.
 It will try to create a Supabase client using env vars and perform a safe select on 'students' table (limit 1).
*/

const fs = await import('fs');
const path = await import('path');

// If a .env file exists, load simple KEY=VALUE pairs into process.env (do not override existing)
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
    // remove optional surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  });
}

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in environment or in .env file');
  process.exit(2);
}

const { createClient } = await import('@supabase/supabase-js');

const supabase = createClient.createClient ? createClient.createClient(url, anonKey) : createClient(url, anonKey);

try {
  const { data, error } = await supabase.from('students').select('id').limit(1);
  if (error) {
    console.error('Supabase query error:', error.message || JSON.stringify(error));
    process.exit(3);
  }

  console.log('Supabase check OK. rows:', (data && data.length) || 0);
  process.exit(0);
} catch (err) {
  console.error('Unexpected error connecting to Supabase:', err.message || err);
  process.exit(4);
}
