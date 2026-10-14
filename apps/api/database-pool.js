const { Pool } = require('pg');
const { databaseOptions } = require('./config/environment');
const pool = new Pool(databaseOptions());
module.exports = { query: (text, params) => pool.query(text, params), pool };
