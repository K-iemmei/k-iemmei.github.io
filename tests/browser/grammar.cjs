const assert = require('node:assert/strict'),
    fs = require('fs'),
    puppeteer = require('puppeteer');
const { createTestDatabase } = require('../helpers/test-database.cjs');
const { createDevelopmentApp } = require('../../apps/api/development-server');
(async () => {
    const f = await createTestDatabase();
    let server, browser;
    try {
        server = createDevelopmentApp({ database: f.pool }).listen(0, '127.0.0.1');
        await new Promise((r) => server.once('listening', r));
        const base = 'http://127.0.0.1:' + server.address().port;
        browser = await puppeteer.launch({ headless: 'new', timeout: 20000 });
        const page = await browser.newPage(),
            errors = [];
        page.on('pageerror', (e) => errors.push(e.message));
        await page.setViewport({ width: 1440, height: 1000 });
        await page.setRequestInterception(true);
        page.on('request', (r) =>
            r.url().startsWith(base) ? r.continue() : r.respond({ status: 200, body: '' }),
        );
        await page.goto(base + '/english-grammar.html', { waitUntil: 'networkidle0' });
        assert.match(page.url(), /index.html$/);
        await page.evaluate(async () => {
            await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'test-learner', password: 'test-password' }),
            });
        });
        await page.goto(base + '/english-grammar.html', { waitUntil: 'networkidle0' });
        await page.waitForSelector('.grammar-lesson-row');
        assert.equal(await page.$$eval('.grammar-lesson-row', (els) => els.length), 145);
        assert.equal(await page.$$eval('.grammar-unit-card', (els) => els.length), 16);
        await page.select('#grammarStatus', 'ready');
        assert.equal(await page.$$eval('.grammar-lesson-row', (els) => els.length), 145);
        await page.select('#grammarStatus', 'all');
        await page.type('#grammarSearch', 'away/back');
        assert.equal(await page.$$eval('.grammar-lesson-row', (els) => els.length), 1);
        await page.$eval('#grammarSearch', (el) => {
            el.value = '';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        assert.equal(await page.$$eval('.grammar-unit-card[open]', (els) => els.length), 1);
        assert.equal(
            await page.$$eval('.grammar-lesson-row .grammar-round-dots i', (els) => els.length),
            725,
        );
        for (const width of [1440, 780, 390, 320]) {
            await page.setViewport({ width, height: 900 });
            assert(
                await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
                'library overflow ' + width,
            );
        }
        await page.setViewport({ width: 1440, height: 1000 });
        fs.mkdirSync('.local/grammar-book-preview', { recursive: true });
        await page.screenshot({ path: '.local/grammar-book-preview/library-light.png' });
        await page.click('a[href="english-grammar.html?lesson=giu-001"]');
        await page.waitForSelector('#grammarQuiz');
        assert.equal(await page.$$eval('.grammar-example', (els) => els.length), 6);
        assert.equal(await page.$$eval('.grammar-exercise', (els) => els.length), 8);
        assert.equal(
            (await page.evaluate(async () => await (await fetch('/api/grammar')).json())).progress
                .length,
            0,
        );
        await page.click('#grammarStartRound');
        await page.waitForFunction(() => !document.querySelector('#grammarRead').disabled);
        await page.click('#grammarRead');
        await page.waitForFunction(() => document.querySelector('#grammarRead').disabled);
        const { bookLessons } =
            await import('../../apps/web/src/features/grammar/content/book-lessons.js');
        async function fill(mode, wrong) {
            await page.select('#grammarMode', mode);
            const answers = Object.fromEntries(
                bookLessons[1].questions
                    .filter((q) => q.mode === mode)
                    .map((q) => [q.id, wrong ? 'wrong' : q.answers[0]]),
            );
            await page.evaluate((answers) => {
                for (const [name, value] of Object.entries(answers)) {
                    const input = document.querySelector('[name="' + name + '"]');
                    if (input.type === 'radio') {
                        [...document.querySelectorAll('[name="' + name + '"]')].find(
                            (e) => e.value === value,
                        ).checked = true;
                    } else input.value = value;
                }
            }, answers);
            await page.click('#grammarQuiz button[type="submit"]');
            await page.waitForFunction(
                () => !!document.querySelector('#grammarQuizResult')?.textContent,
            );
        }
        await fill('quick', false);
        assert.match(await page.$eval('#grammarQuizResult', (el) => el.textContent), /8\/8/);
        await page.waitForSelector('#grammarQuiz button:not(:disabled)');
        await fill('assessment', false);
        assert.match(await page.$eval('#grammarQuizResult', (el) => el.textContent), /5\/5/);
        assert.equal(
            await page.$eval('#grammarProgressCount', (el) => el.textContent),
            '1 / 725 lượt',
        );
        await page.type('#giu-001-s1', 'I am preparing a release. I am not changing the database.');
        await page.click('[data-save-writing="giu-001-s1"]');
        await page.waitForFunction(() =>
            document.getElementById('giu-001-s1-status').textContent.includes('Đã lưu'),
        );
        await page.evaluate(() =>
            localStorage.removeItem('grammar-book-v1:' + localStorage.getItem('userId')),
        );
        await page.reload({ waitUntil: 'networkidle0' });
        assert.match(await page.$eval('#giu-001-s1', (el) => el.value), /preparing a release/);
        assert.equal(
            await page.$eval('#grammarProgressCount', (el) => el.textContent),
            '1 / 725 lượt',
        );
        await page.goto(base + '/english-grammar.html?lesson=giu-145', {
            waitUntil: 'networkidle0',
        });
        assert(await page.$('#grammarQuiz'));
        assert.match(
            await page.$eval('#grammarReader', (el) => el.textContent),
            /Ứng dụng & hội thoại/,
        );
        await page.goto(base + '/english-grammar.html?lesson=giu-001', {
            waitUntil: 'networkidle0',
        });
        for (const width of [1440, 780, 390, 320]) {
            await page.setViewport({ width, height: 900 });
            for (const theme of ['light', 'dark']) {
                await page.evaluate(
                    (theme) => (document.documentElement.dataset.theme = theme),
                    theme,
                );
                assert(
                    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
                    'overflow ' + width,
                );
                if ([1440, 390].includes(width))
                    await page.screenshot({
                        path: '.local/grammar-book-preview/lesson-' + width + '-' + theme + '.png',
                    });
            }
        }
        assert.deepEqual(errors, []);
        console.log(
            'PASS: verified book roadmap, practice, assessment completion, account drafts after reload, interactive Unit 145 and mobile/themes.',
        );
    } catch (e) {
        console.error('Grammar browser failure:', e);
        throw e;
    } finally {
        try {
            if (browser) await browser.close();
        } finally {
            if (server) {
                server.closeAllConnections();
                await new Promise((r) => server.close(r));
            }
            await f.cleanup();
        }
    }
})().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});
