const assert = require('node:assert/strict'),
    fs = require('node:fs'),
    puppeteer = require('puppeteer');
const { createDevelopmentApp } = require('../../apps/api/development-server');
const { createTestDatabase } = require('../helpers/test-database.cjs');
(async () => {
    const fixture = await createTestDatabase();
    const server = createDevelopmentApp({ database: fixture.pool }).listen(0, '127.0.0.1');
    await new Promise((r) => server.once('listening', r));
    let browser;
    try {
        browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 1000 });
        const base = 'http://127.0.0.1:' + server.address().port;
        await page.goto(base + '/');
        await page.type('#username', 'test-learner');
        await page.type('#password', 'test-password');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            page.click('#loginForm button'),
        ]);
        const model = {
            title: 'Reading rich content check',
            slug: 'reading-rich-browser',
            category: 'General Reading',
            status: 'published',
            description: '',
            passages: [
                {
                    title: 'Passage',
                    content: 'Original plain text',
                    content_html:
                        '<p>Read the schedule.</p><table><thead><tr><th>Session</th><th>Topic</th></tr></thead><tbody><tr><td>Morning</td><td>Feedback</td></tr></tbody></table>',
                    groups: [
                        {
                            group_type: 'summary_completion',
                            title: 'Complete the table',
                            instructions: 'Complete the table.',
                            options: [],
                            metadata: {
                                summary: 'One ___ Two ___',
                                summary_html:
                                    '<table><tbody><tr><th>Fact</th><th>Answer</th></tr><tr><td>First</td><td>{{1}}</td></tr><tr><td>Second</td><td>{{2}}</td></tr><tr><td>Reference</td><td>{{1}}</td></tr></tbody></table>',
                                source_pages: [
                                    { file: 'cambridge-1-p001.png', label: 'Original page' },
                                ],
                            },
                            questions: [
                                {
                                    question_type: 'summary_completion',
                                    prompt: 'Blank 1',
                                    options: [],
                                    answer_key: { answers: ['feedback'] },
                                    metadata: { source_number: 1 },
                                },
                                {
                                    question_type: 'summary_completion',
                                    prompt: 'Blank 2',
                                    options: [],
                                    answer_key: { answers: ['practice'] },
                                    metadata: { source_number: 2 },
                                },
                            ],
                        },
                        {
                            group_type: 'short_answer',
                            title: 'Short answer',
                            instructions: 'Write your answer.',
                            options: [],
                            metadata: {},
                            questions: [
                                {
                                    question_type: 'short_answer',
                                    prompt: 'What helps?',
                                    options: [],
                                    answer_key: { answers: ['feedback'] },
                                    metadata: {
                                        prompt_html:
                                            '<table><tr><th>Question</th></tr><tr><td>What helps?</td></tr></table>',
                                        source_number: 3,
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        const created = await page.evaluate(async (data) => {
            const r = await fetch('/api/reading/author/tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            return { status: r.status, data: await r.json() };
        }, model);
        assert.equal(created.status, 201);
        const errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        await page.goto(base + '/admin.html?test=' + model.slug, { waitUntil: 'networkidle0' });
        await page.waitForSelector('[data-rich-path="passages.0.content_html"] table');
        assert.equal(await page.$('[data-path="passages.0.content"]'), null);
        assert.equal(await page.$('textarea[data-path="passages.0.content_html"]'), null);
        await page.$eval('[data-rich-path="passages.0.content_html"] td', (cell) => {
            cell.textContent = 'Updated directly';
            cell.closest('[data-rich-path]').dispatchEvent(new Event('input', { bubbles: true }));
        });
        const prompt = '[data-rich-path="passages.0.groups.1.questions.0.metadata.prompt_html"]';
        await page.$eval(prompt, (e) => {
            e.focus();
            const range = document.createRange();
            range.selectNodeContents(e);
            range.collapse(false);
            const s = getSelection();
            s.removeAllRanges();
            s.addRange(range);
        });
        await new Promise((r) => setTimeout(r, 50));
        await page.$eval(prompt, (e) => {
            const dt = new DataTransfer();
            dt.setData(
                'text/html',
                '<table><tr><td colspan="2" style="color:red" onclick="alert(1)">Pasted table</td></tr></table>',
            );
            e.dispatchEvent(
                new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: dt }),
            );
        });
        assert.equal(
            await page.$eval(prompt + ' td[colspan="2"]', (e) => e.hasAttribute('onclick')),
            false,
        );
        await page.$eval('[data-rich-path="passages.0.content_html"]', (e) => {
            e.focus();
            const r = document.createRange();
            r.selectNodeContents(e);
            r.collapse(false);
            const s = getSelection();
            s.removeAllRanges();
            s.addRange(r);
        });
        await new Promise((r) => setTimeout(r, 50));
        const toolbar = '[data-rich-editor]:has([data-rich-path="passages.0.content_html"])';
        await page.click(toolbar + ' [data-rich-command="table"]');
        assert.equal(
            await page.$$eval('[data-rich-path="passages.0.content_html"] table', (e) => e.length),
            2,
        );
        await page.click('[data-rich-path="passages.0.content_html"] table:last-of-type td');
        await page.click(toolbar + ' [data-rich-command="row"]');
        assert.equal(
            await page.$$eval(
                '[data-rich-path="passages.0.content_html"] table:last-of-type tr',
                (e) => e.length,
            ),
            4,
        );
        await page.click('#saveReadingButton');
        await page.waitForFunction(
            () => document.querySelector('#authorMessage').dataset.kind === 'success',
        );
        const saved = await page.evaluate(
            async (id) => await (await fetch('/api/reading/author/tests/' + id)).json(),
            created.data.id,
        );
        assert.equal(saved.version, 2);
        assert.match(saved.passages[0].content_html, /Updated directly/);
        assert.match(saved.passages[0].content, /Updated directly/);
        assert.match(saved.passages[0].groups[0].metadata.summary_html, /<table>/);
        assert.match(saved.passages[0].groups[1].questions[0].metadata.prompt_html, /Pasted table/);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForSelector('[data-rich-path="passages.0.content_html"] table');
        assert.match(
            await page.$eval('[data-rich-path="passages.0.content_html"]', (e) => e.innerText),
            /Updated directly/,
        );
        await page.goto(base + '/english.html?test=' + model.slug, { waitUntil: 'networkidle0' });
        await page.waitForSelector('#readingPassage table');
        assert.equal(await page.$$eval('.answer-input', (e) => e.length), 3);
        assert.equal(await page.$$eval('.completion-text table .answer-input', (e) => e.length), 2);
        assert.equal(await page.$$eval('.blank-reference', (e) => e.length), 1);
        assert.equal(await page.$$eval('.question-prompt table', (e) => e.length), 2);
        assert.match(await page.$eval('#readingPassage', (e) => e.innerText), /Updated directly/);
        assert.equal(await page.$eval('#readingPassage details', (e) => e.open), false);
        fs.mkdirSync('.local/reading-rich-preview', { recursive: true });
        for (const width of [1440, 390]) {
            await page.setViewport({ width, height: 1000 });
            for (const theme of ['light', 'dark']) {
                await page.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
                await new Promise((r) => setTimeout(r, 200));
                assert.equal(
                    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
                    true,
                );
                await page.screenshot({
                    path: '.local/reading-rich-preview/' + width + '-' + theme + '.png',
                    fullPage: true,
                });
            }
        }
        assert.deepEqual(errors, []);
        console.log(
            'PASS direct formatted editor, insert/add row/paste tables, real DB save/reload, rich passage over source pages, question tables and unique inline answers, responsive light/dark',
        );
    } finally {
        if (browser) await browser.close();
        await new Promise((r) => server.close(r));
        await fixture.cleanup();
    }
})().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
