const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');
const { root, databaseOptions } = require('../../apps/api/config/environment');
// Content is portable. Local credentials/sessions and personal attempts are intentionally excluded.
const tables = [
    'subjects',
    'topics',
    'english_lessons',
    'english_lesson_sections',
    'english_questions',
    'english_listening_lessons',
    'english_listening_questions',
    'chinese_lessons',
    'chinese_lesson_parts',
    'chinese_questions',
    'reading_tests',
    'reading_passages',
    'reading_question_groups',
    'reading_questions',
];
async function exportSupabase(
    options = databaseOptions(),
    output = path.join(root, 'database/exports'),
) {
    const client = new Client(options);
    await client.connect();
    fs.mkdirSync(output, { recursive: true });
    try {
        await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
        const schema = fs
            .readdirSync(path.join(root, 'database/migrations'))
            .filter((f) => f.endsWith('.sql'))
            .sort()
            .map(
                (file) =>
                    '-- ' +
                    file +
                    '\n' +
                    fs.readFileSync(path.join(root, 'database/migrations', file), 'utf8'),
            )
            .join('\n');
        fs.writeFileSync(path.join(output, 'schema.sql'), 'BEGIN;\n' + schema + '\nCOMMIT;\n');
        const statements = ['BEGIN;'];
        const counts = {};
        for (const table of tables) {
            const result = await client.query('SELECT * FROM public."' + table + '" ORDER BY id');
            if (table === 'reading_tests')
                result.rows.forEach((row) => {
                    row.created_by = null;
                });
            counts[table] = result.rows.length;
            if (!result.rows.length) continue;
            const columns = result.fields.map((field) => '"' + field.name + '"').join(',');
            const json = JSON.stringify(result.rows).replace(/'/g, "''");
            statements.push(
                'INSERT INTO public."' +
                    table +
                    '" (' +
                    columns +
                    ') SELECT ' +
                    columns +
                    ' FROM jsonb_populate_recordset(NULL::public."' +
                    table +
                    '", \'' +
                    json +
                    "'::jsonb) ON CONFLICT DO NOTHING;",
            );
        }
        statements.push('COMMIT;');
        fs.writeFileSync(path.join(output, 'content.sql'), statements.join('\n') + '\n');
        fs.writeFileSync(
            path.join(output, 'manifest.json'),
            JSON.stringify(
                {
                    createdAt: new Date().toISOString(),
                    tables: counts,
                    excluded: ['app_private', 'users', 'attempts', 'daily_results'],
                    target: 'empty PostgreSQL application schema; configure hosted authorization separately',
                },
                null,
                2,
            ),
        );
        await client.query('COMMIT');
        console.log('Exported local schema and content to ' + path.relative(root, output));
        return counts;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        await client.end();
    }
}
module.exports = { exportSupabase };
if (require.main === module)
    exportSupabase().catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    });
