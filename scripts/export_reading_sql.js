const fs = require('fs');
const { Client } = require('pg');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const outFile = path.join(repoRoot, 'data', 'sql', 'import_reading_questions.sql');

const cfg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data', 'db-config.json'), 'utf8'));
const db = cfg.local.db;
const client = new Client({ host: db.host, port: db.port, database: db.database, user: db.user, password: db.password });

function q(v){
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number' || typeof v === 'boolean') return v.toString();
  // JSON objects
  if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
  return `'${v.toString().replace(/'/g, "''")}'`;
}

async function exportTable(table, cols, conflict) {
  const res = await client.query(`SELECT ${cols.join(', ')} FROM ${table} ORDER BY id`);
  if (!res.rows.length) return '';
  let sql = `-- ${table}\n`;
  for (const r of res.rows) {
    const vals = cols.map(c => q(r[c]));
    sql += `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${vals.join(', ')}) ${conflict || ''};\n`;
  }
  sql += '\n';
  return sql;
}

async function run(){
  try{
    await client.connect();
    let out = '';
    out += "-- Exported reading tables\n";
    out += await exportTable('reading_passages', ['id','test_id','passage_order','title','content'], "ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, content=EXCLUDED.content");
    out += await exportTable('reading_question_groups', ['id','passage_id','group_order','question_type','instruction','options','settings'], "ON CONFLICT (id) DO UPDATE SET instruction=EXCLUDED.instruction, question_type=EXCLUDED.question_type, options=EXCLUDED.options, settings=EXCLUDED.settings");
    out += await exportTable('reading_questions', ['id','group_id','question_number','prompt','answer_key','explanation','points','metadata'], "ON CONFLICT (id) DO UPDATE SET prompt=EXCLUDED.prompt, metadata=EXCLUDED.metadata");
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, out, 'utf8');
    console.log('Wrote', outFile);
    await client.end();
  }catch(e){
    console.error('Error', e);
    process.exit(1);
  }
}
run();
