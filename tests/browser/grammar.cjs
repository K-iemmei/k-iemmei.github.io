const assert = require('node:assert/strict');
const fs = require('node:fs');
const puppeteer = require('puppeteer');
const { createTestDatabase } = require('../helpers/test-database.cjs');
const { createDevelopmentApp } = require('../../apps/api/development-server');

(async () => {
    const fixture = await createTestDatabase();
    let browser, server;
    try {
        server = createDevelopmentApp({ database: fixture.pool }).listen(0, '127.0.0.1');
        await new Promise((resolve) => server.once('listening', resolve));
        const base = `http://127.0.0.1:${server.address().port}`;
        browser = await puppeteer.launch({ headless: 'new', timeout: 20000 });
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.setViewport({ width: 1440, height: 1000 });
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (!request.url().startsWith(base)) return request.respond({ status: 200, body: '' });
            if (request.url().endsWith('favicon.ico')) return request.respond({ status: 204 });
            request.continue();
        });
        await page.goto(base + '/english-grammar.html', { waitUntil: 'networkidle0' });
        assert.match(page.url(), /index.html$/);
        await page.evaluate(async () => {
            await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'test-learner', password: 'test-password' }),
            });
        });
        await page.goto(base + '/english-home.html', { waitUntil: 'networkidle0' });
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('a[href="english-grammar.html"]'),
        ]);
        await page.waitForSelector('.grammar-lesson-row');
        assert.equal(await page.$$eval('.grammar-unit-card', (els) => els.length), 12);
        assert.equal(await page.$$eval('.grammar-lesson-row', (els) => els.length), 72);
        fs.mkdirSync('.local/grammar-preview', { recursive: true });
        await page.screenshot({ path: '.local/grammar-preview/library-light.png', fullPage: true });
        await page.type('#grammarSearch', 'dieu kien hon hop');
        assert.ok(await page.$('.grammar-lesson-row[data-lesson="mixed-conditionals"]'));
        await page.$eval('#grammarSearch', (input) => {
            input.value = 'no-such-grammar-point-xyz';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
        assert.equal(await page.$eval('#grammarEmpty', (el) => el.hidden), false);
        await page.click('#grammarResetFilters');
        await page.select('#grammarLevel', 'C1');
        assert.ok(await page.$('.grammar-lesson-row[data-lesson="negative-inversion"]'));
        assert.equal(await page.$('.grammar-lesson-row[data-lesson="articles"]'), null);
        await page.select('#grammarLevel', 'all');
        await page.click('.grammar-lesson-row[data-lesson="word-classes"]');
        await page.waitForSelector('#grammarQuiz');
        assert.match(page.url(), /lesson=word-classes/);
        assert.equal(
            await page.$eval('#grammarLessonTitle', (el) => el.textContent),
            'Parts of speech',
        );
        assert.equal(await page.$$eval('.grammar-rule', (els) => els.length), 3);
        assert.equal(await page.$$eval('.grammar-example', (els) => els.length), 2);
        await page.click('input[name="answer"][value="0"]');
        await page.click('#grammarQuiz button[type="submit"]');
        assert.match(await page.$eval('#grammarQuizFeedback', (el) => el.textContent), /Chưa đúng/);
        await page.click('#grammarQuiz button[type="reset"]');
        assert.equal(await page.$eval('#grammarQuizFeedback', (el) => el.hidden), true);
        await page.click('input[name="answer"][value="1"]');
        await page.click('#grammarQuiz button[type="submit"]');
        assert.match(await page.$eval('#grammarQuizFeedback', (el) => el.textContent), /Chính xác/);
        assert.equal(await page.$eval('#grammarProgressCount', (el) => el.textContent), '0 / 72');
        await page.click('#grammarSave');
        await page.click('#grammarComplete');
        assert.equal(
            await page.$eval('#grammarComplete', (el) => el.getAttribute('aria-pressed')),
            'true',
        );
        assert.equal(await page.$eval('#grammarProgressCount', (el) => el.textContent), '1 / 72');
        await page.click('.grammar-lesson-pagination a[data-lesson="sentence-patterns"]');
        assert.equal(
            await page.$eval('#grammarLessonTitle', (el) => el.textContent),
            'Sentence patterns',
        );
        await page.goBack({ waitUntil: 'domcontentloaded' });
        await page.waitForFunction(
            () => document.getElementById('grammarLessonTitle')?.textContent === 'Parts of speech',
        );
        assert.equal(
            await page.$eval('#grammarComplete', (el) => el.getAttribute('aria-pressed')),
            'true',
        );
        await page.reload({ waitUntil: 'networkidle0' });
        assert.equal(
            await page.$eval('#grammarSave', (el) => el.getAttribute('aria-pressed')),
            'true',
        );
        await page.click('.grammar-outline-back');
        await page.click('[data-status="completed"]');
        assert.equal(await page.$$eval('.grammar-lesson-row', (els) => els.length), 1);
        await page.click('[data-status="saved"]');
        assert.equal(await page.$$eval('.grammar-lesson-row', (els) => els.length), 1);
        await page.click('[data-status="remaining"]');
        assert.equal(await page.$$eval('.grammar-lesson-row', (els) => els.length), 71);
        await page.click('[data-status="all"]');
        // Render every chapter to catch missing data or reader errors beyond the first lesson.
        const rendered = await page.evaluate(async () => {
            const { lessons } = await import('/src/features/grammar/grammar-course.js');
            for (const lesson of lessons) {
                history.replaceState({}, '', '?lesson=' + lesson.id);
                window.dispatchEvent(new PopStateEvent('popstate'));
                if (
                    document.getElementById('grammarLessonTitle')?.textContent !== lesson.title ||
                    document.querySelectorAll('.grammar-rule').length !== 3 ||
                    document.querySelectorAll('.grammar-answer').length !== 3
                )
                    throw Error(lesson.id);
            }
            return lessons.length;
        });
        assert.equal(rendered, 72);
        await page.goto(base + '/english-grammar.html?lesson=conditional-inversion', {
            waitUntil: 'networkidle0',
        });
        await page.screenshot({ path: '.local/grammar-preview/lesson-light.png', fullPage: true });
        await page.click('#themeToggle');
        await page.reload({ waitUntil: 'networkidle0' });
        assert.equal(
            await page.$eval('#themeToggle', (el) => el.getAttribute('aria-checked')),
            'true',
        );
        await page.screenshot({ path: '.local/grammar-preview/lesson-dark.png', fullPage: true });
        await page.setViewport({ width: 390, height: 844 });
        assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            true,
        );
        await page.screenshot({ path: '.local/grammar-preview/lesson-mobile.png', fullPage: true });
        await page.click('.grammar-outline-back');
        assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            true,
        );
        await page.screenshot({
            path: '.local/grammar-preview/library-mobile.png',
            fullPage: true,
        });
        await page.goto(base + '/english-grammar.html?lesson=missing-lesson', {
            waitUntil: 'networkidle0',
        });
        assert.match(
            await page.$eval('#grammarReader', (el) => el.textContent),
            /Không tìm thấy bài học/,
        );
        assert.equal(await page.$('#grammarQuiz'), null);
        assert.deepEqual(errors, []);
        console.log(
            'PASS: all 72 Grammar readers, course navigation, Vietnamese search, filters, quiz feedback, account progress, saved lessons, reload, dark mode and mobile.',
        );
    } finally {
        if (browser) await browser.close();
        if (server) await new Promise((resolve) => server.close(resolve));
        await fixture.cleanup();
    }
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
