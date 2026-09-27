(function () {
    window.ENG = window.ENG || {};
    const utils = window.ENG.utils;
    const renderer = window.ENG.renderer;
    const state = window.ENG.state;

    const loader = {
        async loadAnswerKey(slug) {
            try {
                const response = await fetch('data/cambridge_ielts_reading/answer-keys.json', { cache: 'no-store' });
                if (!response.ok) return null;
                const bank = await response.json();
                return bank.tests?.[slug] || null;
            } catch (error) {
                console.warn('Unable to load reading answer keys:', error);
                return null;
            }
        },

        getQuestionResponse(questionNumber) {
            const controls = Array.from(document.querySelectorAll(`.answer-input[data-question-number="${questionNumber}"]`));
            if (!controls.length) return '';

            const checked = controls.find((control) => control.type === 'radio' && control.checked);
            if (checked) return checked.value;

            const select = controls.find((control) => control.tagName === 'SELECT');
            if (select) return select.value;

            const input = controls.find((control) => control.tagName === 'INPUT' && control.type !== 'radio');
            return input ? input.value.trim() : '';
        },

        async loadTestList() {
            const select = document.getElementById('testSelect');
            if (!select) return;

            try {
                    // prefer passage-level manifest if present
                    let response = await fetch('data/cambridge_ielts_reading/manifest_passages.json', { cache: 'no-store' });
                    if (!response.ok) {
                        response = await fetch('data/cambridge_ielts_reading/manifest.json', { cache: 'no-store' });
                    }
                    if (!response.ok) throw new Error('Manifest not found');
                    const manifest = await response.json();
                    const items = Array.isArray(manifest) ? manifest : (manifest.tests || []);

                    if (!items.length) throw new Error('No tests found');

                    state.tests = items.map((item) => ({
                        slug: item.slug || item.file?.replace(/\.txt$/i, '') || '',
                        title: item.title || item.name || 'Cambridge IELTS Reading',
                        file: item.file || item.filename || '',
                        source: item.url || item.link || '',
                        passage: item.passage || 1,
                        test_slug: item.test_slug || item.slug || '',
                    }));
            } catch (error) {
                console.warn('Unable to load Cambridge dataset:', error);
                state.tests = [{ slug: 'sample-test', title: 'Sample IELTS Reading', file: '', source: '' }];
            }

            select.innerHTML = state.tests.map((test, index) => `<option value="${index}">${utils.escapeHtml(test.title)}</option>`).join('');

            const params = new URLSearchParams(window.location.search);
            const requestedTest = params.get('test');
            const requestedIndex = requestedTest
                ? state.tests.findIndex((test) => test.slug === requestedTest || test.file === requestedTest || test.title === requestedTest)
                : -1;

            state.currentIndex = requestedIndex >= 0 ? requestedIndex : 0;
            select.value = String(state.currentIndex);
            await loader.loadCurrentTest();
        },

        async loadCurrentTest() {
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

            const passage = utils.extractPassageFromText(rawText || window.ENG.fallbackPassage);
            const groups = (function buildLegacyQuestionGroups(sourceText) {
                // Keep the legacy lightweight extractor for older manifest items.
                // This function is intentionally compact; it attempts to find question blocks and minimal grouping.
                const raw = String(sourceText || '');
                const lines = raw.split(/\n/).map((l) => l.trim()).filter(Boolean);
                const groups = [];
                // Heuristic: split on lines like "Questions 1-13" or "Questions 14-26"
                const blockIndices = [];
                lines.forEach((line, idx) => {
                    if (/^Questions\s+\d+\s*[-–]\s*\d+/i.test(line)) blockIndices.push(idx);
                });

                if (!blockIndices.length) {
                    // fallback: put all discovered short-answer-like lines into a single group
                    const questions = [];
                    lines.forEach((line) => {
                        const m = line.match(/^\s*(\d{1,3})\.\s*(.*)$/);
                        if (m) {
                            questions.push({ number: Number(m[1]), prompt: m[2] });
                        }
                    });
                    if (questions.length) groups.push({ id: 'g-legacy-1', title: 'Questions', type: 'short_answer', questions });
                    return groups;
                }

                for (let i = 0; i < blockIndices.length; i++) {
                    const start = blockIndices[i];
                    const end = blockIndices[i + 1] || lines.length;
                    const header = lines[start];
                    const rangeMatch = header.match(/Questions\s+(\d+)\s*[-–]\s*(\d+)/i);
                    const questions = [];
                    for (let j = start + 1; j < end; j++) {
                        const m = lines[j].match(/^\s*(\d{1,3})\.\s*(.*)$/);
                        if (m) questions.push({ number: Number(m[1]), prompt: m[2] });
                        else if (/^A\.|^B\.|^C\.|^D\./.test(lines[j])) break; // likely choices begin
                    }
                    const type = rangeMatch ? 'short_answer' : 'short_answer';
                    groups.push({ id: `g-legacy-${i + 1}`, title: header, instructions: '', question_type: type, questions });
                }

                return groups;
            })(rawText || window.ENG.fallbackPassage);

            state.currentGroups = groups.length > 0 ? groups : [{
                id: `${test.slug || 'default'}-group`,
                title: 'Reading questions',
                instructions: 'Answer the questions below.',
                type: 'short_answer',
                questions: [],
            }];
            state.currentQuestions = state.currentGroups.flatMap((group) => Array.isArray(group.questions) ? group.questions : []);
            state.currentAnswerKey = await loader.loadAnswerKey(test.slug);

            renderer.renderPassage(title, passage);
            renderer.renderQuestionList(state.currentGroups);
            renderer.updateScoreChip(0, state.currentQuestions.length);
            await loader.loadAttemptHistory();
        },

        async loadAttemptHistory() {
            const host = document.getElementById('attemptHistory');
            if (!host) return;
            const test = state.tests[state.currentIndex];
            const userId = localStorage.getItem('userId');
            if (!userId || !window.supabase) {
                window.ENG.state.attempts = [];
                host.innerHTML = '<li>Sign in to save and view practice history.</li>';
                return;
            }

            try {
                window.ENG.state.attempts = await window.supabase.get('english_reading_attempts', {
                    select: 'id,test_slug,test_title,correct_count,graded_count,total_count,score_percent,review,completed_at',
                    filters: { user_id: userId, test_slug: test?.slug || '' },
                    order: { column: 'completed_at', direction: 'desc' },
                });
                host.innerHTML = window.ENG.state.attempts.length
                    ? window.ENG.state.attempts.map((attempt) => {
                        const date = new Date(attempt.completed_at).toLocaleString();
                        const score = attempt.score_percent === null
                            ? 'Ungraded'
                            : `${attempt.correct_count}/${attempt.graded_count} (${attempt.score_percent}%)`;
                        return `<li>
                            <span><time datetime="${utils.escapeHtml(attempt.completed_at)}">${utils.escapeHtml(date)}</time><strong>${utils.escapeHtml(score)}</strong></span>
                            <button type="button" class="history-review-button" data-attempt-id="${utils.escapeHtml(attempt.id)}">Review answers</button>
                        </li>`;
                    }).join('')
                    : '<li>No attempts yet.</li>';
            } catch (error) {
                console.error('Unable to load reading attempt history:', error);
                window.ENG.state.attempts = [];
                host.innerHTML = '<li>Could not load practice history.</li>';
            }
        }
    };

    window.ENG.loader = loader;
})();