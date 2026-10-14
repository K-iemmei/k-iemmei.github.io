const fs = require('node:fs');
const path = require('node:path');
const { randomBytes } = require('node:crypto');
const { Client } = require('pg');
const { root, databaseOptions } = require('../../apps/api/config/environment');
const { hashPassword } = require('../../apps/api/modules/auth/local-auth');
(async () => {
    const username = process.env.LOCAL_USERNAME || 'developer';
    const password = process.env.LOCAL_PASSWORD || randomBytes(18).toString('base64url');
    const client = new Client(databaseOptions());
    await client.connect();
    try {
        await client.query('BEGIN');
        const existing = await client.query('SELECT id FROM public.users WHERE username=$1', [
            username,
        ]);
        if (existing.rows.length) {
            console.log('User already exists; password unchanged.');
            await client.query('ROLLBACK');
            return;
        }
        const user = await client.query(
            'INSERT INTO public.users(username,name) VALUES($1,$2) RETURNING id',
            [username, 'Local Developer'],
        );
        await client.query(
            'INSERT INTO app_private.credentials(user_id,password_hash) VALUES($1,$2)',
            [user.rows[0].id, hashPassword(password)],
        );
        await client.query('COMMIT');
        fs.mkdirSync(path.join(root, '.local'), { recursive: true });
        fs.writeFileSync(
            path.join(root, '.local/developer-login.txt'),
            'Username: ' + username + '\nPassword: ' + password + '\n',
        );
        console.log('Local login saved to .local/developer-login.txt (gitignored).');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        await client.end();
    }
})().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
