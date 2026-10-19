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
        console.log('Browser: launching');
        browser = await puppeteer.launch({ headless: 'new', timeout: 20000 });
        console.log('Browser: launched');
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (message) => {
            if (message.type() === 'error') errors.push(message.text());
        });
        const base = live ? 'http://localhost:8000' : 'http://127.0.0.1:' + server.address().port;
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (request.url().startsWith('https://api.open-meteo.com/')) {
                return request.respond({
                    status: 200,
                    contentType: 'application/json',
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({
                        daily: {
                            time: Array.from({ length: 4 }, (_, i) =>
                                new Date(Date.now() + i * 86400000).toISOString().slice(0, 10),
                            ),
                            weather_code: [1, 2, 3, 1],
                            temperature_2m_min: [22, 23, 22, 21],
                            temperature_2m_max: [28, 29, 28, 27],
                            precipitation_probability_max: [10, 20, 30, 10],
                        },
                    }),
                });
            }
            if (!request.url().startsWith(base)) {
                return request.respond({
                    status: 200,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: '',
                });
            }
            if (request.url().endsWith('favicon.ico')) return request.respond({ status: 204 });
            request.continue();
        });
        await page.goto(base + '/dashboard.html', { waitUntil: 'networkidle0' });
        console.log('Browser: login redirect loaded');
        assert.match(page.url(), /index.html/);
        await page.goto(base + '/', { waitUntil: 'networkidle0' });
        assert.equal(await page.$eval('body', (body) => body.dataset.page), 'login');
        await page.type('#username', username);
        await page.type('#password', password);
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('#loginForm button[type="submit"]'),
        ]);
        console.log('Browser: logged in');
        assert.match(page.url(), /home.html/);
        await page.goto(base + '/dashboard.html', { waitUntil: 'networkidle0' });
        await page.setViewport({ width: 1440, height: 1000 });
        await page.waitForSelector('#sidebarUserName');
        fs.mkdirSync('.local/dashboard-preview', { recursive: true });
        await page.screenshot({ path: '.local/dashboard-preview/light.png', fullPage: true });
        await page.click('#themeToggle');
        assert.equal(
            await page.$eval('#themeToggle', (el) => el.getAttribute('aria-checked')),
            'true',
        );
        assert.match(await page.$eval('#themeToggle', (el) => el.textContent), /Dark mode/);
        assert.ok(await page.$('#themeToggle svg'));
        await page.reload({ waitUntil: 'networkidle0' });
        assert.equal(
            await page.$eval('#themeToggle', (el) => el.getAttribute('aria-checked')),
            'true',
        );
        await page.screenshot({ path: '.local/dashboard-preview/dark.png', fullPage: true });
        await page.setViewport({ width: 390, height: 844 });
        assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            true,
        );
        assert.equal(await page.$eval('.sidebar', (el) => getComputedStyle(el).display), 'flex');
        assert.match(await page.$eval('#logoutButton', (el) => el.textContent), /Log out/);
        await page.screenshot({ path: '.local/dashboard-preview/mobile.png', fullPage: true });
        await page.click('#themeToggle');
        assert.equal(
            await page.$eval('#themeToggle', (el) => el.getAttribute('aria-checked')),
            'false',
        );
        await page.setViewport({ width: 1440, height: 1000 });
        console.log('Dashboard: sidebar, theme persistence and mobile layout verified');
        assert.ok(!(await page.evaluate(() => document.cookie)).includes('my_note_session'));
        if (!live) {
            console.log('Listening: seed fixture');
            await fixture.pool.query(`INSERT INTO public.listening_sessions
                (slug,book_number,test_number,part_number,title,question_text,first_question,last_question,transcript,answer_key,audio_filename)
                VALUES ('cambridge-20-test-1-part-1',20,1,1,'Cambridge 20 · Test 1 · Part 1','Complete (1) .....',1,10,'The blue train arrives today.','{"1":"blue"}','0-cam20-test-1-part-1.mp3')`);
            await page.goto(base + '/english-listening-library.html', {
                waitUntil: 'networkidle0',
            });
            console.log('Listening: library loaded');
            await page.click('a[href*="english-listening.html?session="]');
            console.log('Listening: opened part');
            await page.waitForSelector('#answerGrid [data-answer="1"]');
            await page.type('#answerGrid [data-answer="1"]', 'blue');
            await page.click('#examForm button[type="submit"]');
            await page.waitForFunction(() =>
                document.getElementById('listeningResult').textContent.includes('100%'),
            );
            console.log('Listening: exam graded');
            await page.click('[data-mode="dictation"]');
            await page.type('#dictationText', 'The blue train arrives today.');
            await page.click('#dictationForm button[type="submit"]');
            await page.waitForFunction(() =>
                document.getElementById('listeningResult').textContent.includes('100%'),
            );
            console.log('Listening: dictation graded');
            // Play a short local WAV to exercise actual media events and durable tracking.
            await page.evaluate(async () => {
                const samples = 16000 * 2;
                const bytes = new ArrayBuffer(44 + samples * 2);
                const view = new DataView(bytes);
                const text = (offset, value) =>
                    [...value].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
                text(0, 'RIFF');
                view.setUint32(4, 36 + samples * 2, true);
                text(8, 'WAVE');
                text(12, 'fmt ');
                view.setUint32(16, 16, true);
                view.setUint16(20, 1, true);
                view.setUint16(22, 1, true);
                view.setUint32(24, 16000, true);
                view.setUint32(28, 32000, true);
                view.setUint16(32, 2, true);
                view.setUint16(34, 16, true);
                text(36, 'data');
                view.setUint32(40, samples * 2, true);
                const audio = document.getElementById('listeningAudio');
                audio.src = URL.createObjectURL(new Blob([bytes], { type: 'audio/wav' }));
                audio.hidden = false;
                await audio.play();
                await new Promise((resolve) =>
                    audio.addEventListener('ended', resolve, { once: true }),
                );
                const { flushListeningActivity } =
                    await import('/src/features/english/listening-tracker.js');
                await flushListeningActivity();
            });
            const playback = await fixture.pool.query(
                'SELECT sum(seconds) AS seconds FROM public.listening_activity WHERE user_id=$1',
                [fixture.userId],
            );
            assert.ok(Number(playback.rows[0].seconds) >= 1.5);
            assert.ok(Number(playback.rows[0].seconds) < 5);
            console.log('Listening: actual playback saved');
        }
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
        await page.waitForSelector('[data-rich-path="passages.0.content_html"]');
        const model = manualReading(
            live ? 'manual-reading-learning-feedback' : 'browser-manual-reading',
        );
        model.passages[0].groups.find(
            (group) => group.group_type === 'sentence_completion',
        ).questions[0].prompt = 'Useful ___ identifies mistakes.';
        async function fill(path, value) {
            await page.$eval(
                `[data-path="${path}"], [data-plain-path="${path}"]`,
                (element, value) => {
                    if (element.hasAttribute('data-rich-path')) element.textContent = value;
                    else element.value = value;
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
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('#editReadingLink'),
        ]);
        await page.waitForFunction(
            (id) =>
                document.getElementById('authorTestSelect').value === id &&
                !document.getElementById('authorFields').disabled,
            {},
            created.id,
        );
        assert.equal(await page.$eval('#authorSlug', (el) => el.value), model.slug);
        await page.reload({ waitUntil: 'networkidle0' });
        await page.waitForFunction(
            (id) =>
                document.getElementById('authorTestSelect').value === id &&
                !document.getElementById('authorFields').disabled,
            {},
            created.id,
        );
        if (!live) {
            const otherModel = structuredClone(model);
            otherModel.slug = 'browser-edit-other-reading';
            otherModel.title = 'Other Reading for Edit';
            const otherTest = await page.evaluate(async (body) => {
                const { apiRequest } = await import('/src/core/database-client.js');
                return apiRequest('/api/reading/author/tests', {
                    method: 'POST',
                    body: JSON.stringify(body),
                });
            }, otherModel);
            await page.goto(base + '/english.html?test=' + encodeURIComponent(model.slug), {
                waitUntil: 'networkidle0',
            });
            await page.waitForSelector('.answer-input');
            const otherOption = await page.$$eval(
                '#testSelect option',
                (options) =>
                    options.find((option) => option.textContent === 'Other Reading for Edit').value,
            );
            await page.select('#testSelect', otherOption);
            await page.waitForFunction(
                () => document.getElementById('examTitle').textContent === 'Other Reading for Edit',
            );
            assert.match(
                await page.$eval('#editReadingLink', (el) => el.href),
                /test=browser-edit-other-reading/,
            );
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
                page.click('#editReadingLink'),
            ]);
            await page.waitForFunction(
                (id) =>
                    document.getElementById('authorTestSelect').value === id &&
                    !document.getElementById('authorFields').disabled,
                {},
                otherTest.id,
            );
            assert.equal(await page.$eval('#authorSlug', (el) => el.value), otherModel.slug);
            await page.goto(base + '/admin.html?test=missing-reading', {
                waitUntil: 'networkidle0',
            });
            await page.waitForFunction(
                () => document.getElementById('authorMessage').dataset.kind === 'error',
            );
            assert.equal(await page.$eval('#saveReadingButton', (el) => el.disabled), true);
        }
        await page.goto(base + '/english.html?test=' + encodeURIComponent(model.slug), {
            waitUntil: 'networkidle0',
        });
        await page.waitForSelector('.answer-input');
        console.log('Reading: Edit content opens the selected test directly and survives reload');
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
        await page.waitForFunction(() =>
            document
                .getElementById('englishTrackingSummary')
                .textContent.includes('Reading submissions'),
        );
        if (!live) {
            await page.waitForFunction(
                () =>
                    !document.getElementById('leaderboardList').hasAttribute('aria-busy') &&
                    document.querySelector('#leaderboardList .leaderboard-self'),
            );
            assert.ok(await page.$('#leaderboardList .leaderboard-self'));
            assert.match(await page.$eval('#leaderboardList', (el) => el.textContent), /pts/);
            assert.match(
                await page.$eval('#englishTrackingSummary', (el) => el.textContent),
                /1 Reading submissions/,
            );
            assert.equal(await page.$$eval('#englishTrackingRows tr', (rows) => rows.length), 1);
            assert.match(
                await page.$eval('#heatmap-english .level-2', (el) => el.title),
                /Reading: 1 submissions/,
            );
        }
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
        try {
            if (browser) await browser.close();
        } catch (error) {
            // Chrome on Windows can briefly lock its temporary profile during cleanup.
            if (error.code !== 'EBUSY') throw error;
        } finally {
            await new Promise((resolve) => server.close(resolve));
            await fixture.cleanup();
        }
    }
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
