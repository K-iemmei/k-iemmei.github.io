const { Client, Pool } = require('pg');
const { databaseOptions } = require('../../apps/api/config/environment');
const { migrate } = require('../../tools/database/migrate.cjs');
const { seed } = require('../../tools/database/seed.cjs');
const { hashPassword } = require('../../apps/api/modules/auth/local-auth');
async function createTestDatabase({ initialize = true } = {}) {
    const options = databaseOptions();
    const name = 'my_note_test_' + process.pid + '_' + Date.now();
    const admin = new Client(options);
    await admin.connect();
    await admin.query('CREATE DATABASE "' + name + '"');
    const url = new URL(options.connectionString);
    url.pathname = '/' + name;
    const testOptions = { connectionString: url.toString() };
    let pool;
    async function cleanup() {
        if (pool) await pool.end();
        if (!/^my_note_test_[0-9]+_[0-9]+$/.test(name))
            throw new Error('Refusing unexpected test database');
        await admin.query('DROP DATABASE "' + name + '"');
        await admin.end();
    }
    try {
        pool = new Pool(testOptions);
        if (!initialize) return { pool, options: testOptions, cleanup };
        await migrate(testOptions);
        await seed(testOptions);
        const profile = await pool.query(
            "INSERT INTO public.users(username,name) VALUES('test-learner','Test Learner') RETURNING id",
        );
        await pool.query(
            'INSERT INTO app_private.credentials(user_id,password_hash) VALUES($1,$2)',
            [profile.rows[0].id, hashPassword('test-password')],
        );
        return { pool, options: testOptions, userId: profile.rows[0].id, cleanup };
    } catch (error) {
        await cleanup();
        throw error;
    }
}
module.exports = { createTestDatabase };
