const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { root, databaseOptions } = require('../../apps/api/config/environment');
const url = new URL(databaseOptions().connectionString);
const directory = path.join(root, '.local/backups');
fs.mkdirSync(directory, { recursive: true });
const output = path.join(
    directory,
    'my-note-' + new Date().toISOString().replace(/[:.]/g, '-') + '.dump',
);
execFileSync(
    'pg_dump',
    [
        '--format=custom',
        '--file',
        output,
        '--host',
        url.hostname,
        '--port',
        url.port || '5432',
        '--username',
        decodeURIComponent(url.username),
        '--dbname',
        url.pathname.slice(1),
    ],
    {
        env: { ...process.env, PGPASSWORD: decodeURIComponent(url.password) },
        stdio: 'inherit',
        windowsHide: true,
    },
);
console.log('Backup: ' + path.relative(root, output));
