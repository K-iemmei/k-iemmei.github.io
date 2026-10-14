const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { Client } = require('pg');
const { root, databaseOptions } = require('../../apps/api/config/environment');
async function migrate(options = databaseOptions()) {
    const client = new Client(options);
    await client.connect();
    try {
        await client.query('SELECT pg_advisory_lock(704102026)');
        await client.query('CREATE SCHEMA IF NOT EXISTS app_private');
        await client.query(
            'CREATE TABLE IF NOT EXISTS app_private.migrations (name TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())',
        );
        for (const directory of ['migrations', 'local']) {
            for (const file of fs
                .readdirSync(path.join(root, 'database', directory))
                .filter((f) => f.endsWith('.sql'))
                .sort()) {
                const name = directory + '/' + file;
                const sql = fs.readFileSync(path.join(root, 'database', directory, file), 'utf8');
                const hash = crypto.createHash('sha256').update(sql).digest('hex');
                const existing = await client.query(
                    'SELECT checksum FROM app_private.migrations WHERE name=$1',
                    [name],
                );
                if (existing.rows.length) {
                    if (existing.rows[0].checksum !== hash)
                        throw new Error('Applied migration changed: ' + name);
                    continue;
                }
                await client.query('BEGIN');
                try {
                    await client.query(sql);
                    await client.query(
                        'INSERT INTO app_private.migrations(name,checksum) VALUES($1,$2)',
                        [name, hash],
                    );
                    await client.query('COMMIT');
                    console.log('Applied ' + name);
                } catch (error) {
                    await client.query('ROLLBACK');
                    throw error;
                }
            }
        }
    } finally {
        await client.query('SELECT pg_advisory_unlock(704102026)');
        await client.end();
    }
}
module.exports = { migrate };
if (require.main === module)
    migrate().catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    });
