const assert = require('node:assert/strict'),
    fs = require('node:fs'),
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
        browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage(),
            errors = [];
        let delayNextSave = false;
        page.on('pageerror', (error) => errors.push(error.message));
        await page.setRequestInterception(true);
        page.on('request', async (request) => {
            if (
                delayNextSave &&
                request.method() === 'PUT' &&
                request.url().includes('/priority/')
            ) {
                delayNextSave = false;
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            request.url().startsWith(base)
                ? request.continue()
                : request.respond({ status: 200, body: '' });
        });
        await page.setViewport({ width: 1440, height: 1000 });
        await page.goto(base + '/index.html', { waitUntil: 'networkidle0' });
        await page.evaluate(async () => {
            await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'test-learner', password: 'test-password' }),
            });
        });
        await page.goto(base + '/vocabulary.html', { waitUntil: 'networkidle0' });
        await page.waitForSelector('.priority-check:not(:disabled)');
        assert.equal(await page.$$eval('.priority-word', (els) => els.length), 36);
        assert.equal(await page.$$eval('.priority-check', (els) => els.length), 180);
        const id = await page.$eval('.priority-word', (el) => el.dataset.word);
        assert.equal(await page.$eval('.priority-definition', (el) => el.open), false);
        assert(
            await page.$eval(
                '.priority-definition',
                (el) => el.getBoundingClientRect().height < 40,
            ),
        );
        async function tick(round, count) {
            await page.click(`[data-word="${id}"] [data-round="${round}"]`);
            await page.waitForFunction(
                (id, count) =>
                    document
                        .querySelector(`[data-word="${id}"]`)
                        ?.querySelectorAll('[aria-checked="true"]').length === count &&
                    !!document.querySelector(`[data-word="${id}"] button:not(:disabled)`),
                {},
                id,
                count,
            );
        }
        // Re-render the same card through search while its save is in flight.
        delayNextSave = true;
        await page.click(`[data-word="${id}"] [data-round="1"]`);
        await page.$eval('#prioritySearch', (el) => {
            el.value = 'abolish';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await page.waitForFunction(() => document.querySelectorAll('.priority-word').length === 1);
        await page.waitForSelector('.priority-check.is-checked');
        await page.$eval('#prioritySearch', (el) => {
            el.value = '';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await page.waitForFunction(() => document.querySelectorAll('.priority-word').length === 36);
        await page.select('#priorityRounds', '1');
        await page.waitForFunction(() => document.querySelectorAll('.priority-word').length === 1);
        assert.equal(await page.$$eval('.priority-check.is-checked', (els) => els.length), 1);
        await page.select('#priorityRounds', '');
        await page.waitForFunction(() => document.querySelectorAll('.priority-word').length === 36);
        for (let i = 2; i <= 5; i++) await tick(i, i);
        assert(await page.$(`[data-word="${id}"].is-mastered .priority-mastered`));
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForSelector(`[data-word="${id}"].is-mastered`);
        await page.click(`[data-word="${id}"] .priority-definition summary`);
        await page.click(`[data-word="${id}"] .priority-examples summary`);
        await tick(5, 4);
        assert.equal(
            await page.$eval(`[data-word="${id}"] .priority-definition`, (el) => el.open),
            true,
        );
        assert.equal(
            await page.$eval(`[data-word="${id}"] .priority-examples`, (el) => el.open),
            false,
        );
        assert.equal(await page.$(`[data-word="${id}"].is-mastered`), null);
        await page.select('#priorityRounds', '4');
        await page.waitForFunction(() => document.querySelectorAll('.priority-word').length === 1);
        for (const count of ['1', '2', '3', '5']) {
            await page.select('#priorityRounds', count);
            await page.waitForFunction(
                () => document.querySelectorAll('.priority-word').length === 0,
            );
        }
        await page.select('#priorityRounds', '');
        await page.click('[data-letter="C"]');
        await page.waitForSelector('#priority-group-C');
        assert.equal(await page.$$eval('.priority-letter-group', (els) => els.length), 1);
        await page.type('#prioritySearch', 'counter');
        await page.waitForFunction(() => document.querySelectorAll('.priority-word').length === 3);
        assert.match(await page.$eval('#priorityWords', (el) => el.textContent), /phản bác/);
        await page.$eval('#prioritySearch', (el) => {
            el.value = '';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await page.click('[data-letter=""]');
        await page.waitForFunction(() => document.querySelectorAll('.priority-word').length === 36);
        await page.click('#priorityMore');
        await page.waitForFunction(() => document.querySelectorAll('.priority-word').length === 72);
        await page.click('.priority-examples summary');
        assert.match(await page.$eval('.priority-examples', (el) => el.textContent), /abolish/i);
        fs.mkdirSync('.local/priority-vocab/preview', { recursive: true });
        for (const width of [1440, 780, 390, 320]) {
            await page.setViewport({ width, height: 1000 });
            for (const theme of ['light', 'dark']) {
                await page.evaluate(
                    (theme) => (document.documentElement.dataset.theme = theme),
                    theme,
                );
                assert(
                    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
                    'overflow ' + width + ' ' + theme,
                );
                if (width === 1440 || width === 390)
                    await page.screenshot({
                        path: `.local/priority-vocab/preview/${width}-${theme}.png`,
                    });
            }
        }
        await page.click('#ankiTab');
        await page.waitForFunction(
            () => !document.querySelector('#activitySummary').textContent.includes('Loading'),
        );
        assert.equal(await page.$eval('#priorityPanel', (el) => el.hidden), true);
        assert.equal(await page.$eval('.intro-actions', (el) => el.hidden), false);
        await page.click('#priorityTab');
        assert.equal(await page.$eval('#ankiPanel', (el) => el.hidden), true);
        assert.deepEqual(errors, []);
        console.log(
            'PASS: priority words, five passes/undo/reload, exact filters, A–Z, search, pagination, Anki tab, mobile and dark/light.',
        );
    } finally {
        if (browser) await browser.close();
        if (server) {
            server.closeAllConnections();
            await new Promise((r) => server.close(r));
        }
        await f.cleanup();
    }
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
