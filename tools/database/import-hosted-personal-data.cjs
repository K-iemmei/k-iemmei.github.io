const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');
const source = path.resolve(__dirname, '../../database/exports/personal-data.json');
const ordered = [
    'vocabulary_decks',
    'vocabulary_cards',
    'vocabulary_reviews',
    'vocabulary_settings',
    'reading_attempts',
    'subject_daily_activity',
    'english_daily_results',
    'chinese_daily_results',
    'chinese_user_answers',
];
(async () => {
    const url = process.env.HOSTED_DATABASE_URL,
        hosted = process.env.HOSTED_USER_ID;
    if (!url || !hosted || !/^[0-9a-f-]{36}$/i.test(hosted))
        throw Error('Set HOSTED_DATABASE_URL and HOSTED_USER_ID');
    const data = JSON.parse(fs.readFileSync(source, 'utf8'));
    const client = new Client({ connectionString: url });
    await client.connect();
    try {
        await client.query('BEGIN');
        const auth = await client.query('SELECT id,email FROM auth.users WHERE id=$1', [hosted]);
        if (!auth.rowCount) throw Error('Hosted Auth user does not exist');
        await client.query(
            'INSERT INTO public.hosted_members(user_id) VALUES($1) ON CONFLICT DO NOTHING',
            [hosted],
        );
        await client.query(
            'INSERT INTO public.users(id,email,name) VALUES($1,$2,$3) ON CONFLICT(id) DO NOTHING',
            [hosted, auth.rows[0].email, data.local_user.name || 'Learner'],
        );
        await client.query(
            'UPDATE public.reading_tests SET created_by=$1 WHERE created_by IS NULL',
            [hosted],
        );
        for (const table of ordered) {
            const rows = (data.tables[table] || []).map((row) =>
                'user_id' in row ? { ...row, user_id: hosted } : row,
            );
            if (!rows.length) continue;
            const columns = Object.keys(rows[0]);
            if (columns.some((column) => !/^[a-z_]+$/.test(column)))
                throw Error('Invalid export column');
            const quoted = columns.map((column) => '"' + column + '"').join(',');
            await client.query(
                `INSERT INTO public."${table}" (${quoted}) SELECT ${quoted} FROM jsonb_populate_recordset(NULL::public."${table}",$1::jsonb) ON CONFLICT DO NOTHING`,
                [JSON.stringify(rows)],
            );
            console.log(table, rows.length);
        }
        await client.query('COMMIT');
        console.log('Imported private progress for hosted Auth user');
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
