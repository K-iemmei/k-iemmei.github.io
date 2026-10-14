const assert = require('node:assert/strict');
const fs = require('node:fs');
const puppeteer = require('puppeteer');
const { createDevelopmentApp } = require('../../apps/api/development-server');
const { createTestDatabase } = require('../helpers/test-database.cjs');
const { manualReading } = require('../helpers/reading-fixture.cjs');
(async () => {
    const live = process.env.BROWSER_USE_DEV_DB === '1' || process.argv.includes('--live');
    const fixture = live
        ? {
              pool: require('../../apps/api/database-pool').pool,
              cleanup: () => require('../../apps/api/database-pool').pool.end(),
          }
        : await createTestDatabase();
    let username = 'test-learner',
        password = 'test-password';
    if (live) {
        const login = fs.readFileSync('.local/developer-login.txt', 'utf8');
        username = login.match(/^username:\s*(.+)$/im)[1].trim();
        password = login.match(/^password:\s*(.+)$/im)[1].trim();
    }
    const server = createDevelopmentApp({
        database: {
            query: (...args) => fixture.pool.query(...args),
            connect: () => fixture.pool.connect(),
        },
    }).listen(live ? 8000 : 0, '127.0.0.1');
    await new Promise((resolve, reject) => {
        server.once('listening', resolve);
        server.once('error', reject);
    });
    let browser;
    try {
        browser = await puppeteer.launch({ headless: 'new', timeout: 20000 });
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (message) => {
            if (message.type() === 'error') errors.push(message.text());
        });
        const base = live ? 'http://localhost:8000' : 'http://127.0.0.1:' + server.address().port;
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (!request.url().startsWith(base)) return request.respond({ status: 200, body: '' });
            if (request.url().endsWith('favicon.ico')) return request.respond({ status: 204 });
            request.continue();
        });
        await page.goto(base + '/dashboard.html', { waitUntil: 'networkidle0' });
        assert.match(page.url(), /index.html/);
        await page.goto(base + '/', { waitUntil: 'networkidle0' });
        assert.equal(await page.$eval('body', (body) => body.dataset.page), 'login');
        await page.type('#username', username);
        await page.type('#password', password);
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('#loginForm button[type="submit"]'),
        ]);
        assert.match(page.url(), /dashboard.html/);
        assert.ok(!(await page.evaluate(() => document.cookie)).includes('my_note_session'));
        await page.goto(base + '/english-home.html', { waitUntil: 'networkidle0' });
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('a[href="english-reading-library.html"]'),
        ]);
        assert.ok(
            !(await page.$eval('#testGrid', (el) => el.textContent)).includes('cambridge-ielts-20'),
        );
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('a[href="admin.html"]'),
        ]);
        await page.waitForSelector('[data-path="passages.0.content"]');
        const model = manualReading(
            live ? 'manual-reading-learning-feedback' : 'browser-manual-reading',
        );
        model.passages[0].groups.find(
            (group) => group.group_type === 'sentence_completion',
        ).questions[0].prompt = 'Useful ___ identifies mistakes.';
        async function fill(path, value) {
            await page.$eval(
                `[data-path="${path}"]`,
                (element, value) => {
                    element.value = value;
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                },
                String(value),
            );
        }
        for (const key of ['title', 'slug', 'category', 'description', 'status'])
            await fill(key, model[key]);
        for (const [pi, passage] of model.passages.entries()) {
            if (pi) await page.click('[data-action="add-passage"]');
            const pp = `passages.${pi}`;
            await fill(pp + '.title', passage.title);
            await fill(pp + '.content', passage.content);
            for (const [gi, group] of passage.groups.entries()) {
                if (gi) await page.click(`[data-action="add-group"][data-pi="${pi}"]`);
                const gp = `${pp}.groups.${gi}`;
                await fill(gp + '.group_type', group.group_type);
                await fill(gp + '.title', group.title);
                await fill(gp + '.instructions', group.instructions);
                if (group.options.length)
                    await fill(
                        gp + '.options',
                        group.options.map((o) => o.id + ' | ' + o.text).join('\n'),
                    );
                if (group.metadata.summary)
                    await fill(gp + '.metadata.summary', group.metadata.summary);
                if (group.metadata.paragraphs)
                    await fill(gp + '.metadata.paragraphs', group.metadata.paragraphs);
                for (const [qi, question] of group.questions.entries()) {
                    if (qi)
                        await page.click(
                            `[data-action="add-question"][data-pi="${pi}"][data-gi="${gi}"]`,
                        );
                    const qp = `${gp}.questions.${qi}`;
                    await fill(qp + '.prompt', question.prompt);
                    if (question.options.length)
                        await fill(
                            qp + '.options',
                            question.options.map((o) => o.id + ' | ' + o.text).join('\n'),
                        );
                    if (question.metadata.label)
                        await fill(qp + '.metadata.label', question.metadata.label);
                    await fill(
                        qp + '.answer_key.answers',
                        question.answer_key.answers.join(
                            question.question_type === 'list_selection' ? ', ' : '\n',
                        ),
                    );
                    await fill(qp + '.metadata.explanation', question.metadata.explanation);
                }
                console.log('Authoring: ' + group.group_type);
            }
        }
        await page.click('#saveReadingButton');
        await page.waitForFunction(
            () => document.getElementById('authorMessage').dataset.kind === 'success',
            { timeout: 15000 },
        );
        const created = (
            await fixture.pool.query('SELECT id,version FROM reading_tests WHERE slug=$1', [
                model.slug,
            ])
        ).rows[0];
        assert.ok(created);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForSelector('#authorTestSelect option[value="' + created.id + '"]');
        await page.select('#authorTestSelect', created.id);
        await page.waitForFunction(
            () =>
                document.getElementById('authorTitle').value ===
                'Manual Reading: Learning and Feedback',
        );
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('#previewTestLink'),
        ]);
        await page.waitForSelector('.answer-input');
        assert.equal(await page.$$eval('#readingPassage > section', (els) => els.length), 2);
        assert.equal(await page.$$eval('.question-group', (els) => els.length), 11);
        assert.equal(await page.$$eval('.completion-text .inline-input', (els) => els.length), 1);
        assert.equal(
            await page.$$eval('.sentence-completion .inline-input', (els) => els.length),
            1,
        );
        let number = 0;
        for (const passage of model.passages)
            for (const group of passage.groups)
                for (const question of group.questions) {
                    number++;
                    const selector = `.answer-input[data-question-number="${number}"]`;
                    const kind = await page.$eval(selector, (el) =>
                        el.tagName === 'SELECT' ? 'select' : el.type,
                    );
                    if (kind === 'select')
                        await page.select(selector, question.answer_key.answers[0]);
                    else if (kind === 'checkbox')
                        for (const answer of question.answer_key.answers)
                            await page.click(selector + `[value="${answer}"]`);
                    else if (kind === 'radio')
                        await page.click(selector + `[value="${question.answer_key.answers[0]}"]`);
                    else await page.type(selector, question.answer_key.answers[0]);
                }
        await page.setViewport({ width: 390, height: 844 });
        await page.click('[data-panel=questions]');
        assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            true,
        );
        assert.match(await page.$eval('#answeredCount', (el) => el.textContent), /12 \/ 12/);
        await page.click('[data-panel=passage]');
        await page.click('[data-panel=questions]');
        assert.equal(
            await page.$eval('.completion-text .inline-input', (el) => el.value),
            'feedback',
        );
        await page.setViewport({ width: 1440, height: 1000 });
        await page.click('#submitAnswers');
        await page.waitForFunction(() =>
            document.getElementById('scoreSummary').textContent.includes('Saved'),
        );
        assert.match(await page.$eval('#scoreSummary', (el) => el.textContent), /100%/);
        const saved = (
            await fixture.pool.query('SELECT * FROM reading_attempts WHERE test_id=$1', [
                created.id,
            ])
        ).rows;
        assert.equal(saved.length, 1);
        assert.equal(saved[0].review.length, 12);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.click('#practiceHistoryButton');
        await page.click('.history-review-button');
        await page.waitForFunction(() => document.getElementById('answerReviewDialog').open);
        await page.goto(base + '/dashboard.html', { waitUntil: 'networkidle0' });
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('#logoutButton'),
        ]);
        await page.goto(base + '/home.html', { waitUntil: 'networkidle0' });
        assert.match(page.url(), /index.html/);
        assert.deepEqual(errors, []);
        console.log(
            'PASS: login-first, manual authoring 2 passages / 11 groups / 12 questions (10 types), real DB save/reload, practice 100%, review and logout.',
        );
    } finally {
        if (browser) await browser.close();
        await new Promise((resolve) => server.close(resolve));
        await fixture.cleanup();
    }
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
