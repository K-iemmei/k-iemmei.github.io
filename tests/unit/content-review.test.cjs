const test = require('node:test');
const assert = require('node:assert/strict');
const { auditContent } = require('../../tools/database/audit-learning-content.cjs');
const { validatePlan } = require('../../tools/database/apply-content-review.cjs');

test('Listening inline blanks preserve worksheet lines, punctuation and escaped text', async () => {
    const { renderWorksheet } =
        await import('../../apps/web/src/features/english/listening-worksheet.js');
    const html = renderWorksheet(
        'Answer (31) ______.\n\nNext (32) ......\n<script>bad()</script> (40) ______',
        {
            first_question: 31,
            last_question: 32,
        },
    );
    assert.equal((html.match(/class="inline-answer"/g) || []).length, 2);
    assert.match(html, /\/>\.\n\nNext/);
    assert.match(html, /\/>\n&lt;script&gt;/);
    assert.match(html, /\(40\) ______/);
    assert(!html.includes('<script>'));
});

test('content audit detects broken Listening blanks without exposing answer text', () => {
    const data = {
        reading_tests: [],
        reading_passages: [],
        reading_question_groups: [],
        reading_questions: [],
        listening_sessions: [
            {
                id: 'session',
                slug: 'listening-test',
                first_question: 31,
                last_question: 32,
                question_text: 'Complete the notes. (31) ______ (31) ______ (40) ______',
                transcript: 'Private reference transcript.',
                answer_key: { 31: 'private-answer' },
            },
        ],
    };
    const result = auditContent(data);
    assert(result.findings.some((row) => row.kind === 'duplicate-listening-slot'));
    assert(
        result.findings.some((row) => row.kind === 'missing-listening-slot' && row.detail === 32),
    );
    assert(result.findings.some((row) => row.kind === 'listening-slot-out-of-range'));
    assert(!JSON.stringify(result).includes('private-answer'));
});

test('review plans reject answer-key, ownership and schema edits and duplicate fields', () => {
    const edit = {
        table: 'reading_questions',
        id: '10000000-0000-4000-8000-000000000001',
        field: 'prompt',
        before: 'Old wording',
        after: 'Corrected wording',
        reason: 'Source checked',
    };
    assert.equal(validatePlan([edit]).length, 1);
    for (const field of ['answer_key', 'created_by', 'id'])
        assert.throws(() => validatePlan([{ ...edit, field }]), /Invalid edit/);
    assert.throws(() => validatePlan([edit, edit]), /Duplicate edit/);
    assert.throws(
        () => validatePlan([{ ...edit, table: 'reading_questions; DROP TABLE users' }]),
        /Invalid edit/,
    );
    assert.throws(() => validatePlan([{ ...edit, after: [] }]), /field type/);
});
