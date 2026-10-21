const assert = require('node:assert/strict');
const puppeteer = require('puppeteer');
const { createTestDatabase } = require('../helpers/test-database.cjs');
const { createDevelopmentApp } = require('../../apps/api/development-server');
(async () => {
    const f = await createTestDatabase();
    let browser, server;
    try {
        server = createDevelopmentApp({ database: f.pool }).listen(0, '127.0.0.1');
        await new Promise((r) => server.once('listening', r));
        const base = 'http://127.0.0.1:' + server.address().port;
        browser = await puppeteer.launch({ headless: 'new', timeout: 20000 });
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (r) => {
            const url = r.url();
            if (url.includes('/api/home/news'))
                return r.respond({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ items: [], updated_at: new Date().toISOString() }),
                });
            if (url.includes('/api/home/football'))
                return r.respond({
                    status: 503,
                    contentType: 'application/json',
                    body: '{"error":"Unavailable in task test"}',
                });
            if (!url.startsWith(base))
                return r.respond({ status: 200, contentType: 'application/json', body: '{}' });
            r.continue();
        });
        await page.goto(base + '/index.html');
        await page.evaluate(async () => {
            await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'test-learner', password: 'test-password' }),
            });
        });
        await page.goto(base + '/home.html', { waitUntil: 'networkidle0' });
        await page.waitForSelector('#todoInput:not(:disabled)');
        await page.type('#todoInput', 'Original task');
        await page.click('#todoForm button');
        await page.waitForSelector('.todo-item');
        await page.click('[data-action="edit"]');
        await page.$eval('.todo-edit input', (el) => {
            el.value = 'Updated task';
        });
        await page.click('.todo-edit button[type="submit"]');
        await page.waitForFunction(
            () => document.querySelector('.todo-title')?.textContent === 'Updated task',
        );
        await page.waitForSelector('[data-action="delete"]:not(:disabled)');
        await page.click('[data-action="delete"]');
        await page.click('[data-action="delete"]');
        await page.waitForFunction(() => document.querySelectorAll('.todo-item').length === 0);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForSelector('#todoInput:not(:disabled)');
        assert.equal(await page.$$eval('.todo-item', (els) => els.length), 0);
        assert.equal(
            (
                await f.pool.query(
                    'SELECT count(*)::int AS count FROM home_todos WHERE user_id=$1',
                    [f.userId],
                )
            ).rows[0].count,
            0,
        );
        console.log('PASS: create task, edit/save, confirm deletion, reload and verify database.');
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
