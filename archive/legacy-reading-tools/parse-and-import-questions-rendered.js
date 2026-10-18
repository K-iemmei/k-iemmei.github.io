/*
Puppeteer-based parser: parse_and_import_questions_rendered.js
- Loads each reading_tests.source_url in headless Chrome (Puppeteer)
- Waits for '.ielts-reading-question-section' or '.ielts-reading-question-container' to appear
- Saves rendered HTML to data/imports/rendered/<slug>.html for auditing
- Parses the rendered DOM with cheerio (re-using heuristics from parse_and_import_questions.js)
- Upserts reading_question_groups and reading_questions into Postgres

Run:
  npm install
  npm run content:parse-rendered

Note: Requires Chromium download by puppeteer during npm install. This script is idempotent and uses ON CONFLICT upserts.
*/

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { Client } = require('pg');
const puppeteer = require('puppeteer');

const repoRoot = path.resolve(__dirname, '../..');
const { databaseOptions } = require('../../apps/api/config/environment');
const client = new Client(databaseOptions());

async function run() {
    await client.connect();
    console.log('Connected to DB');

    const res = await client.query(
        'SELECT id, slug, source_url FROM reading_tests WHERE source_url IS NOT NULL',
    );
    const tests = res.rows;
    console.log(`Found ${tests.length} tests with source_url`);

    // create samples dir
    const samplesDir = path.join(repoRoot, 'data', 'imports', 'rendered');
    if (!fs.existsSync(samplesDir)) fs.mkdirSync(samplesDir, { recursive: true });

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
        for (const t of tests) {
            console.log(`\nRendering test ${t.slug} (${t.source_url})`);
            try {
                const page = await browser.newPage();
                page.setDefaultNavigationTimeout(45000);
                await page.goto(t.source_url, { waitUntil: 'networkidle2' });

                // Wait for the site-specific question container or a short timeout
                try {
                    await page.waitForSelector(
                        '.ielts-reading-question-section, .ielts-reading-question-container, .ielts-reading-questions',
                        { timeout: 8000 },
                    );
                } catch (err) {
                    console.log(
                        'Warning: question selectors not found quickly; continuing to grab rendered DOM',
                    );
                }

                const html = await page.content();
                // save for audit
                const outFile = path.join(samplesDir, `${t.slug}.html`);
                fs.writeFileSync(outFile, html, 'utf8');
                console.log('Saved rendered HTML to', outFile);

                const $ = cheerio.load(html);

                // Reuse site-specific extraction: look for .ielts-reading-question-section
                let groups = [];
                // Some pages render question sections outside the article container; search globally in body
                const container = $('body');
                const sections = $('.ielts-reading-question-section');
                if (sections && sections.length) {
                    sections.each((i, sec) => {
                        const sec$ = $(sec);
                        const headingText = (
                            sec$.find('.ielts-reading-question-section-heading').text() || ''
                        ).trim();
                        const instructionText = (
                            sec$.find('.ielts-reading-question-section-content').text() || ''
                        ).trim();
                        const qContainer = sec$.find('.ielts-reading-questions');
                        let nodes = [];
                        if (qContainer && qContainer.length) {
                            // get each question item node (keeping its HTML container)
                            qContainer.children().each((ii, ch) => nodes.push(ch));
                        } else {
                            nodes = sec$.children('p, ol, ul, div').toArray();
                        }
                        const heading = headingText || `Section ${i + 1}`;
                        const instruction = instructionText || '';
                        groups.push({
                            heading: heading + (instruction ? '\n' + instruction : ''),
                            nodes,
                        });
                    });
                }

                // Fallback to generic heuristics (copied from previous script) if no groups
                if (groups.length === 0) {
                    const headings = container.find('h2, h3, h4, h5').toArray();
                    const groupNodes = [];
                    headings.forEach((h) => {
                        const text = $(h).text().trim().toLowerCase();
                        if (
                            /question(s)?\b|questions?\s*[0-9]|matching|true|false|multiple choice|summary|complete|completion|match heading|match information|diagram|flow chart|table/.test(
                                text,
                            )
                        ) {
                            groupNodes.push(h);
                        }
                    });
                    if (groupNodes.length === 0) {
                        const nodes = container
                            .find('*')
                            .filter((i, el) => /questions?/i.test($(el).text()))
                            .toArray();
                        groupNodes.push(...nodes.slice(0, 5));
                    }
                    for (let i = 0; i < groupNodes.length; i++) {
                        const h = groupNodes[i];
                        const start = $(h);
                        const end = i + 1 < groupNodes.length ? $(groupNodes[i + 1]) : null;
                        const items = [];
                        let sib = start.next();
                        while (sib.length && (!end || !sib.is(end))) {
                            items.push(sib.get(0));
                            sib = sib.next();
                        }
                        if (items.length === 0) {
                            const nextList = start.nextAll('ol, ul').first();
                            if (nextList && nextList.length) items.push(nextList.get(0));
                        }
                        groups.push({ heading: start.text().trim(), nodes: items });
                    }
                    if (groups.length === 0) {
                        container.find('*').each((i, el) => {
                            const text = $(el).text() || '';
                            if (/^\s*questions?\b/i.test(text.trim())) {
                                const nextList = $(el).nextAll('ol, ul').first();
                                if (nextList && nextList.length) {
                                    groups.push({
                                        heading: $(el).text().trim(),
                                        nodes: [nextList.get(0)],
                                    });
                                }
                            }
                        });
                    }
                    if (groups.length === 0) {
                        const lists = container.find('ol, ul').toArray();
                        if (lists.length) groups.push({ heading: 'Questions', nodes: [lists[0]] });
                    }
                }

                // Map to DB: find passage_id
                const passRes = await client.query(
                    'SELECT id FROM reading_passages WHERE test_id = $1 ORDER BY passage_order LIMIT 1',
                    [t.id],
                );
                if (passRes.rowCount === 0) {
                    console.warn(
                        'No passage found for test, skipping question import for this test',
                    );
                    await page.close();
                    continue;
                }
                const passageId = passRes.rows[0].id;

                await client.query('BEGIN');
                let groupOrder = 1;
                for (const g of groups) {
                    const instruction = g.heading || 'Questions';
                    const question_type = detectQuestionType(instruction);
                    const options = [];
                    const settings = {};

                    const upsertGroupSql = `INSERT INTO reading_question_groups (passage_id, group_order, question_type, instruction, options, settings) VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb) ON CONFLICT (passage_id, group_order) DO UPDATE SET question_type = EXCLUDED.question_type, instruction = EXCLUDED.instruction RETURNING id`;
                    const grpRes = await client.query(upsertGroupSql, [
                        passageId,
                        groupOrder,
                        question_type,
                        instruction,
                        JSON.stringify(options),
                        JSON.stringify(settings),
                    ]);
                    const groupId = grpRes.rows[0].id;

                    const qItems = extractQuestionsFromNodes(g.nodes, $);
                    let qNum = 1;
                    for (const qi of qItems) {
                        const prompt = qi.prompt;
                        const metadata = { options: qi.options || [] };
                        const answer_key = null;
                        const insertQ = `INSERT INTO reading_questions (group_id, question_number, prompt, answer_key, explanation, points, metadata) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb) ON CONFLICT (group_id, question_number) DO UPDATE SET prompt = EXCLUDED.prompt, metadata = EXCLUDED.metadata RETURNING id`;
                        await client.query(insertQ, [
                            groupId,
                            qNum,
                            prompt,
                            answer_key,
                            null,
                            1,
                            JSON.stringify(metadata),
                        ]);
                        qNum++;
                    }

                    groupOrder++;
                }
                await client.query('COMMIT');
                console.log(`Imported ${groups.length} group(s) for test ${t.slug}`);

                await page.close();
            } catch (err) {
                console.error('Error processing test', t.slug, err);
            }
        }
    } finally {
        await browser.close();
    }

    await client.end();
    console.log('Done');
}

function detectQuestionType(text) {
    const t = (text || '').toLowerCase();
    if (/match(ing)? heading|matching headings|heading/i.test(t)) return 'matching_headings';
    if (/matching information|match information/i.test(t)) return 'matching_information';
    if (/matching features|matching features/i.test(t)) return 'matching_features';
    if (/true\s*\/\s*false|true,false,not given|true false not given/i.test(t))
        return 'true_false_not_given';
    if (/yes\s*\/\s*no|yes,no,not given/i.test(t)) return 'yes_no_not_given';
    if (/multiple choice|multiple-choice|multiple choice questions/i.test(t))
        return 'multiple_choice';
    if (/summary completion|summary|complete the summary/i.test(t)) return 'summary_completion';
    if (/complete the sentence|sentence completion/i.test(t)) return 'sentence_completion';
    if (/table completion|table/i.test(t)) return 'table_completion';
    if (/flow chart|flow-chart|flowchart/i.test(t)) return 'flow_chart_completion';
    if (/diagram/i.test(t)) return 'diagram_labelling';
    if (/short answer/i.test(t)) return 'short_answer';
    return 'short_answer';
}

function extractQuestionsFromNodes(nodes, $) {
    const items = [];
    for (const n of nodes) {
        const el = $(n);
        if (el.is && (el.is('ol') || el.is('ul'))) {
            el.find('> li').each((i, li) => {
                const t = $(li).text().trim();
                const { prompt, options } = parsePromptAndOptions(t);
                items.push({ prompt, options });
            });
        } else if (el.is && (el.is('p') || el.is('div'))) {
            const text = el.text().trim();
            if (/^\d+\./.test(text)) {
                const parts = text
                    .split(/(?=\n?\s*\d+\.)/g)
                    .map((s) => s.trim())
                    .filter(Boolean);
                for (const p of parts) {
                    const cleaned = p.replace(/^\d+\./, '').trim();
                    const { prompt, options } = parsePromptAndOptions(cleaned);
                    items.push({ prompt, options });
                }
            } else {
                const p = text;
                if (p) {
                    const { prompt, options } = parsePromptAndOptions(p);
                    if (prompt.length > 10) items.push({ prompt, options });
                }
            }
        } else {
            const txt = el.text ? el.text().trim() : '';
            if (txt) items.push({ prompt: txt, options: [] });
        }
    }
    return items;
}

function parsePromptAndOptions(text) {
    const options = [];
    const pat = /([A-Z])\)\s*([^A-Z]+)/g;
    let m;
    let found = false;
    while ((m = pat.exec(text)) !== null) {
        found = true;
        options.push(m[2].trim());
    }
    if (found) {
        const prompt = text.replace(/([A-Z])\)\s*([^A-Z]+)/g, '').trim();
        return { prompt: prompt || text, options };
    }
    return { prompt: text, options: [] };
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
