const fs = require('node:fs');
const path = require('node:path');
const { validateTest } = require('../../apps/api/modules/reading/reading-validation');
const { createReadingRepository } = require('../../apps/api/modules/reading/reading-repository');

async function importReading(input, { database, userId, dryRun = false }) {
    if (!Array.isArray(input) || !input.length)
        throw new Error('Expected a non-empty JSON array of reading tests');
    // Validate the entire input before any write. Never overwrite an existing slug.
    const tests = input.map(validateTest);
    if (new Set(tests.map((test) => test.slug)).size !== tests.length)
        throw new Error('Duplicate slugs in import file');
    const owner = await database.query('SELECT id FROM public.users WHERE id=$1', [userId]);
    if (!owner.rows.length) throw new Error('Author account not found');
    const repository = createReadingRepository(database);
    const report = [];
    for (const test of tests) {
        const existing = await database.query('SELECT id FROM public.reading_tests WHERE slug=$1', [
            test.slug,
        ]);
        const questions = test.passages.flatMap((p) => p.groups.flatMap((g) => g.questions));
        if (existing.rows.length) {
            report.push({ slug: test.slug, action: 'skipped-existing', id: existing.rows[0].id });
            continue;
        }
        const row = dryRun ? null : await repository.save(test, userId);
        report.push({
            slug: test.slug,
            action: dryRun ? 'validated' : 'created',
            id: row?.id,
            status: test.status,
            passages: test.passages.length,
            questions: questions.length,
            ungraded: questions.filter((q) => !q.answer_key.answers.length).length,
        });
    }
    return report;
}
module.exports = { importReading };
if (require.main === module) {
    const { pool } = require('../../apps/api/database-pool');
    (async () => {
        try {
            const filename = process.argv[2];
            if (!filename || filename.startsWith('--'))
                throw new Error(
                    'Usage: node tools/database/import-reading.cjs <local-json-file> [--dry-run]',
                );
            let username = process.env.LOCAL_USERNAME;
            if (!username) {
                const { root } = require('../../apps/api/config/environment');
                const login = fs.readFileSync(
                    path.join(root, '.local/developer-login.txt'),
                    'utf8',
                );
                username = login.match(/^username:\s*(.+)$/im)?.[1].trim();
            }
            if (!username)
                throw new Error('Set LOCAL_USERNAME or provide .local/developer-login.txt');
            const owner = await pool.query('SELECT id FROM public.users WHERE username=$1', [
                username,
            ]);
            if (!owner.rows.length) throw new Error('Author account not found');
            const result = await importReading(JSON.parse(fs.readFileSync(filename, 'utf8')), {
                database: pool,
                userId: owner.rows[0].id,
                dryRun: process.argv.includes('--dry-run'),
            });
            console.log(JSON.stringify(result, null, 2));
        } finally {
            await pool.end();
        }
    })().catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    });
}
