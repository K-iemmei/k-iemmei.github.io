const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '../../..');
const envFile = path.join(root, '.env.local');
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);
function databaseOptions({ allowRemote = false } = {}) {
    const value = process.env.DATABASE_URL;
    if (!value) throw new Error('Missing DATABASE_URL: copy .env.example to .env.local');
    const url = new URL(value);
    if (!allowRemote && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
        throw new Error(
            'Local database commands refuse non-loopback DATABASE_URL. Export SQL for Supabase instead.',
        );
    }
    return { connectionString: value, connectionTimeoutMillis: 5000 };
}
module.exports = { root, databaseOptions };
