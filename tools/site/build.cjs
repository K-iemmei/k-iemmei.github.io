const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const web = path.join(root, 'apps/web');
const output = path.join(root, 'dist');
const routes = require(path.join(web, 'routes.json'));

function removePreviousBuild(target) {
    if (path.resolve(target) !== path.join(root, 'dist')) throw new Error('Unsafe build path');
    if (!fs.existsSync(target)) return;
    for (const entry of fs.readdirSync(target)) {
        // Some Windows/OneDrive setups lock the empty Pages marker. It can be reused.
        if (entry === '.nojekyll') continue;
        const item = path.join(target, entry);
        if (fs.lstatSync(item).isSymbolicLink()) throw new Error('Unexpected symlink in dist');
        fs.rmSync(item, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
    }
}

function buildSite({
    url = process.env.SUPABASE_URL,
    key = process.env.SUPABASE_ANON_KEY,
    prepareRichAssets = require('./rich-assets.cjs').buildRichAssets,
} = {}) {
    if (!/^https:\/\/[a-z0-9.-]+\.supabase\.co\/?$/i.test(url || ''))
        throw new Error('SUPABASE_URL must be an https://...supabase.co project URL');
    if (!key || !/^[\w.-]{20,}$/.test(key))
        throw new Error('SUPABASE_ANON_KEY must be the public anon/publishable key');
    // Never package SQL console, source books, local backups or server code.
    removePreviousBuild(output);
    fs.mkdirSync(output, { recursive: true });
    fs.cpSync(path.join(web, 'src'), path.join(output, 'src'), { recursive: true });
    fs.cpSync(path.join(web, 'styles'), path.join(output, 'styles'), { recursive: true });
    fs.mkdirSync(path.join(output, 'vendor'), { recursive: true });
    prepareRichAssets(path.join(output, 'vendor/rich'));
    for (const file of ['sql-wasm.js', 'sql-wasm.wasm'])
        fs.copyFileSync(
            path.join(root, 'node_modules/sql.js/dist', file),
            path.join(output, 'vendor', file),
        );
    if (fs.existsSync(path.join(web, 'public')))
        fs.cpSync(path.join(web, 'public'), output, { recursive: true });
    const config = `export const deployment = Object.freeze(${JSON.stringify({
        mode: 'supabase',
        url: url.replace(/\/$/, ''),
        anonKey: key,
    })});\n`;
    fs.writeFileSync(path.join(output, 'src/core/deployment-config.js'), config);
    for (const [name, source] of Object.entries(routes)) {
        if (name === 'sql-console.html') continue;
        let html = fs.readFileSync(path.join(web, 'pages', source), 'utf8');
        if (name === 'index.html') {
            html = html
                .replace(
                    /<label for="username">Username<\/label>/,
                    '<label for="username">Email</label>',
                )
                .replace('placeholder="Username"', 'placeholder="Email address"')
                .replace('autocomplete="username"', 'autocomplete="email"')
                .replace(
                    'type="text"\n                            id="username"',
                    'type="email"\n                            id="username"',
                );
        } else {
            html = html.replace(
                '</head>',
                `<link rel="preconnect" href="${new URL(url).origin}" crossorigin />
                <link rel="modulepreload" href="src/core/database-client.js" />
                <link rel="modulepreload" href="src/core/session-storage.js" />
                ${name === 'home.html' ? '<link rel="preconnect" href="https://api.open-meteo.com" crossorigin />' : ''}
                <style>html[data-auth-pending] body{visibility:hidden}</style><script>document.documentElement.dataset.authPending='true'</script></head>`,
            );
        }
        fs.writeFileSync(path.join(output, name), html);
    }
    if (!fs.existsSync(path.join(output, '.nojekyll')))
        fs.writeFileSync(path.join(output, '.nojekyll'), '');
    console.log(`Built ${Object.keys(routes).length - 1} static pages in dist/`);
}
if (require.main === module) buildSite();
module.exports = { buildSite };
