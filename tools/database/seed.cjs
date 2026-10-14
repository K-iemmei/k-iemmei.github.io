const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');
const { root, databaseOptions } = require('../../apps/api/config/environment');
async function seed(options = databaseOptions()) {
    const client = new Client(options);
    await client.connect();
    try {
        await client.query('BEGIN');
        for (const file of fs
            .readdirSync(path.join(root, 'database/seeds'))
            .filter((f) => f.endsWith('.sql'))
            .sort()) {
            await client.query(fs.readFileSync(path.join(root, 'database/seeds', file), 'utf8'));
            console.log('Seeded ' + file);
        }
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        await client.end();
    }
}
module.exports = { seed };
if (require.main === module)
    seed().catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    });
