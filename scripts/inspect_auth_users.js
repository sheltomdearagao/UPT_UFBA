import { Client } from 'pg';
import fs from 'fs';
const env = fs.existsSync('.env') ? fs.readFileSync('.env','utf8') : '';
env.split(/\r?\n/).forEach(line=>{const t=line.split('='); if(t[0]) process.env[t[0].trim()]=t[1]});
(async ()=>{
  const client=new Client({connectionString:process.env.DATABASE_URL});
  try{
    await client.connect();
    const r=await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = 'users' ORDER BY ordinal_position;`);
    console.log('auth.users columns:');
    console.table(r.rows);
    await client.end();
  }catch(e){console.error(e);process.exit(1)}
})();
