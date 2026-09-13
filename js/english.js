const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.documentElement.dataset.theme = 'dark';
    if (themeToggle) themeToggle.textContent = '☾';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.dataset.theme === 'dark';

        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '☼';
        } else {
            document.documentElement.dataset.theme = 'dark';
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☾';
        }
    });
}

const state = {
    tests: [],
    currentIndex: 0,
};

const fallbackPassage = `Artificial intelligence is increasingly shaping the workplace, but its effect on employment is still a matter of debate. Some analysts argue that AI will replace many routine tasks, particularly in administration, data processing and basic customer service. These roles often involve repetitive work that can be automated with software. As a result, workers in these fields may need to retrain or focus on more complex responsibilities that require judgment, empathy and creativity.`;

function normalizeAnswer(value = '') {
    return String(value)
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function parseTestTitle(rawTitle = '') {
    const value = String(rawTitle).trim();
    if (!value) return '';

    const withoutSource = value.replace(/\s*\(.*?\)\s*$/g, '').trim();
    const cleaned = withoutSource
        .replace(/^Cambridge IELTS\s+\d+\s+Academic Reading Test\s+\d+\s*[:\-]?\s*/i, '')
        .trim();

    return cleaned || withoutSource;
}

function extractPassageFromText(rawText = '') {
    const text = String(rawText).replace(/\r/g, '');
    const beforeQuestions = text.split(/(?:^|\n)\s*Questions\s+\d+\s*[-–]\d+/i)[0] || text;
    const lines = beforeQuestions
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    const startIndex = lines.findIndex((line) => {
        const noise = /^(Skip to content|Cambridge IELTS|🔥 Today Only:|Export|Focus|00:\d{2}:\d{2}|[-+]+|Part\s+\d+|Practice Skimming|Read the text|You should spend|Practice this section only|Complete the notes below|Choose ONE WORD ONLY|Questions\s+\d+)/i.test(line);
        return !noise && !/answer questions/i.test(line) && line.length > 10;
    });

    if (startIndex === -1) {
        return fallbackPassage;
    }

    const endIndex = lines.findIndex((line, index) => index > startIndex && /^(?:Questions\s+\d+\s*[-–]\d+|Questions\s+\d+\s*[-–]\d+.*)$/i.test(line));
    const meaningfulLines = lines.slice(startIndex, endIndex >= 0 ? endIndex : undefined);
    const cleaned = meaningfulLines.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();

    return cleaned || fallbackPassage;
}

function inferCorrectAnswerFromTitle(title = '', passage = '') {
    const cleanedTitle = parseTestTitle(title) || 'Reading passage';
    const shortTitle = cleanedTitle.replace(/\b(Academic|Reading|Test)\b/gi, '').trim();
    const candidate = shortTitle || 'the main idea of the passage';

    const yearMatch = (passage.match(/\b(19\d{2}|20\d{2})\b/g) || [])[0];
    const regionMatch = (passage.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || []).find((word) => word.length > 4);

    return {
        mainTopic: cleanedTitle || 'the passage topic',
        timeFocus: yearMatch || 'the period discussed in the text',
        keySubject: regionMatch || candidate.split(' ').slice(0, 2).join(' '),
        detailPhrase: candidate.split(' ').slice(0, 4).join(' '),
    };
}

function buildQuestions(title, passage) {
    const answers = inferCorrectAnswerFromTitle(title, passage);
    return [
        {
            prompt: 'What is the main topic of this reading passage?',
            answer: answers.mainTopic,
            hint: 'Look at the title and the opening sentence.',
        },
        {
            prompt: 'Which time period is the text mainly concerned with?',
            answer: answers.timeFocus,
            hint: 'Check the dates or historical context in the first paragraph.',
        },
        {
            prompt: 'What makes the subject in this passage important?',
            answer: answers.detailPhrase,
            hint: 'Focus on the main idea and the significance described.',
        },
        {
            prompt: 'Which key noun best captures the topic of the text?',
            answer: answers.keySubject,
            hint: 'Find the main subject or named thing in the passage.',
        },
        {
            prompt: 'In one short phrase, describe the purpose of reading this text carefully.',
            answer: 'to understand the main idea and key details',
            hint: 'Think about why close reading matters.',
        },
    ];
}

function checkAnswer(inputValue, answerText) {
    const userValue = normalizeAnswer(inputValue);
    const expected = normalizeAnswer(answerText);

    if (!userValue) return false;
    if (userValue === expected) return true;

    const accepted = expected.split(' ');
    const userWords = new Set(userValue.split(' '));
    const matches = accepted.filter((word) => word.length > 2 && (userWords.has(word) || userValue.includes(word))).length;

    return matches >= Math.max(2, Math.ceil(accepted.length * 0.6));
}

function renderQuestionList(questions) {
    const host = document.getElementById('questionList');
    const countHost = document.getElementById('questionCount');
    if (!host) return;

    // Helper to escape HTML in prompts
    const escapeHtml = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

    const rows = questions.map((question, index) => {
        const qType = String((question.type || 'unknown')).toLowerCase();
        const prompt = escapeHtml(question.prompt || `Question ${index+1}`);
        let inputHtml = '';

        if (qType.includes('tf') || qType.includes('true') || qType.includes('tfng') || qType === 'tfng' || qType === 'true_false_not_given') {
            // True / False / Not Given - radio buttons
            inputHtml = `
                <div class="tfng-group" data-index="${index}" data-type="tfng">
                  <label><input type="radio" name="q${index}" value="True"> True</label>
                  <label><input type="radio" name="q${index}" value="False"> False</label>
                  <label><input type="radio" name="q${index}" value="Not Given"> Not Given</label>
                </div>`;
        } else if (qType.includes('multiple') || qType.includes('mcq') || (Array.isArray(question.choices) && question.choices.length > 0)) {
            // Multiple choice - render choices if present
            const choices = Array.isArray(question.choices) ? question.choices : [];
            if (choices.length) {
                inputHtml = `<div class="mcq-group" data-index="${index}" data-type="multiple-choice">` + choices.map((c,ci) => `
                    <label><input type="radio" name="q${index}" value="${escapeHtml(String(c))}"> ${escapeHtml(String(c))}</label>`).join('') + '</div>';
            } else {
                // fallback to text input
                inputHtml = `<div class="answer-row"><input type="text" class="answer-input" data-index="${index}" data-type="text" placeholder="Type your answer..." /></div>`;
            }
        } else if (qType.includes('match') || qType.includes('heading')) {
            // Matching headings - if choices exist, present dropdown
            const choices = Array.isArray(question.choices) ? question.choices : [];
            if (choices.length) {
                inputHtml = `<select data-index="${index}" data-type="matching-heading">
                    <option value="">-- select heading --</option>` + choices.map((c) => `<option value="${escapeHtml(String(c))}">${escapeHtml(String(c))}</option>`).join('') + `</select>`;
            } else {
                inputHtml = `<div class="answer-row"><input type="text" class="answer-input" data-index="${index}" data-type="text" placeholder="Enter heading or number" /></div>`;
            }
        } else if (qType.includes('sentence') || qType.includes('completion')) {
            // Sentence completion - single-line input (one word or short phrase)
            inputHtml = `<div class="answer-row"><input type="text" class="answer-input" data-index="${index}" data-type="completion" placeholder="One word only (if required)" /></div>`;
        } else {
            // default: short answer text input
            inputHtml = `<div class="answer-row"><input type="text" class="answer-input" data-index="${index}" data-type="text" placeholder="Type your answer..." /></div>`;
        }

        return `
            <div class="question-row" data-qtype="${escapeHtml(qType)}">
                <div class="question-header"><span class="question-label">${index + 1}.</span> <span class="question-prompt">${prompt}</span></div>
                <div class="question-body">${inputHtml}</div>
            </div>`;
    }).join('');

    host.innerHTML = rows || '<p>No questions available for this test.</p>';

    if (countHost) countHost.textContent = `${questions.length} questions`;
}

function renderPassage(title, text) {
    const host = document.getElementById('readingPassage');
    const titleHost = document.getElementById('readingTitle');
    if (titleHost) titleHost.textContent = title || 'Reading passage';
    if (!host) return;

    const str = String(text || '').trim();
    // Always render passage as plain text paragraphs (strip any HTML for safety)
    const cleaned = str.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    const paragraphs = cleaned.split(/([\.|\?|\!]\s+)/).reduce((acc, cur, idx, arr) => {
        // simple sentence-based grouping to form readable paragraphs if original text had no blank lines
        if (cur.trim() === '') return acc;
        if (acc.length === 0) acc.push(cur);
        else acc[acc.length - 1] += cur;
        return acc;
    }, []).map(p => `<p>${p.trim()}</p>`).join('');

    host.innerHTML = paragraphs || '<p>No passage available.</p>';
}

async function loadTestList() {
    const select = document.getElementById('testSelect');
    if (!select) return;

    try {
        const response = await fetch('data/cambridge_ielts_reading/manifest.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Manifest not found');
        const manifest = await response.json();

        const items = Array.isArray(manifest) ? manifest : manifest.tests || [];
        if (!items.length) throw new Error('No tests found');

        state.tests = items.map((item) => ({
            slug: item.slug || item.file?.replace(/\.txt$/i, '') || '',
            title: item.title || item.name || 'Cambridge IELTS Reading',
            file: item.file || item.filename || '',
            source: item.url || '',
        }));
    } catch (error) {
        console.warn('Unable to load Cambridge dataset:', error);
        state.tests = [
            { slug: 'sample-test', title: 'Sample IELTS Reading', file: '', source: '' },
        ];
    }

    select.innerHTML = state.tests.map((test, index) => `<option value="${index}">${test.title}</option>`).join('');

    const params = new URLSearchParams(window.location.search);
    const requestedTest = params.get('test');
    const requestedIndex = requestedTest
        ? state.tests.findIndex((test) => test.slug === requestedTest || test.file === requestedTest || test.title === requestedTest)
        : -1;

    state.currentIndex = requestedIndex >= 0 ? requestedIndex : 0;
    select.value = String(state.currentIndex);
    loadCurrentTest();
}

async function loadCurrentTest() {
    const test = state.tests[state.currentIndex] || state.tests[0];
    const titleHost = document.getElementById('examTitle');
    if (titleHost) {
        titleHost.textContent = test ? test.title : 'IELTS Reading Practice';
    }

    if (!test) return;

    // Try to load a structured JSON file first (one-per-test DB)
    const structuredPath = `data/cambridge_ielts_reading/structured/${test.slug}.json`;
    try {
        const resp = await fetch(structuredPath, { cache: 'no-store' });
        if (resp.ok) {
            const parsed = await resp.json();
            const title = parsed.title || test.title || 'Reading passage';
            const passageHtml = parsed.passage_html || null;
            const passageText = parsed.passage_text || null;
            const questions = Array.isArray(parsed.questions) ? parsed.questions : [];

            state.currentQuestions = questions;
            renderPassage(title, passageHtml || passageText || extractPassageFromText(passageText || ''));
            renderQuestionList(questions);
            updateScoreSummary('Structured test loaded.', 'info');
            updateScoreChip(0, questions.length);
            return;
        }
    } catch (e) {
        // ignore structured loading errors and fallback to original loader
        console.warn('Structured file not available or failed to load:', e);
    }

    // Fallback: load raw file (legacy behavior)
    let rawText = '';
    let title = test.title;

    if (test.file) {
        try {
            const response = await fetch(`data/cambridge_ielts_reading/${test.file}`, { cache: 'no-store' });
            if (response.ok) {
                const text = await response.text();
                // Try to parse JSON files saved from the crawler; fallback to raw text
                try {
                    const parsed = JSON.parse(text);
                    // parsed may be: { content: '<p>...</p>' } or { content: { rendered: '...' } }
                    if (parsed) {
                        if (typeof parsed.content === 'string') {
                            rawText = parsed.content;
                        } else if (parsed.content && typeof parsed.content.rendered === 'string') {
                            rawText = parsed.content.rendered;
                        } else if (typeof parsed === 'string') {
                            rawText = parsed;
                        } else if (parsed.excerpt && typeof parsed.excerpt === 'string' && !parsed.content) {
                            // sometimes content is missing but excerpt exists
                            rawText = parsed.excerpt;
                        } else {
                            rawText = text;
                        }

                        // title may be a string or an object with rendered
                        if (parsed.title) {
                            if (typeof parsed.title === 'string') title = parsed.title;
                            else if (parsed.title.rendered) title = parsed.title.rendered;
                        }
                    } else {
                        rawText = text;
                    }
                } catch (e) {
                    rawText = text;
                }

                const detectedTitle = String(rawText || title)
                    .split(/\n+/)
                    .map((line) => line.trim())
                    .find((line) => line && !/^(Skip to content|Cambridge IELTS|Export|Focus|Part\s+\d+|Read the text|You should spend|Practice Skimming|Questions\s+\d+)/i.test(line));
                title = parseTestTitle(detectedTitle || test.title || title) || 'Reading passage';
            }
        } catch (error) {
            console.warn('Unable to load reading test file:', error);
        }
    }

    // If content looks like HTML, try to parse and extract the article content
    let passageHtml = null;
    let passageText = null;

    if (/^\s*</.test(String(rawText || ''))) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(rawText, 'text/html');
            const el = doc.querySelector('article') || doc.querySelector('.entry-content') || doc.querySelector('.post-content') || doc.querySelector('#content') || doc.querySelector('main') || doc.body;
            if (el) {
                passageHtml = el.innerHTML;
                passageText = el.innerText.replace(/\r/g, '');
            }
        } catch (e) {
            passageText = String(rawText).replace(/<[^>]+>/g, '');
        }
    }

    const plainPassage = passageText || extractPassageFromText((rawText && rawText.replace(/<[^>]+>/g, '')) || fallbackPassage);
    const questions = buildQuestions(title, plainPassage);
    state.currentQuestions = questions;

    // render: prefer HTML if available (keeps formatting), otherwise render plain text
    renderPassage(title, passageHtml || plainPassage);
    renderQuestionList(questions);
    updateScoreSummary('Select a test and start practicing.', 'info');
    updateScoreChip(0, questions.length);
}

function updateScoreSummary(message, type = 'info') {
    const host = document.getElementById('scoreSummary');
    if (!host) return;
    host.className = `english-submit-message ${type}`;
    host.textContent = message;
}

function updateScoreChip(correct, total) {
    const host = document.getElementById('scoreChip');
    if (!host) return;
    host.textContent = `${correct}/${total}`;
}

function submitCurrentTest() {
    const questionRows = Array.from(document.querySelectorAll('.question-row'));
    const total = questionRows.length || 0;

    if (!total) {
        updateScoreSummary('No question set is loaded yet.', 'error');
        return;
    }

    let correct = 0;
    const answers = state.currentQuestions || [];

    questionRows.forEach((row, index) => {
        const q = answers[index] || {};
        const qType = String((q.type || 'unknown')).toLowerCase();
        let userValue = null;
        // find inputs within row
        const textInput = row.querySelector('input.answer-input');
        const selectInput = row.querySelector('select');
        const radioChecked = row.querySelector('input[type=radio]:checked');

        if (textInput) userValue = textInput.value;
        else if (selectInput) userValue = selectInput.value;
        else if (radioChecked) userValue = radioChecked.value;
        else userValue = '';

        // scoring logic per type
        let isCorrect = false;
        if (qType === 'tfng' || qType.includes('true')) {
            // normalize expected answer values to one of True/False/Not Given
            const expected = (Array.isArray(q.answer) ? q.answer[0] : q.answer) || '';
            isCorrect = String((userValue || '')).toLowerCase().trim() === String(expected || '').toLowerCase().trim();
        } else if (qType.includes('multiple') || qType.includes('mcq')) {
            const expected = (Array.isArray(q.answer) ? q.answer[0] : q.answer) || '';
            isCorrect = String((userValue || '')).toLowerCase().trim() === String(expected || '').toLowerCase().trim();
        } else if (qType.includes('completion') || qType.includes('sentence')) {
            const expected = (Array.isArray(q.answer) ? q.answer[0] : q.answer) || '';
            isCorrect = checkAnswer(userValue, expected);
        } else {
            // default: text matching heuristic
            const expected = (Array.isArray(q.answer) ? q.answer[0] : q.answer) || '';
            isCorrect = checkAnswer(userValue, expected);
        }

        if (isCorrect) correct += 1;

        // show status
        const existing = row.querySelector('.badge-status');
        if (existing) existing.remove();
        const status = document.createElement('span');
        status.className = isCorrect ? 'badge-correct badge-status' : 'badge-incorrect badge-status';
        status.textContent = isCorrect ? '✓' : '✗';
        const header = row.querySelector('.question-header') || row;
        header.appendChild(status);
    });

    updateScoreChip(correct, total);
    updateScoreSummary(`You scored ${correct} out of ${total}.`, 'success');
}tent = isCorrect ? ' ✓' : ' ✗';
            label.appendChild(status);
        }
    });

    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    updateScoreChip(correct, total);
    updateScoreSummary(`Your score: ${correct}/${total} (${score}%).`, score >= 60 ? 'success' : 'info');
}

function resetCurrentTest() {
    document.querySelectorAll('.answer-input').forEach((input) => {
        input.value = '';
    });

    document.querySelectorAll('.badge-status').forEach((badge) => badge.remove());
    updateScoreChip(0, state.currentQuestions.length || 0);
    updateScoreSummary('Answers cleared. Start again when you are ready.', 'info');
}

const select = document.getElementById('testSelect');
if (select) {
    select.addEventListener('change', (event) => {
        state.currentIndex = Number(event.target.value || 0);
        const selectedTest = state.tests[state.currentIndex];
        const url = new URL(window.location.href);
        if (selectedTest && selectedTest.slug) {
            url.searchParams.set('test', selectedTest.slug);
        } else {
            url.searchParams.delete('test');
        }
        window.history.replaceState({}, '', url);
        loadCurrentTest();
    });
}

const loadButton = document.getElementById('loadTestButton');
if (loadButton) {
    loadButton.addEventListener('click', () => {
        loadCurrentTest();
    });
}

const submitButton = document.getElementById('submitAnswers');
if (submitButton) {
    submitButton.addEventListener('click', submitCurrentTest);
}

const checkScoreButton = document.getElementById('checkScoreButton');
if (checkScoreButton) {
    checkScoreButton.addEventListener('click', submitCurrentTest);
}

const resetButton = document.getElementById('resetAnswers');
if (resetButton) {
    resetButton.addEventListener('click', resetCurrentTest);
}

loadTestList();
