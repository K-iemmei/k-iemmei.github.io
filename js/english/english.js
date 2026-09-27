/* ARCHIVED: legacy english runtime (see scripts/archive_english_legacy.js)
   The codebase was modularized into js/english/{state,utils,renderer,loader,submit,index}.
   This file is kept for reference but is considered archived.
*/

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
    currentGroups: [],
    currentQuestions: [],
    currentAnswerKey: null,
    attempts: [],
};

const fallbackPassage = `Artificial intelligence is increasingly shaping the workplace, but its effect on employment is still a matter of debate. Some analysts argue that AI will replace many routine tasks, particularly in administration, data processing and basic customer service. These roles often involve repetitive work that can be automated with software. As a result, workers in these fields may need to retrain or focus on more complex responsibilities that require judgment, empathy and creativity.`;

function escapeHtml(value = '') {
    return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function normalizeAnswer(value = '') {
    return String(value ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeQuestionType(value = '') {
    const raw = String(value || '').trim().toLowerCase();
    const map = {
        tfng: 'true_false_not_given',
        true_false: 'true_false_not_given',
        true_false_not_given: 'true_false_not_given',
        yes_no: 'yes_no_not_given',
        yes_no_not_given: 'yes_no_not_given',
        matching_heading: 'matching_headings',
        matching_headings: 'matching_headings',
        matching_information: 'matching_information',
        matching_features: 'matching_features',
        matching_sentence_endings: 'matching_sentence_endings',
        multiple_choice: 'multiple_choice',
        mcq: 'multiple_choice',
        summary_completion: 'summary_completion',
        sentence_completion: 'sentence_completion',
        note_completion: 'note_completion',
        table_completion: 'table_completion',
        flow_chart_completion: 'flow_chart_completion',
        diagram_labelling: 'diagram_labelling',
        short_answer: 'short_answer',
    };

    return map[raw] || raw || 'short_answer';
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

    if (startIndex === -1) return fallbackPassage;

    const endIndex = lines.findIndex((line, index) => index > startIndex && /^(?:Questions\s+\d+\s*[-–]\d+|Questions\s+\d+\s*[-–]\d+.*)$/i.test(line));
    const meaningfulLines = lines.slice(startIndex, endIndex >= 0 ? endIndex : undefined);
    const cleaned = meaningfulLines.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();

    return cleaned || fallbackPassage;
}

function getQuestionType(instructions = '') {
    const text = (instructions || '').toLowerCase();
    if (/true\s*\/\s*false\s*\/\s*not given|true[\s\S]*false[\s\S]*not given|statements agree/.test(text)) return 'true_false_not_given';
    if (/yes\s*\/\s*no\s*\/\s*not given|yes[\s\S]*no[\s\S]*not given/.test(text)) return 'yes_no_not_given';
    if (/choose.{0,60}heading|matching headings/.test(text)) return 'matching_headings';
    if (/which paragraph (contains|mentions|refers to)/.test(text)) return 'matching_information';
    if (/match.{0,40}(people|features|statements)/.test(text)) return 'matching_features';
    if (/choose the correct letter|choose one letter/.test(text)) return 'multiple_choice';
    if (/complete the flow.?chart/.test(text)) return 'flow_chart_completion';
    if (/complete the table/.test(text)) return 'table_completion';
    if (/complete the summary/.test(text)) return 'summary_completion';
    if (/complete the notes/.test(text)) return 'note_completion';
    if (/choose one word|choose no more than|one word only|one word/.test(text)) return 'sentence_completion';
    if (/complete the sentence/.test(text)) return 'sentence_completion';
    return 'short_answer';
}

function buildLegacyQuestionGroups(rawText = '') {
    const lines = String(rawText).replace(/\r/g, '').split('\n').map((line) => line.trim()).filter(Boolean);
    const starts = [];

    lines.forEach((line, index) => {
        const match = line.match(/^Questions\s+(\d+)\s*[-–]\s*(\d+)/i);
        if (match) starts.push({ index, first: Number(match[1]), last: Number(match[2]) });
    });

    return starts.map((section, sectionIndex) => {
        const nextIndex = starts[sectionIndex + 1]?.index ?? lines.length;
        const rawSectionLines = lines.slice(section.index + 1, nextIndex);
        const footerIndex = rawSectionLines.findIndex((line) => /^(?:Part\s+\d+\s*:|Submit\b|Tip:|Home\b|Leave a Reply\b|Save my name\b|\d+\s+comments? on\b)/i.test(line));
        const sectionLines = rawSectionLines.slice(0, footerIndex >= 0 ? footerIndex : undefined);
        const questionNumbers = new Set(Array.from({ length: section.last - section.first + 1 }, (_, offset) => section.first + offset));
        const firstQuestionLine = sectionLines.findIndex((line) => {
            const leadingNumber = line.match(/^(\d{1,2})\s+(.+)$/);
            return (leadingNumber && questionNumbers.has(Number(leadingNumber[1])))
                || Array.from(questionNumbers).some((number) => new RegExp(`\\b${number}\\s+(?=\\S)`).test(line));
        });
        const instructionLines = sectionLines.slice(0, firstQuestionLine < 0 ? sectionLines.length : firstQuestionLine)
            .filter((line) => !/^Practice this section only$/i.test(line));
        const instructions = instructionLines.join(' ');
        const questions = new Map();
        let activeNumber = null;
        let pendingOption = null;

        sectionLines.forEach((line) => {
            const numberedPrompt = line.match(/^(\d{1,2})\s+(.+)$/);
            if (numberedPrompt && questionNumbers.has(Number(numberedPrompt[1]))) {
                activeNumber = Number(numberedPrompt[1]);
                questions.set(activeNumber, { id: `q${activeNumber}`, number: activeNumber, prompt: numberedPrompt[2], options: [] });
                pendingOption = null;
                return;
            }

            const embeddedNumbers = Array.from(line.matchAll(/\b(\d{1,2})\s+(?=\S)/g))
                .filter((match) => questionNumbers.has(Number(match[1])));
            if (embeddedNumbers.length) {
                embeddedNumbers.forEach((match, index) => {
                    const number = Number(match[1]);
                    const start = match.index;
                    const end = embeddedNumbers[index + 1]?.index ?? line.length;
                    const before = index === 0 ? line.slice(0, start) : '';
                    const after = line.slice(start + match[0].length, end);
                    const prompt = `${before}_____ ${after}`.replace(/\s+/g, ' ').trim();
                    if (prompt.length > 4) {
                        questions.set(number, { id: `q${number}`, number, prompt, options: [] });
                    }
                });
                activeNumber = null;
                pendingOption = null;
                return;
            }

            const optionLine = line.match(/^([A-F])(?:[.)]\s*|\s+)(.+)$/i);
            if (activeNumber !== null && optionLine) {
                questions.get(activeNumber)?.options.push({ id: optionLine[1].toUpperCase(), text: optionLine[2] });
                pendingOption = null;
                return;
            }

            if (activeNumber !== null && /^[A-F]$/i.test(line)) {
                pendingOption = line.toUpperCase();
                return;
            }

            if (activeNumber !== null && pendingOption && !/^(?:TRUE|FALSE|NOT GIVEN|YES|NO)$/i.test(line)) {
                questions.get(activeNumber)?.options.push({ id: pendingOption, text: line });
                pendingOption = null;
                return;
            }

            if (activeNumber !== null && !/^(?:TRUE|FALSE|NOT GIVEN|YES|NO)$/i.test(line)) {
                const question = questions.get(activeNumber);
                if (question) {
                    question.prompt = `${question.prompt} ${line}`.trim();
                }
            }
        });

        const groupType = getQuestionType(instructions);
        return {
            id: `group-${section.first}-${section.last}`,
            type: groupType,
            title: `Questions ${section.first}-${section.last}`,
            instructions,
            questions: Array.from({ length: section.last - section.first + 1 }, (_, offset) => {
                const number = section.first + offset;
                return questions.get(number) || { id: `q${number}`, number, prompt: 'Question text is unavailable in this source.', options: [] };
            }),
        };
    }).filter((group) => group.questions.length > 0);
}

function renderInputMarkup(question, groupType, questionNumber) {
    const type = normalizeQuestionType(question.question_type || question.type || groupType || 'short_answer');
    const options = Array.isArray(question.options || question.choices) ? (question.options || question.choices) : [];

    if (type === 'true_false_not_given' || type === 'yes_no_not_given') {
        const choices = type === 'true_false_not_given' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : ['YES', 'NO', 'NOT GIVEN'];
        return `
            <div class="answer-row tfng-group" data-question-number="${questionNumber}" data-type="${type}">
                ${choices.map((choice) => `
                    <label>
                        <input type="radio" class="answer-input" data-question-number="${questionNumber}" data-question-id="${escapeHtml(question.id || questionNumber)}" name="answer-${questionNumber}" value="${choice}" />
                        ${choice}
                    </label>
                `).join('')}
            </div>
        `;
    }

    if (type === 'multiple_choice' && options.length) {
        return `
            <div class="answer-row mcq-group" data-question-number="${questionNumber}" data-type="${type}">
                ${options.map((option) => {
                    const raw = typeof option === 'object' ? (option.id || option.value || option.label || option.text || '') : String(option);
                    const label = typeof option === 'object' ? (option.text || option.label || option.id || option.value || '') : String(option);
                    return `
                        <label>
                            <input type="radio" class="answer-input" data-question-number="${questionNumber}" data-question-id="${escapeHtml(question.id || questionNumber)}" name="answer-${questionNumber}" value="${escapeHtml(raw || label)}" />
                            ${escapeHtml(raw || label)}${raw && label && String(raw).toUpperCase() !== String(label).toUpperCase() ? `. ${escapeHtml(label)}` : ''}
                        </label>
                    `;
                }).join('')}
            </div>
        `;
    }

    if (['matching_headings', 'matching_information', 'matching_features', 'matching_sentence_endings'].includes(type) && options.length) {
        const selectOptions = [`<option value="">-- select --</option>`]
            .concat(options.map((option) => {
                const value = typeof option === 'object' ? (option.id || option.value || option.label || option.text || '') : String(option);
                return `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`;
            }))
            .join('');

        return `<div class="answer-row"><select class="answer-input" data-question-number="${questionNumber}" data-question-id="${escapeHtml(question.id || questionNumber)}" data-type="${type}">${selectOptions}</select></div>`;
    }

    return `<div class="answer-row"><input type="text" class="answer-input" data-question-number="${questionNumber}" data-question-id="${escapeHtml(question.id || questionNumber)}" data-type="${type}" placeholder="Your answer" aria-label="Answer for question ${questionNumber}" /></div>`;
}

function renderQuestionList(groups) {
    const host = document.getElementById('questionList');
    const countHost = document.getElementById('questionCount');
    if (!host) return;

    const normalizedGroups = Array.isArray(groups) ? groups : [];
    const questions = normalizedGroups.flatMap((group) => Array.isArray(group?.questions) ? group.questions : []);

    host.innerHTML = normalizedGroups.map((group, groupIndex) => {
        const groupType = normalizeQuestionType(group?.question_type || group?.type || 'short_answer');
        const groupQuestions = Array.isArray(group?.questions) ? group.questions : [];

        return `
            <section class="question-group" data-type="${escapeHtml(groupType)}">
                <h3>${escapeHtml(group?.title || `Question set ${groupIndex + 1}`)}</h3>
                ${group?.instructions ? `<p class="question-instructions">${escapeHtml(group.instructions)}</p>` : ''}
                ${groupQuestions.map((question, questionIndex) => {
                    const questionNumber = question.number || questionIndex + 1;
                    const prompt = question.prompt || `Question ${questionNumber}`;
                    return `
                        <div class="question-row" data-question-number="${questionNumber}" data-question-id="${escapeHtml(question.id || questionNumber)}">
                            <span class="question-label">${questionNumber}.</span>
                            <span class="question-prompt">${escapeHtml(prompt)}</span>
                            <div class="answer-row">
                                ${renderInputMarkup(question, groupType, questionNumber)}
                            </div>
                        </div>
                    `;
                }).join('')}
            </section>
        `;
    }).join('') || '<p>No questions available for this test.</p>';

    if (countHost) {
        countHost.textContent = `${questions.length} question${questions.length === 1 ? '' : 's'}`;
    }
}

function renderPassage(title, text) {
    const host = document.getElementById('readingPassage');
    const titleHost = document.getElementById('readingTitle');
    if (titleHost) titleHost.textContent = title || 'Reading passage';
    if (!host) return;

    const raw = String(text || '').trim();
    const cleaned = raw.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    const paragraphs = cleaned
        ? cleaned.split(/([.!?]\s+)/).reduce((acc, chunk) => {
            if (!chunk.trim()) return acc;
            if (!acc.length) {
                acc.push(chunk);
                return acc;
            }
            acc[acc.length - 1] += chunk;
            return acc;
        }, []).map((paragraph) => `<p>${paragraph.trim()}</p>`).join('')
        : '<p>No passage available.</p>';

    host.innerHTML = paragraphs;
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

async function loadAnswerKey(slug) {
    try {
        const response = await fetch('data/cambridge_ielts_reading/answer-keys.json', { cache: 'no-store' });
        if (!response.ok) return null;
        const bank = await response.json();
        return bank.tests?.[slug] || null;
    } catch (error) {
        console.warn('Unable to load reading answer keys:', error);
        return null;
    }
}

function getQuestionResponse(questionNumber) {
    const controls = Array.from(document.querySelectorAll(`.answer-input[data-question-number="${questionNumber}"]`));
    if (!controls.length) return '';

    const checked = controls.find((control) => control.type === 'radio' && control.checked);
    if (checked) return checked.value;

    const select = controls.find((control) => control.tagName === 'SELECT');
    if (select) return select.value;

    const input = controls.find((control) => control.tagName === 'INPUT' && control.type !== 'radio');
    return input ? input.value.trim() : '';
}

async function loadTestList() {
    const select = document.getElementById('testSelect');
    if (!select) return;

    try {
        const response = await fetch('data/cambridge_ielts_reading/manifest.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Manifest not found');
        const manifest = await response.json();
        const items = Array.isArray(manifest) ? manifest : (manifest.tests || []);

        if (!items.length) throw new Error('No tests found');

        state.tests = items.map((item) => ({
            slug: item.slug || item.file?.replace(/\.txt$/i, '') || '',
            title: item.title || item.name || 'Cambridge IELTS Reading',
            file: item.file || item.filename || '',
            source: item.url || item.link || '',
        }));
    } catch (error) {
        console.warn('Unable to load Cambridge dataset:', error);
        state.tests = [{ slug: 'sample-test', title: 'Sample IELTS Reading', file: '', source: '' }];
    }

    select.innerHTML = state.tests.map((test, index) => `<option value="${index}">${escapeHtml(test.title)}</option>`).join('');

    const params = new URLSearchParams(window.location.search);
    const requestedTest = params.get('test');
    const requestedIndex = requestedTest
        ? state.tests.findIndex((test) => test.slug === requestedTest || test.file === requestedTest || test.title === requestedTest)
        : -1;

    state.currentIndex = requestedIndex >= 0 ? requestedIndex : 0;
    select.value = String(state.currentIndex);
    await loadCurrentTest();
}

async function loadCurrentTest() {
    const test = state.tests[state.currentIndex] || state.tests[0];
    const titleHost = document.getElementById('examTitle');
    if (titleHost) {
        titleHost.textContent = test ? test.title : 'IELTS Reading Practice';
    }

    if (!test) return;

    let title = test.title;
    let rawText = '';

    if (test.file) {
        try {
            const response = await fetch(`data/cambridge_ielts_reading/${test.file}`, { cache: 'no-store' });
            if (response.ok) {
                const text = await response.text();
                try {
                    const parsed = JSON.parse(text);
                    if (typeof parsed === 'string') {
                        rawText = parsed;
                    } else if (parsed && typeof parsed.content === 'string') {
                        rawText = parsed.content;
                    } else if (parsed && parsed.content && typeof parsed.content.rendered === 'string') {
                        rawText = parsed.content.rendered;
                    } else {
                        rawText = text;
                    }

                    if (parsed && parsed.title) {
                        title = typeof parsed.title === 'string' ? parsed.title : (parsed.title.rendered || title);
                    }
                } catch (_error) {
                    rawText = text;
                }

                if (/^\s*</.test(String(rawText || ''))) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(rawText, 'text/html');
                    const article = doc.querySelector('article') || doc.querySelector('.entry-content') || doc.querySelector('.post-content') || doc.querySelector('#content') || doc.querySelector('main') || doc.body;
                    if (article) {
                        rawText = article.innerText.replace(/\r/g, '');
                    }
                }
            }
        } catch (error) {
            console.warn('Unable to load reading test file:', error);
        }
    }

    const passage = extractPassageFromText(rawText || fallbackPassage);
    const groups = buildLegacyQuestionGroups(rawText || fallbackPassage);

    state.currentGroups = groups.length > 0 ? groups : [{
        id: `${test.slug || 'default'}-group`,
        title: 'Reading questions',
        instructions: 'Answer the questions below.',
        type: 'short_answer',
        questions: [],
    }];
    state.currentQuestions = state.currentGroups.flatMap((group) => Array.isArray(group.questions) ? group.questions : []);
    state.currentAnswerKey = await loadAnswerKey(test.slug);

    renderPassage(title, passage);
    renderQuestionList(state.currentGroups);
    updateScoreChip(0, state.currentQuestions.length);
    await loadAttemptHistory();
}

async function submitCurrentTest() {
    const total = state.currentQuestions.length || 0;
    if (!total) {
        updateScoreSummary('No question set is loaded yet.', 'error');
        return;
    }

    const keyQuestions = state.currentAnswerKey?.questions || {};
    const results = state.currentQuestions.map((question) => {
        const key = keyQuestions[question.number];
        const response = getQuestionResponse(question.number);
        const acceptedAnswers = key ? (Array.isArray(key.answer) ? key.answer : (typeof key.answer === 'string' ? [key.answer] : [])) : [];
        const correct = Boolean(key && response && acceptedAnswers.some((answer) => normalizeAnswer(response) === normalizeAnswer(answer)));
        return { ...question, response, key, correct, graded: Boolean(key) };
    });

    const graded = results.filter((result) => result.graded);
    const correct = results.filter((result) => result.graded && result.correct).length;
    const score = graded.length ? Math.round((correct / graded.length) * 100) : null;
    const test = state.tests[state.currentIndex];
    const summary = score === null
        ? 'Attempt completed, but this test has no answer key and could not be graded.'
        : `Score: ${correct}/${graded.length} (${score}%).${total > graded.length ? ` ${total - graded.length} question${total - graded.length === 1 ? '' : 's'} not graded because the answer key is incomplete.` : ''}`;

    if (score === null) {
        updateScoreChip('—', total);
    } else {
        updateScoreChip(correct, graded.length);
    }

    const userId = localStorage.getItem('userId');
    if (!userId || !window.supabase) {
        updateScoreSummary(`${summary} Sign in to save this attempt to your history.`, 'info');
        return;
    }

    const review = results.map((result) => ({
        question_id: result.id,
        question_number: result.number,
        prompt: result.prompt,
        response: result.response,
        is_graded: result.graded,
        is_correct: result.correct,
        correct_answer: result.key?.answer ?? null,
        explanation: result.key?.explanation || '',
        evidence: result.key?.evidence || '',
    }));

    try {
        await window.supabase.create('english_reading_attempts', {
            user_id: userId,
            test_slug: test?.slug || '',
            test_title: test?.title || 'IELTS Reading',
            correct_count: correct,
            graded_count: graded.length,
            total_count: total,
            score_percent: score,
            review,
        });
        updateScoreSummary(`${summary} Saved to practice history.`, score === null ? 'info' : (score >= 60 ? 'success' : 'info'));
        await loadAttemptHistory();
    } catch (error) {
        console.error('Unable to save reading attempt:', error);
        updateScoreSummary(`${summary} Could not save this attempt to the database.`, 'error');
    }
}

async function loadAttemptHistory() {
    const host = document.getElementById('attemptHistory');
    if (!host) return;
    const test = state.tests[state.currentIndex];
    const userId = localStorage.getItem('userId');
    if (!userId || !window.supabase) {
        state.attempts = [];
        host.innerHTML = '<li>Sign in to save and view practice history.</li>';
        return;
    }

    try {
        state.attempts = await window.supabase.get('english_reading_attempts', {
            select: 'id,test_slug,test_title,correct_count,graded_count,total_count,score_percent,review,completed_at',
            filters: { user_id: userId, test_slug: test?.slug || '' },
            order: { column: 'completed_at', direction: 'desc' },
        });
        host.innerHTML = state.attempts.length
            ? state.attempts.map((attempt) => {
                const date = new Date(attempt.completed_at).toLocaleString();
                const score = attempt.score_percent === null
                    ? 'Ungraded'
                    : `${attempt.correct_count}/${attempt.graded_count} (${attempt.score_percent}%)`;
                return `<li>
                    <span><time datetime="${escapeHtml(attempt.completed_at)}">${escapeHtml(date)}</time><strong>${escapeHtml(score)}</strong></span>
                    <button type="button" class="history-review-button" data-attempt-id="${escapeHtml(attempt.id)}">Review answers</button>
                </li>`;
            }).join('')
            : '<li>No attempts yet.</li>';
    } catch (error) {
        console.error('Unable to load reading attempt history:', error);
        state.attempts = [];
        host.innerHTML = '<li>Could not load practice history.</li>';
    }
}

function renderAnswerReview(results) {
    const host = document.getElementById('answerReview');
    if (!host) return;
    host.innerHTML = results.length ? `
        ${results.map((result) => `
            <article class="answer-review-item ${result.is_graded ? (result.is_correct ? 'is-correct' : 'is-incorrect') : 'is-ungraded'}">
                <strong>Q${result.question_number}: ${result.is_graded ? (result.is_correct ? 'Correct' : 'Incorrect') : 'Not graded'}</strong>
                <p>${escapeHtml(result.prompt || '')}</p>
                <p>Your answer: ${escapeHtml(result.response || 'No answer')}</p>
                ${result.correct_answer ? `<p>Correct answer: ${escapeHtml((Array.isArray(result.correct_answer) ? result.correct_answer : [result.correct_answer]).join(' / '))}</p>
                    <p>${escapeHtml(result.explanation || '')}</p>
                    ${result.evidence ? `<button type="button" class="evidence-button" data-evidence="${escapeHtml(result.evidence)}">Show evidence</button>` : ''}`
                    : '<p>Answer key not available for this question.</p>'}
            </article>
        `).join('')}
    ` : '';
}

function showEvidence(text) {
    const passage = document.getElementById('readingPassage');
    if (!passage || !text) return;
    passage.querySelectorAll('mark.evidence-highlight').forEach((mark) => mark.replaceWith(document.createTextNode(mark.textContent)));
    passage.normalize();
    const walker = document.createTreeWalker(passage, NodeFilter.SHOW_TEXT);
    const target = text.toLowerCase();
    let node;
    while ((node = walker.nextNode())) {
        const start = node.textContent.toLowerCase().indexOf(target);
        if (start < 0) continue;
        const range = document.createRange();
        range.setStart(node, start);
        range.setEnd(node, start + text.length);
        const mark = document.createElement('mark');
        mark.className = 'evidence-highlight';
        range.surroundContents(mark);
        mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
    }
}

const select = document.getElementById('testSelect');
if (select) {
    select.addEventListener('change', async (event) => {
        state.currentIndex = Number(event.target.value || 0);
        const selectedTest = state.tests[state.currentIndex];
        const url = new URL(window.location.href);
        if (selectedTest && selectedTest.slug) {
            url.searchParams.set('test', selectedTest.slug);
        } else {
            url.searchParams.delete('test');
        }
        window.history.replaceState({}, '', url);
        await loadCurrentTest();
    });
}

const loadButton = document.getElementById('loadTestButton');
if (loadButton) {
    loadButton.addEventListener('click', loadCurrentTest);
}

const submitButton = document.getElementById('submitAnswers');
if (submitButton) {
    submitButton.addEventListener('click', submitCurrentTest);
}

const checkScoreButton = document.getElementById('checkScoreButton');
if (checkScoreButton) {
    checkScoreButton.addEventListener('click', submitCurrentTest);
}

const answerReview = document.getElementById('answerReview');
if (answerReview) {
    answerReview.addEventListener('click', (event) => {
        const evidenceButton = event.target.closest('.evidence-button');
        if (evidenceButton) {
            showEvidence(evidenceButton.dataset.evidence);
        }
    });
}

const attemptHistory = document.getElementById('attemptHistory');
if (attemptHistory) {
    attemptHistory.addEventListener('click', (event) => {
        const button = event.target.closest('.history-review-button');
        if (!button) return;
        const attempt = state.attempts.find((item) => item.id === button.dataset.attemptId);
        if (!attempt) return;
        renderAnswerReview(attempt.review || []);
        document.getElementById('answerReviewDialog')?.showModal();
    });
}

loadTestList();
