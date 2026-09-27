const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const repoRoot = path.resolve(__dirname, '..');
const cfgPath = path.join(repoRoot, 'data', 'db-config.json');
if (!fs.existsSync(cfgPath)) throw new Error('Missing data/db-config.json');
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const env = cfg.env === 'prod' ? 'prod' : 'local';
const dbCfg = env === 'local' ? cfg.local.db : cfg.prod.db;

const pool = new Pool({
  host: dbCfg.host,
  port: dbCfg.port,
  database: dbCfg.database,
  user: dbCfg.user,
  password: dbCfg.password,
  ssl: dbCfg.ssl || false
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
