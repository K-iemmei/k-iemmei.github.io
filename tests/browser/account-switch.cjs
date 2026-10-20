const assert = require('node:assert/strict');
const express = require('express');
const path = require('node:path');
const puppeteer = require('puppeteer');
const { trackingDate } = require('../../apps/web/src/domain/english-tracking.js');
const accounts = {
    A: {
        id: '11111111-1111-4111-8111-111111111111',
        email: 'a@example.test',
        user_metadata: { name: 'Learner A' },
    },
    B: {
        id: '22222222-2222-4222-8222-222222222222',
        email: 'b@example.test',
        user_metadata: { name: 'Learner B' },
    },
};
const session = (name) => ({
    user: accounts[name],
    access_token: name,
    refresh_token: name,
    expires_at: Date.now() / 1000 + 3600,
});
(async () => {
    const app = express(),
        web = path.resolve('apps/web');
    app.get('/switch.html', (_req, res) =>
        res.send('<!doctype html><title>Account switch</title>'),
    );
    app.get('/dashboard.html', (_req, res) =>
        res.sendFile(path.join(web, 'pages/dashboard/study-dashboard.html')),
    );
    app.get('/index.html', (_req, res) => res.sendFile(path.join(web, 'pages/auth/login.html')));
    app.use(express.static(web));
    const server = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    let browser;
    let page;
    let watchdog;
    try {
        browser = await puppeteer.launch({ headless: 'new' });
        console.log('Accounts: browser launched');
        watchdog = setTimeout(() => browser.process()?.kill(), 90000);
        const base = 'http://127.0.0.1:' + server.address().port;
        page = await browser.newPage();
        page.setDefaultTimeout(15000);
        const errors = [];
        await page.setViewport({ width: 1440, height: 1000 });
        page.on('pageerror', (error) => errors.push(error.message));
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const url = new URL(request.url());
            if (url.pathname === '/src/core/deployment-config.js')
                return request.respond({
                    status: 200,
                    contentType: 'text/javascript',
                    body: "export const deployment={mode:'supabase',url:'https://test.supabase.co',anonKey:'public-test'};",
                });
            if (url.hostname === 'test.supabase.co') {
                const respond = (body) =>
                    request.respond({
                        status: 200,
                        contentType: 'application/json',
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': 'authorization,apikey,content-type',
                            'Access-Control-Allow-Methods': 'GET,OPTIONS',
                        },
                        body: JSON.stringify(body),
                    });
                if (request.method() === 'OPTIONS') return respond({});
                const name = request.headers().authorization?.replace('Bearer ', '').slice(0, 1);
                if (!accounts[name]) return respond({ error: 'Unauthorized' });
                if (url.pathname === '/auth/v1/user') return respond(accounts[name]);
                if (url.pathname.endsWith('/api/tracking/english'))
                    return respond([
                        {
                            activity_date: trackingDate(),
                            reading_submissions: name === 'A' ? 1 : 0,
                            listening_submissions: name === 'B' ? 2 : 0,
                            listening_seconds: 0,
                        },
                    ]);
                if (url.pathname.endsWith('/api/tracking/leaderboard'))
                    return respond({ date: null, users: [] });
                if (url.pathname.endsWith('/api/data/users'))
                    return respond([{ name: accounts[name].user_metadata.name }]);
                return respond([]);
            }
            if (url.origin === base) return request.continue();
            return request.respond({ status: 200, body: '' });
        });
        const other = await browser.newPage();
        await other.goto(base + '/switch.html');
        async function switchTo(name) {
            await other.evaluate((value) => {
                localStorage.setItem('my_note_supabase_session', JSON.stringify(value));
                localStorage.setItem('userId', value.user.id);
                localStorage.setItem('username', value.user.user_metadata.name);
            }, session(name));
        }
        await switchTo('A');
        await page.goto(base + '/dashboard.html', { waitUntil: 'networkidle0' });
        console.log('Accounts: A dashboard loaded');
        await page.waitForFunction(() =>
            document
                .getElementById('englishTrackingSummary')
                .textContent.includes('1 Reading submissions'),
        );
        await page.evaluate(() => {
            window.accountPageSentinel = true;
        });
        await other.evaluate(
            (value) =>
                localStorage.setItem(
                    'my_note_supabase_session',
                    JSON.stringify({ ...value, access_token: 'A-renewed' }),
                ),
            session('A'),
        );
        await page.waitForNetworkIdle({ idleTime: 300 });
        assert.equal(
            await page.evaluate(() => window.accountPageSentinel),
            true,
            'same-account token refresh must preserve the page',
        );
        await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), switchTo('B')]);
        console.log('Accounts: B dashboard reloaded');
        await page.waitForFunction(() =>
            document
                .getElementById('englishTrackingSummary')
                .textContent.includes('2 Listening submissions'),
        );
        console.log('Accounts: B tracking loaded');
        assert.equal(await page.$eval('#sidebarUserName', (el) => el.textContent), 'Learner B');
        assert.match(
            await page.$eval('#englishTrackingSummary', (el) => el.textContent),
            /0 Reading submissions/,
        );
        await page.bringToFront();
        console.log('Accounts: checking heatmap layout');
        const cells = await page.evaluate(() => {
            const active = document.querySelector('#heatmap-english .level-3'),
                empty = document.querySelector('#heatmap-english .heat-empty');
            return {
                width: active.getBoundingClientRect().width,
                height: active.getBoundingClientRect().height,
                active: getComputedStyle(active).backgroundColor,
                empty: getComputedStyle(empty).backgroundColor,
            };
        });
        assert.ok(cells.width > 0 && cells.height > 0, 'heatmap cells must be visible');
        assert.notEqual(cells.active, cells.empty, 'activity must have a visible color');
        console.log('Accounts: heatmap layout visible');
        await page.click('#themeToggle');
        console.log('Accounts: dark theme selected');
        assert.notEqual(
            await page.$eval(
                '#heatmap-english .level-3',
                (el) => getComputedStyle(el).backgroundColor,
            ),
            cells.active,
        );
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            other.evaluate(() => localStorage.removeItem('my_note_supabase_session')),
        ]);
        console.log('Accounts: logout propagated');
        assert.match(page.url(), /index.html/);
        assert.deepEqual(errors, []);
        console.log(
            'PASS: hosted account switch reloads Dashboard, isolates heatmaps, preserves token refresh and propagates logout; active cells visible in both themes.',
        );
    } catch (error) {
        console.error('Account test failed:', error.message);
        throw error;
    } finally {
        clearTimeout(watchdog);
        let closeTimer;
        try {
            if (browser)
                await Promise.race([
                    browser.close(),
                    new Promise((resolve) => {
                        closeTimer = setTimeout(() => {
                            browser.process()?.kill();
                            browser.disconnect();
                            resolve();
                        }, 10000);
                    }),
                ]);
        } catch (error) {
            if (error.code !== 'EBUSY') throw error;
        } finally {
            clearTimeout(closeTimer);
        }
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    }
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
