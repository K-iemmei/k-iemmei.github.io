// Read-only audit. Book text and detailed findings stay in the gitignored .local directory.
const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');
const { validateTest } = require('../../apps/api/modules/reading/reading-validation');

function readingTree(data) {
    return data.reading_tests.map((test) => ({
        ...test,
        passages: data.reading_passages
            .filter((passage) => passage.test_id === test.id)
            .sort((a, b) => a.passage_order - b.passage_order)
            .map((passage) => ({
                ...passage,
                groups: data.reading_question_groups
                    .filter((group) => group.passage_id === passage.id)
                    .sort((a, b) => a.group_order - b.group_order)
                    .map((group) => ({
                        ...group,
                        questions: data.reading_questions
                            .filter((question) => question.group_id === group.id)
                            .sort((a, b) => a.question_order - b.question_order),
                    })),
            })),
    }));
}
const normalized = (text) => text.normalize('NFKC').replace(/\s+/g, ' ').trim();
function auditContent(data) {
    const findings = [];
    const add = (slug, kind, detail) => findings.push({ slug, kind, detail });
    const tests = readingTree(data);
    for (const test of tests) {
        try {
            // Historical archived imports may intentionally retain empty keys.
            validateTest(test.status === 'archived' ? { ...test, status: 'draft' } : test);
        } catch (error) {
            add(test.slug, 'invalid-reading', error.message);
        }
        const numbers = [];
        for (const passage of test.passages) {
            if (passage.content_html) {
                const $ = cheerio.load(passage.content_html);
                $('p,h1,h2,h3,h4,li').append(' ');
                const plain = normalized($.root().text());
                const content = normalized(passage.content);
                // Rich text may intentionally omit the title already shown by the page.
                const withoutTitle = normalized(
                    content.toLowerCase().startsWith(passage.title.toLowerCase())
                        ? content.slice(passage.title.length)
                        : content,
                );
                if (plain !== content && plain !== withoutTitle)
                    add(test.slug, 'passage-html-differs', passage.id);
            }
            for (const group of passage.groups) {
                const slots = [...(group.metadata?.summary || '').matchAll(/\{\{(\d+)\}\}/g)].map(
                    (match) => Number(match[1]),
                );
                const questionNumbers = group.questions.map(
                    (question) => question.metadata?.source_number,
                );
                for (const slot of slots)
                    if (!questionNumbers.includes(slot))
                        add(test.slug, 'unknown-summary-slot', { group: group.id, slot });
                const options = group.options || [];
                if (options.some((option) => option.id === 'NB'))
                    add(test.slug, 'instruction-in-options', group.id);
                for (const question of group.questions) {
                    if (question.metadata?.source_number)
                        numbers.push(question.metadata.source_number);
                    if (!question.answer_key?.answers?.length)
                        add(test.slug, 'ungraded-question', question.id);
                }
            }
        }
        if (new Set(numbers).size !== numbers.length)
            add(test.slug, 'duplicate-question-number', numbers);
    }
    for (const session of data.listening_sessions) {
        const slots = [...session.question_text.matchAll(/\((\d+)\)[\s._·…-]{3,}/g)].map((match) =>
            Number(match[1]),
        );
        if (new Set(slots).size !== slots.length)
            add(session.slug, 'duplicate-listening-slot', slots);
        for (const number of slots)
            if (number < session.first_question || number > session.last_question)
                add(session.slug, 'listening-slot-out-of-range', number);
        if (/Complete the notes/i.test(session.question_text))
            for (let number = session.first_question; number <= session.last_question; number++)
                if (!slots.includes(number)) add(session.slug, 'missing-listening-slot', number);
        if (!session.transcript?.trim()) add(session.slug, 'missing-transcript', session.id);
        const keyed = Object.keys(session.answer_key).length;
        if (keyed !== session.last_question - session.first_question + 1)
            add(session.slug, 'incomplete-listening-key', keyed);
    }
    return {
        counts: {
            readingTests: tests.length,
            activeReadingTests: tests.filter((test) => test.status !== 'archived').length,
            readingPassages: data.reading_passages.length,
            readingQuestions: data.reading_questions.length,
            listeningSessions: data.listening_sessions.length,
        },
        findings,
    };
}
module.exports = { auditContent, readingTree };

if (require.main === module) {
    const { pool } = require('../../apps/api/database-pool');
    (async () => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
            const data = {};
            for (const table of [
                'reading_tests',
                'reading_passages',
                'reading_question_groups',
                'reading_questions',
                'listening_sessions',
            ])
                data[table] = (await client.query(`SELECT * FROM public.${table}`)).rows;
            await client.query('COMMIT');
            const report = auditContent(data);
            const directory = path.resolve(__dirname, '../../.local/content-review');
            fs.mkdirSync(directory, { recursive: true });
            const filename = path.join(directory, 'audit-' + Date.now() + '.json');
            fs.writeFileSync(filename, JSON.stringify(report, null, 2));
            const kinds = {};
            for (const finding of report.findings)
                kinds[finding.kind] = (kinds[finding.kind] || 0) + 1;
            console.log(JSON.stringify({ ...report.counts, findings: kinds, report: filename }));
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
}
