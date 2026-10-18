// Apply an explicitly reviewed private JSON plan; preserve row IDs and attempt history.
const fs = require('node:fs');
const path = require('node:path');
const { isDeepStrictEqual } = require('node:util');
const { auditContent } = require('./audit-learning-content.cjs');
const allowed = {
    reading_tests: ['title', 'description'],
    reading_passages: ['title', 'content', 'content_html'],
    reading_question_groups: ['title', 'instructions', 'options', 'metadata'],
    reading_questions: ['prompt', 'options', 'metadata'],
    listening_sessions: ['title', 'question_text', 'transcript'],
};
function validatePlan(plan) {
    if (!Array.isArray(plan) || !plan.length) throw Error('Expected a non-empty review plan');
    const seen = new Set();
    for (const edit of plan) {
        if (
            !allowed[edit.table]?.includes(edit.field) ||
            !/^[0-9a-f-]{36}$/i.test(edit.id) ||
            !Object.hasOwn(edit, 'before') ||
            !Object.hasOwn(edit, 'after') ||
            typeof edit.reason !== 'string' ||
            !edit.reason.trim()
        )
            throw Error(
                'Invalid edit: a permitted field, UUID, before/after and reason are required',
            );
        const key = `${edit.table}/${edit.id}/${edit.field}`;
        if (seen.has(key)) throw Error('Duplicate edit: ' + key);
        seen.add(key);
        if (
            (typeof edit.before === 'string' && typeof edit.after !== 'string') ||
            (Array.isArray(edit.before) && !Array.isArray(edit.after)) ||
            (edit.before &&
                typeof edit.before === 'object' &&
                !Array.isArray(edit.before) &&
                (!edit.after || typeof edit.after !== 'object' || Array.isArray(edit.after)))
        )
            throw Error('Review cannot change a field type: ' + key);
    }
    return plan;
}
async function applyReview(pool, input, { apply = false } = {}) {
    const plan = validatePlan(input);
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // Parent locks match authoring's lock order. Every field is checked again
        // before updating so a review cannot overwrite subsequent author edits.
        const tests = (await client.query('SELECT * FROM reading_tests ORDER BY id FOR UPDATE'))
            .rows;
        const data = { reading_tests: tests };
        for (const table of Object.keys(allowed).filter((table) => table !== 'reading_tests'))
            data[table] = (
                await client.query(`SELECT * FROM ${table} ORDER BY id FOR UPDATE`)
            ).rows;
        const beforeFindings = auditContent(data).findings;
        const changed = [];
        const testIds = new Set();
        const listeningIds = new Set();
        for (const edit of plan) {
            const row = data[edit.table].find((row) => row.id === edit.id);
            if (!row) throw Error(`Reviewed row no longer exists: ${edit.table}/${edit.id}`);
            if (isDeepStrictEqual(row[edit.field], edit.after)) continue;
            if (!isDeepStrictEqual(row[edit.field], edit.before))
                throw Error(`Content changed since review: ${edit.table}/${edit.id}/${edit.field}`);
            row[edit.field] = edit.after;
            changed.push(edit);
            let testId;
            if (edit.table === 'reading_tests') testId = row.id;
            if (edit.table === 'reading_passages') testId = row.test_id;
            if (edit.table === 'reading_question_groups')
                testId = data.reading_passages.find(
                    (passage) => passage.id === row.passage_id,
                ).test_id;
            if (edit.table === 'reading_questions') {
                const group = data.reading_question_groups.find(
                    (group) => group.id === row.group_id,
                );
                testId = data.reading_passages.find(
                    (passage) => passage.id === group.passage_id,
                ).test_id;
            }
            if (testId) testIds.add(testId);
            if (edit.table === 'listening_sessions') listeningIds.add(row.id);
        }
        const findings = auditContent(data).findings;
        const prior = new Set(beforeFindings.map((finding) => JSON.stringify(finding)));
        const introduced = findings.filter((finding) => !prior.has(JSON.stringify(finding)));
        if (introduced.length)
            throw Error('Review introduces content audit findings: ' + JSON.stringify(introduced));
        if (apply) {
            for (const edit of changed) {
                const value =
                    typeof edit.after === 'object' ? JSON.stringify(edit.after) : edit.after;
                await client.query(`UPDATE ${edit.table} SET ${edit.field}=$1 WHERE id=$2`, [
                    value,
                    edit.id,
                ]);
            }
            if (testIds.size)
                await client.query(
                    'UPDATE reading_tests SET version=version+1,updated_at=now() WHERE id=ANY($1::uuid[])',
                    [[...testIds]],
                );
            if (listeningIds.size)
                await client.query(
                    'UPDATE listening_sessions SET updated_at=now() WHERE id=ANY($1::uuid[])',
                    [[...listeningIds]],
                );
            await client.query('COMMIT');
        } else await client.query('ROLLBACK');
        return {
            applied: apply,
            fields: changed.length,
            readingTests: testIds.size,
            listeningSessions: listeningIds.size,
            findings: findings.length,
        };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}
module.exports = { validatePlan, applyReview };
if (require.main === module) {
    const { pool } = require('../../apps/api/database-pool');
    (async () => {
        try {
            const filename = process.argv[2];
            if (!filename || filename.startsWith('--'))
                throw Error(
                    'Usage: node tools/database/apply-content-review.cjs <private-plan.json> [--apply]',
                );
            const plan = JSON.parse(
                fs.readFileSync(path.resolve(filename), 'utf8').replace(/^\uFEFF/, ''),
            );
            console.log(
                JSON.stringify(
                    await applyReview(pool, plan, { apply: process.argv.includes('--apply') }),
                ),
            );
        } finally {
            await pool.end();
        }
    })().catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    });
}
