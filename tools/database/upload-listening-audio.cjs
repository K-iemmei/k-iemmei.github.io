const fs = require('node:fs');
const path = require('node:path');
const { pool } = require('../../apps/api/database-pool');
const root = path.resolve(__dirname, '../..');
(async () => {
    const url = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!/^https:\/\/[a-z0-9.-]+\.supabase\.co$/i.test(url) || !key)
        throw Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY locally');
    const rows = (await pool.query('SELECT audio_filename FROM public.listening_sessions')).rows;
    let uploaded = 0,
        missing = 0;
    for (const { audio_filename: filename } of rows) {
        if (!/^0-cam\d+-test-[1-4]-part-[1-4]\.mp3$/.test(filename))
            throw Error('Unsafe audio filename');
        const file = [
            path.join(root, 'data/imports/listening-audio', filename),
            path.join(root, 'data/imports', filename),
            path.join(root, 'data', filename),
        ].find((candidate) => fs.existsSync(candidate));
        if (!file) {
            missing++;
            continue;
        }
        const response = await fetch(`${url}/storage/v1/object/listening-audio/${filename}`, {
            method: 'POST',
            headers: {
                apikey: key,
                Authorization: `Bearer ${key}`,
                'Content-Type': 'audio/mpeg',
                'x-upsert': 'true',
            },
            body: fs.readFileSync(file),
        });
        if (!response.ok)
            throw Error(
                `Upload failed for ${filename}: ${response.status} ${await response.text()}`,
            );
        uploaded++;
    }
    console.log(`Uploaded ${uploaded} Listening MP3 files; ${missing} not present yet`);
})()
    .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
