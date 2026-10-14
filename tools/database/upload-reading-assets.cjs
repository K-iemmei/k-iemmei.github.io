const fs = require('node:fs');
const path = require('node:path');
const { pool } = require('../../apps/api/database-pool');
const root = path.resolve(__dirname, '../..');
(async () => {
    const url = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!/^https:\/\/[a-z0-9.-]+\.supabase\.co$/i.test(url) || !key)
        throw Error(
            'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY locally; never put the service key in GitHub Pages',
        );
    const result = await pool.query('SELECT metadata FROM reading_question_groups');
    const files = new Set();
    for (const row of result.rows)
        for (const item of [
            ...(row.metadata?.source_pages || []),
            ...(row.metadata?.figures || []),
        ])
            if (
                /^cambridge-(?:[1-9]|1[0-9]|2[01])-p\d{3}(?:-[lr])?(?:-figure)?\.png$/.test(
                    item.file || '',
                )
            )
                files.add(item.file);
    let uploaded = 0,
        missing = 0;
    for (const file of [...files].sort()) {
        const local = path.join(root, 'data/imports/reading-assets', file);
        if (!fs.existsSync(local)) {
            missing++;
            continue;
        }
        const response = await fetch(
            `${url}/storage/v1/object/reading-assets/${encodeURIComponent(file)}`,
            {
                method: 'POST',
                headers: {
                    apikey: key,
                    Authorization: `Bearer ${key}`,
                    'Content-Type': 'image/png',
                    'x-upsert': 'true',
                },
                body: fs.readFileSync(local),
            },
        );
        if (!response.ok)
            throw Error(`Upload failed for ${file}: ${response.status} ${await response.text()}`);
        uploaded++;
    }
    await pool.end();
    console.log(`Uploaded ${uploaded} private Reading images; ${missing} missing locally`);
})().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
