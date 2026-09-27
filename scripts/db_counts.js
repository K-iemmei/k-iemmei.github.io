const fs = require('fs');
const { Client } = require('pg');

const cfg = JSON.parse(fs.readFileSync('data/db-config.json', 'utf8'));
const env = cfg.env === 'prod' ? 'prod' : 'local';
const db = cfg.local.db;

const client = new Client({ host: db.host, port: db.port, database: db.database, user: db.user, password: db.password });

async function run(){
  try{
    await client.connect();
    const g = await client.query('SELECT COUNT(*)::int AS cnt FROM reading_question_groups');
    const q = await client.query('SELECT COUNT(*)::int AS cnt FROM reading_questions');
    console.log('reading_question_groups:', g.rows[0].cnt);
    console.log('reading_questions:', q.rows[0].cnt);
    await client.end();
  }catch(e){
    console.error('Error:', e.message || e);
    process.exit(1);
  }
}
run();
