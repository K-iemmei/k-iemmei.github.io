const fs = require('node:fs');
const path = require('node:path');
const { pool } = require('../../apps/api/database-pool');
const output = path.resolve(__dirname, '../../database/exports/personal-data.json');
const sources = {
    personal_notes: 'SELECT * FROM personal_notes WHERE user_id=$1 ORDER BY id',
    note_assets: 'SELECT * FROM note_assets WHERE user_id=$1 ORDER BY id',
    blog_posts: 'SELECT * FROM blog_posts WHERE author_id=$1 ORDER BY note_id',
    vocabulary_decks: 'SELECT * FROM vocabulary_decks WHERE user_id=$1 ORDER BY id',
    vocabulary_cards:
        'SELECT c.* FROM vocabulary_cards c JOIN vocabulary_decks d ON d.id=c.deck_id WHERE d.user_id=$1 ORDER BY c.id',
    vocabulary_reviews: 'SELECT * FROM vocabulary_reviews WHERE user_id=$1 ORDER BY id',
    vocabulary_settings: 'SELECT * FROM vocabulary_settings WHERE user_id=$1',
    reading_attempts: 'SELECT * FROM reading_attempts WHERE user_id=$1 ORDER BY id',
    subject_daily_activity: 'SELECT * FROM subject_daily_activity WHERE user_id=$1 ORDER BY id',
    english_daily_results: 'SELECT * FROM english_daily_results WHERE user_id=$1 ORDER BY id',
    chinese_daily_results: 'SELECT * FROM chinese_daily_results WHERE user_id=$1 ORDER BY id',
    chinese_user_answers: 'SELECT * FROM chinese_user_answers WHERE user_id=$1 ORDER BY id',
};
(async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
        const users = await client.query('SELECT id,name,email FROM public.users ORDER BY id');
        const requested = process.env.LOCAL_USER_ID;
        const person = requested
            ? users.rows.find((row) => row.id === requested)
            : users.rows.length === 1
              ? users.rows[0]
              : null;
        if (!person) throw Error('Set LOCAL_USER_ID to the local account to export');
        const data = {
            created_at: new Date().toISOString(),
            local_user: { id: person.id, name: person.name, email: person.email },
            tables: {},
        };
        for (const [table, sql] of Object.entries(sources))
            data.tables[table] = (await client.query(sql, [person.id])).rows;
        fs.mkdirSync(path.dirname(output), { recursive: true });
        fs.writeFileSync(output, JSON.stringify(data));
        await client.query('COMMIT');
        console.log('Exported private progress to database/exports/personal-data.json');
        console.log(
            Object.fromEntries(
                Object.entries(data.tables).map(([name, rows]) => [name, rows.length]),
            ),
        );
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
})().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
