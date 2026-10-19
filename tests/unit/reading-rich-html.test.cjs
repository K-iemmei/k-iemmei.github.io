const test = require('node:test'),
    assert = require('node:assert/strict');
const { manualReading } = require('../helpers/reading-fixture.cjs');
const { validateTest } = require('../../apps/api/modules/reading/reading-validation');
test('Reading HTML retains tables and cell spans, removes executable markup and derives readable text', async () => {
    const { sanitizeReadingHtml, readingHtmlText, readingMarkup, legacyTableMarkup } =
        await import('../../apps/web/src/domain/reading-html.js');
    const html =
        '<table style="position:fixed"><caption>Facts</caption><tbody><tr><th scope="row">One</th><td colspan="2" onclick="alert(1)"><strong>Useful</strong> &amp; safe</td></tr></tbody></table><script>alert(1)</script><img src=x onerror=alert(1)>';
    const safe = sanitizeReadingHtml(html);
    assert.match(safe, /<table>/);
    assert.match(safe, /colspan="2"/);
    assert.match(safe, /scope="row"/);
    assert.doesNotMatch(safe, /onclick|onerror|script|img|style=/);
    assert.match(readingHtmlText(safe), /Facts\nOne\tUseful & safe/);
    assert.match(readingMarkup('', 'One\n\nTwo'), /<p>One<\/p><p>Two<\/p>/);
    assert.match(
        legacyTableMarkup('Measurements:\nLength: {{1}}\nWidth: {{2}}', 'Complete the table.'),
        /<table>.*<th scope="row">Length<\/th><td>\{\{1\}\}<\/td>/,
    );
    assert.equal(legacyTableMarkup('Name: A\nType: B', 'Complete the summary.'), '');
});
test('local and hosted authoring persist passage, prompt and completion tables with synchronized plain text', async () => {
    const model = manualReading('rich-content-contract');
    const p = model.passages[0];
    p.content_html = '<p>Edited text</p><table><tr><td>Value</td></tr></table>';
    const g = p.groups.find((g) => g.group_type === 'summary_completion');
    g.metadata.summary_html = '<table><tr><td>Answer ___</td></tr></table>';
    g.metadata.instructions_html = '<p><strong>Complete the table.</strong></p>';
    g.questions[0].metadata.prompt_html = '<table><tr><td>Question text</td></tr></table>';
    const local = validateTest(model);
    assert.match(local.passages[0].content, /Edited text/);
    assert.match(local.passages[0].content_html, /<table>/);
    const localGroup = local.passages[0].groups.find((g) => g.group_type === 'summary_completion');
    assert.equal(localGroup.metadata.summary, 'Answer ___');
    assert.equal(localGroup.instructions, 'Complete the table.');
    assert.equal(localGroup.questions[0].prompt, 'Question text');
    const { readingApi } = await import('../../supabase/functions/app-api/reading.ts');
    let saved;
    const admin = {
        rpc: async (name, args) => {
            saved = args.p_test;
            return { data: 'id' };
        },
        from: () => ({
            select() {
                return this;
            },
            eq() {
                return this;
            },
            single: async () => ({ data: { id: 'id' } }),
        }),
    };
    await readingApi(admin, { id: 'me' }, 'reading/author/tests', 'POST', structuredClone(model));
    assert.equal(saved.passages[0].content_html, local.passages[0].content_html);
    assert.equal(saved.passages[0].content, local.passages[0].content);
    const hostedGroup = saved.passages[0].groups.find((g) => g.group_type === 'summary_completion');
    assert.equal(hostedGroup.metadata.summary_html, localGroup.metadata.summary_html);
    assert.equal(
        hostedGroup.questions[0].metadata.prompt_html,
        localGroup.questions[0].metadata.prompt_html,
    );
    const unsafe = structuredClone(model);
    unsafe.passages[0].content_html = '<script>alert(1)</script>';
    assert.throws(() => validateTest(unsafe), /unsafe/i);
    await assert.rejects(
        readingApi(admin, { id: 'me' }, 'reading/author/tests', 'POST', unsafe),
        /unsafe/i,
    );
});
