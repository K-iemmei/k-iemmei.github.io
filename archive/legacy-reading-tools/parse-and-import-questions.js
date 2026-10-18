/*
Node script: parse_and_import_questions.js
- Reads seeded reading_tests from DB
- Fetches each test.source_url
- Parses DOM with cheerio to find question groups and questions (heuristic-based)
- Inserts reading_question_groups and reading_questions into Postgres with upsert behavior

Run:
  npm install
  npm run content:parse

Note: This is heuristic — manual QA recommended. It intentionally leaves answer_key null (no answers scraped).
*/

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { Client } = require('pg');

const repoRoot = path.resolve(__dirname, '../..');
const { databaseOptions } = require('../../apps/api/config/environment');
const client = new Client(databaseOptions());

async function run() {
    await client.connect();
    console.log('Connected to DB');

    // Get tests that have source_url
    const res = await client.query(
        'SELECT id, slug, source_url FROM reading_tests WHERE source_url IS NOT NULL',
    );
    const tests = res.rows;
    console.log(`Found ${tests.length} tests with source_url`);

    for (const t of tests) {
        console.log(`\nProcessing test ${t.slug} (${t.source_url})`);
        try {
            const html = await fetchPage(t.source_url);
            const $ = cheerio.load(html);

            // Try to find the main content area heuristically
            const article = $('article').first();
            const container = article.length ? article : $('body');

            // Priority: site-specific structure for Engnovate
            let groups = [];
            const sections = container.find('.ielts-reading-question-section');
            if (sections && sections.length) {
                sections.each((i, sec) => {
                    const sec$ = $(sec);
                    const headingText = (
                        sec$.find('.ielts-reading-question-section-heading').text() || ''
                    ).trim();
                    const instructionText = (
                        sec$.find('.ielts-reading-question-section-content').text() || ''
                    ).trim();
                    // Collect question nodes inside this section
                    const qContainer = sec$.find('.ielts-reading-questions');
                    let nodes = [];
                    if (qContainer && qContainer.length) {
                        nodes = qContainer.children().toArray();
                    } else {
                        // fallback: include immediate child paragraphs / lists
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

            // Fallback to generic heuristics if no site-specific sections found
            if (groups.length === 0) {
                // Find all headings that look like question group starts
                const headings = container.find('h2, h3, h4, h5').toArray();
                // We'll build groups by scanning content: look for headings containing 'Question' or known group keywords
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

                // Fallback: if no headings detected, try to find sections following the passage content
                if (groupNodes.length === 0) {
                    // look for elements that contain 'Questions' text
                    const nodes = container
                        .find('*')
                        .filter((i, el) => /questions?/i.test($(el).text()))
                        .toArray();
                    groupNodes.push(...nodes.slice(0, 5));
                }

                // Map the groups to arrays of DOM nodes that belong to each group
                for (let i = 0; i < groupNodes.length; i++) {
                    const h = groupNodes[i];
                    const start = $(h);
                    const end = i + 1 < groupNodes.length ? $(groupNodes[i + 1]) : null;
                    // Collect siblings after start until next heading
                    const items = [];
                    let sib = start.next();
                    while (sib.length && (!end || !sib.is(end))) {
                        items.push(sib);
                        sib = sib.next();
                    }
                    // If no direct siblings collected, try to find the first ol/ul after this heading
                    if (items.length === 0) {
                        const nextList = start.nextAll('ol, ul').first();
                        if (nextList && nextList.length) items.push(nextList);
                    }
                    groups.push({ heading: start.text().trim(), nodes: items });
                }

                // Additional fallback: scan for elements that contain the word 'Questions' and take the next ol/ul as a group
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

                // If still empty, attempt to detect ol/ul lists containing numbered items after a paragraph that mentions 'Questions'
                if (groups.length === 0) {
                    const lists = container.find('ol, ul').toArray();
                    if (lists.length) {
                        groups.push({ heading: 'Questions', nodes: [lists[0]] });
                    }
                }
            }

            // For mapping passage_id: pick first passage for this test
            const passRes = await client.query(
                'SELECT id FROM reading_passages WHERE test_id = $1 ORDER BY passage_order LIMIT 1',
                [t.id],
            );
            if (passRes.rowCount === 0) {
                console.warn('No passage found for test, skipping question import for this test');
                continue;
            }
            const passageId = passRes.rows[0].id;

            // Insert groups & questions in a transaction
            await client.query('BEGIN');
            let groupOrder = 1;
            for (const g of groups) {
                const instruction = g.heading || 'Questions';
                const question_type = detectQuestionType(instruction);
                const options = [];
                const settings = {};

                // Upsert group
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

                // Extract questions from g.nodes
                const qItems = extractQuestionsFromNodes(g.nodes, $);
                let qNum = 1;
                for (const qi of qItems) {
                    const prompt = qi.prompt;
                    const metadata = { options: qi.options || [] };
                    const answer_key = null; // not scraping answers
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
        } catch (err) {
            console.error('Error processing test', t.slug, err);
            await client.query('ROLLBACK').catch(() => {});
        }
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
        // If it's an ordered list, get li items
        if (el.is('ol') || el.is('ul')) {
            el.find('> li').each((i, li) => {
                const t = $(li).text().trim();
                const { prompt, options } = parsePromptAndOptions(t);
                items.push({ prompt, options });
            });
        } else if (el.is('p') || el.is('div')) {
            // Might contain multiple numbered items in text
            const text = el.text().trim();
            if (/^\d+\./.test(text)) {
                // split by number markers
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
                // maybe a single prompt paragraph
                const p = text;
                if (p) {
                    const { prompt, options } = parsePromptAndOptions(p);
                    // only push if reasonably question-like
                    if (prompt.length > 10) items.push({ prompt, options });
                }
            }
        } else {
            const txt = el.text().trim();
            if (txt) items.push({ prompt: txt, options: [] });
        }
    }
    return items;
}

function parsePromptAndOptions(text) {
    // Detect option lists inside text like A) opt B) opt or (A) or A.
    const options = [];
    // look for patterns like A) ... B) ...
    const pat = /([A-Z])\)\s*([^A-Z]+)/g;
    let m;
    let found = false;
    while ((m = pat.exec(text)) !== null) {
        found = true;
        options.push(m[2].trim());
    }
    if (found) {
        // remove options part from prompt
        const prompt = text.replace(/([A-Z])\)\s*([^A-Z]+)/g, '').trim();
        return { prompt: prompt || text, options };
    }
    // fallback: no options
    return { prompt: text, options: [] };
}

async function fetchPage(url) {
    console.log('Fetching', url);
    const resp = await fetch(url, { timeout: 20000 });
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
    const html = await resp.text();
    return html;
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
