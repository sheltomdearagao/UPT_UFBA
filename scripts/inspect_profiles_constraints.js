import { Client } from 'pg';
import fs from 'fs';
const env = fs.existsSync('.env') ? fs.readFileSync('.env','utf8') : '';
env.split(/\r?\n/).forEach(line=>{const t=line.split('='); if(t[0]) process.env[t[0].trim()]=t[1]});
(async ()=>{
  const client=new Client({connectionString:process.env.DATABASE_URL});
  try{
    await client.connect();
    const r=await client.query(`SELECT c.conname, pg_get_constraintdef(c.oid) as def FROM pg_constraint c JOIN pg_class t ON c.conrelid = t.oid WHERE t.relname = 'profiles';`);
    console.log(r.rows);
    await client.end();
  }catch(e){console.error(e);process.exit(1)}
})();
