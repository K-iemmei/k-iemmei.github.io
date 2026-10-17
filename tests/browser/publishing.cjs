const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');
const { createTestDatabase } = require('../helpers/test-database.cjs');
const { createDevelopmentApp } = require('../../apps/api/development-server');
const { hashPassword } = require('../../apps/api/modules/auth/local-auth');
const sample = [
    '## A small idea, clearly explained',
    'A real note with **Markdown**, a [reference](https://example.com), and inline math $E=mc^2$.',
    '',
    '$$',
    'f(x) = \\frac{x^2}{2}',
    '$$',
    '',
    '> Learning becomes clearer when we write it down.',
    '',
    '### A useful snippet',
    '```python',
    'def greet(name):',
    '    message = "$not_math$"',
    '    return f"Hello, {name}"',
    '```',
    '',
    '### A week of progress',
    '```chart',
    '{"type":"bar","title":"Study minutes","labels":["Mon","Tue","Wed"],"datasets":[{"label":"Minutes","data":[20,35,45]}]}',
    '```',
    '',
    '### From thought to post',
    '```mermaid',
    'flowchart LR',
    '    A[Think] --> B[Write]',
    '    B --> C[Share]',
    '```',
    '',
    '| Topic | Minutes |',
    '| --- | --- |',
    '| Grammar | 25 |',
    '| Reading | 40 |',
].join('\n');
(async () => {
    const fixture = await createTestDatabase();
    let server, browser;
    try {
        const second = (
            await fixture.pool.query(
                "INSERT INTO public.users(username,name) VALUES('blog-reader','Reader') RETURNING id",
            )
        ).rows[0].id;
        await fixture.pool.query(
            'INSERT INTO app_private.credentials(user_id,password_hash) VALUES($1,$2)',
            [second, hashPassword('reader-password')],
        );
        server = createDevelopmentApp({ database: fixture.pool }).listen(0, '127.0.0.1');
        await new Promise((resolve) => server.once('listening', resolve));
        const base = 'http://127.0.0.1:' + server.address().port;
        browser = await puppeteer.launch({ headless: 'new', timeout: 20000 });
        const errors = [];
        async function account(username, password) {
            const context = await browser.createIncognitoBrowserContext();
            const page = await context.newPage();
            page.on('pageerror', (error) => errors.push(error.message));
            await page.setViewport({ width: 1440, height: 1000 });
            await page.setRequestInterception(true);
            page.on('request', (r) =>
                r.url().startsWith(base) ? r.continue() : r.respond({ status: 200, body: '' }),
            );
            await page.goto(base + '/index.html');
            await page.evaluate(
                async ({ username, password }) => {
                    await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password }),
                    });
                },
                { username, password },
            );
            return page;
        }
        const owner = await account('test-learner', 'test-password'),
            reader = await account('blog-reader', 'reader-password');
        await owner.goto(base + '/notes.html', { waitUntil: 'networkidle0' });
        await owner.waitForFunction(() => !document.getElementById('writingEmpty').hidden);
        await owner.click('a.writing-primary[href="note.html"]');
        await owner.waitForFunction(() => !document.getElementById('noteTitle').disabled);
        await owner.$eval('#noteTitle', (el) => {
            el.value = 'Learning, one note at a time';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await owner.$eval(
            '#noteBody',
            (el, text) => {
                el.value = text;
                el.dispatchEvent(new Event('input', { bubbles: true }));
            },
            sample,
        );
        await owner.$eval('#noteTags', (el) => {
            el.value = 'learning, code';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await owner.waitForFunction(
            () => document.getElementById('noteSaveStatus').textContent === 'Saved',
            { timeout: 30000 },
        );
        const id = new URL(owner.url()).searchParams.get('id');
        assert(id);
        await owner.waitForSelector('#notePreview .katex');
        await owner.waitForSelector('#notePreview canvas', { timeout: 30000 });
        await owner.waitForSelector('#notePreview .rich-visual svg', { timeout: 30000 });
        assert.match(
            await owner.$eval('#notePreview .rich-visual svg', (element) => element.textContent),
            /Think/,
        );
        assert.equal(await owner.$$eval('#notePreview .rich-error', (els) => els.length), 0);
        assert.ok(await owner.$('#notePreview .hljs-keyword'));
        assert.match(await owner.$eval('#notePreview pre', (el) => el.textContent), /\$not_math\$/);
        await reader.goto(base + '/notes.html', { waitUntil: 'networkidle0' });
        assert.equal(await reader.$$eval('.writing-card', (els) => els.length), 0);
        await reader.goto(base + '/note.html?id=' + id, { waitUntil: 'networkidle0' });
        assert.match(
            await reader.$eval('#writingMessage', (el) => el.textContent),
            /Note not found/,
        );
        assert.equal(await reader.$eval('#noteTitle', (el) => el.value), '');
        fs.mkdirSync('.local/publishing-preview', { recursive: true });
        const image = await owner.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 640;
            canvas.height = 240;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#d9eaff';
            ctx.fillRect(0, 0, 640, 240);
            ctx.fillStyle = '#356fa6';
            ctx.font = '28px sans-serif';
            ctx.fillText('A little progress, every day.', 50, 125);
            return canvas.toDataURL('image/png').split(',')[1];
        });
        const imagePath = path.resolve('.local/publishing-preview/note-image.png');
        fs.writeFileSync(imagePath, Buffer.from(image, 'base64'));
        const input = await owner.$('#noteImageFile');
        await input.uploadFile(imagePath);
        await owner.waitForFunction(() =>
            document.getElementById('noteBody').value.includes('note-asset:'),
        );
        await owner.waitForFunction(
            () => document.getElementById('noteSaveStatus').textContent === 'Saved',
        );
        await owner.waitForFunction(() =>
            [...document.querySelectorAll('#notePreview img')].some(
                (image) => image.naturalWidth > 0,
            ),
        );
        assert.equal(
            await owner.$eval('#notePreview img', (image) => image.closest('table')),
            null,
        );
        await owner.screenshot({
            path: '.local/publishing-preview/editor-light.png',
            fullPage: true,
        });
        await Promise.all([
            owner.waitForNavigation({ waitUntil: 'networkidle0' }),
            owner.click('#notePost'),
        ]);
        await owner.waitForSelector('#postArticle .rich-visual svg', { timeout: 30000 });
        assert.match(owner.url(), /post.html\?id=/);
        await reader.goto(base + '/blog.html', { waitUntil: 'networkidle0' });
        await reader.waitForSelector('.writing-card');
        await reader.screenshot({
            path: '.local/publishing-preview/blog-light.png',
            fullPage: true,
        });
        await reader.click('.writing-card');
        await reader.waitForSelector('#postArticle .rich-visual svg', { timeout: 30000 });
        assert.equal(await reader.$eval('#postEdit', (el) => el.hidden), true);
        assert.equal(await reader.$$eval('#postArticle .rich-error', (els) => els.length), 0);
        await reader.waitForFunction(() =>
            [...document.querySelectorAll('#postArticle img')].some(
                (image) => image.naturalWidth > 0,
            ),
        );
        await reader.screenshot({
            path: '.local/publishing-preview/post-light.png',
            fullPage: true,
        });
        await reader.click('#themeToggle');
        await reader.waitForSelector('#postArticle .rich-visual svg', { timeout: 30000 });
        await reader.setViewport({ width: 390, height: 844 });
        assert.equal(
            await reader.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            true,
        );
        await reader.screenshot({
            path: '.local/publishing-preview/post-mobile-dark.png',
            fullPage: true,
        });
        await owner.goto(base + '/note.html?id=' + id, { waitUntil: 'networkidle0' });
        await owner.$eval('#noteBody', (el) => {
            el.value += '\nSECRET SECOND DRAFT';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await owner.waitForFunction(
            () => document.getElementById('noteSaveStatus').textContent === 'Saved',
        );
        await reader.reload({ waitUntil: 'networkidle0' });
        assert.doesNotMatch(
            await reader.$eval('#postArticle', (el) => el.textContent),
            /SECRET SECOND DRAFT/,
        );
        await owner.click('#noteUnpublish');
        await owner.waitForFunction(() => document.getElementById('writingConfirm').open);
        await owner.click('#writingConfirm [value="confirm"]');
        await owner.waitForFunction(() => document.getElementById('noteUnpublish').hidden);
        await reader.reload({ waitUntil: 'networkidle0' });
        assert.match(await reader.$eval('#postTitle', (el) => el.textContent), /Post unavailable/);
        const malicious =
            '<img src=x onerror="window.__noteXSS=1"><script>window.__noteXSS=1</script>\n\n[unsafe](javascript:alert(1))\n\n```javascript\nwindow.__noteXSS = 2;\n```';
        await owner.$eval(
            '#noteBody',
            (el, text) => {
                el.value = text;
                el.dispatchEvent(new Event('input', { bubbles: true }));
            },
            malicious,
        );
        await owner.waitForFunction(() =>
            document.querySelector('#notePreview pre')?.textContent.includes('__noteXSS'),
        );
        assert.equal(await owner.evaluate(() => window.__noteXSS), undefined);
        assert.equal(
            await owner.$$eval(
                '#notePreview script,#notePreview [onerror],#notePreview a[href^="javascript:"]',
                (els) => els.length,
            ),
            0,
        );
        await owner.waitForFunction(
            () => document.getElementById('noteSaveStatus').textContent === 'Saved',
        );
        await owner.setViewport({ width: 390, height: 844 });
        await owner.click('[data-editor-mode="preview"]');
        assert.equal(
            await owner.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            true,
        );
        await owner.click('#noteDelete');
        await owner.click('#writingConfirm [value="confirm"]');
        await owner.waitForNavigation({ waitUntil: 'networkidle0' });
        await owner.waitForFunction(() => !document.getElementById('writingEmpty').hidden);
        assert.deepEqual(errors, []);
        console.log(
            'PASS: private Notes, autosave, protected images, Markdown/LaTeX/code/chart/diagram rendering, shared Blog, private edits, unpublish, XSS protection, dark mode and mobile.',
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
