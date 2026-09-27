(function () {
    window.ENG = window.ENG || {};
    const utils = window.ENG.utils;
    const stateRef = () => window.ENG.state;

    const renderer = {
        renderInputMarkup(question, type, questionNumber) {
            const q = question || {};
            const num = questionNumber || q.number || '';
            const t = utils.normalizeQuestionType(type || q.type || q.question_type || 'short_answer');
            const answer = q.answer || q.answer_text || '';
            const options = Array.isArray(q.options) ? q.options : (q.options ? (Array.isArray(q.options) ? q.options : [] ) : []);

            // multiple choice
            if (t === 'multiple_choice' && options.length) {
                return `<div class="answer-row">${options.map((option, idx) => {
                    const v = typeof option === 'object' ? (option.value || option.id || option.label || option.text || '') : String(option);
                    const label = typeof option === 'object' ? (option.label || option.text || option.value || '') : String(option);
                    return `<label class="mc-option"><input type="radio" name="q-${num}" class="answer-input" data-question-number="${num}" value="${utils.escapeHtml(v)}" /> ${utils.escapeHtml(label)}</label>`;
                }).join('')}</div>`;
            }

            // true/false / yes/no
            if (t === 'true_false_not_given' || t === 'yes_no_not_given') {
                const choices = t === 'true_false_not_given' ? ['True','False','Not Given'] : ['Yes','No','Not Given'];
                return `<div class="answer-row">${choices.map((choice) => `<label class="tf-option"><input type="radio" name="q-${num}" class="answer-input" data-question-number="${num}" value="${utils.escapeHtml(choice)}" /> ${utils.escapeHtml(choice)}</label>`).join('')}</div>`;
            }

            // matching types -> render as select if options present
            if (['matching_headings', 'matching_information', 'matching_features', 'matching_sentence_endings'].includes(t) && options.length) {
                const selectOptions = [`<option value="">-- select --</option>`]
                    .concat(options.map((option) => {
                        const value = typeof option === 'object' ? (option.id || option.value || option.label || option.text || '') : String(option);
                        return `<option value="${utils.escapeHtml(value)}">${utils.escapeHtml(value)}</option>`;
                    }))
                    .join('');

                return `<div class="answer-row"><select class="answer-input" data-question-number="${num}" data-question-id="${utils.escapeHtml(q.id || num)}" data-type="${t}">${selectOptions}</select></div>`;
            }

            // default text input
            return `<div class="answer-row"><input type="text" class="answer-input" data-question-number="${num}" data-question-id="${utils.escapeHtml(q.id || num)}" data-type="${t}" placeholder="Your answer" aria-label="Answer for question ${num}" /></div>`;
        },

        renderQuestionList(groups) {
            const host = document.getElementById('questionList');
            const countHost = document.getElementById('questionCount');
            if (!host) return;

            const normalizedGroups = Array.isArray(groups) ? groups : [];
            const questions = normalizedGroups.flatMap((group) => Array.isArray(group?.questions) ? group.questions : []);

            host.innerHTML = normalizedGroups.map((group, groupIndex) => {
                const groupType = utils.normalizeQuestionType(group?.question_type || group?.type || 'short_answer');
                const groupQuestions = Array.isArray(group?.questions) ? group.questions : [];

                return `
                    <section class="question-group" data-type="${utils.escapeHtml(groupType)}">
                        <h3>${utils.escapeHtml(group?.title || `Question set ${groupIndex + 1}`)}</h3>
                        ${group?.instructions ? `<p class="question-instructions">${utils.escapeHtml(group.instructions)}</p>` : ''}
                        ${groupQuestions.map((question, questionIndex) => {
                            const questionNumber = question.number || questionIndex + 1;
                            const prompt = question.prompt || `Question ${questionNumber}`;
                            return `
                                <div class="question-row" data-question-number="${questionNumber}" data-question-id="${utils.escapeHtml(question.id || questionNumber)}">
                                    <span class="question-label">${questionNumber}.</span>
                                    <span class="question-prompt">${utils.escapeHtml(prompt)}</span>
                                    <div class="answer-row">
                                        ${renderer.renderInputMarkup(question, groupType, questionNumber)}
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
        },

        renderPassage(title, text) {
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
        },

        updateScoreSummary(message, type = 'info') {
            const host = document.getElementById('scoreSummary');
            if (!host) return;
            host.className = `english-submit-message ${type}`;
            host.textContent = message;
        },

        updateScoreChip(correct, total) {
            const host = document.getElementById('scoreChip');
            if (!host) return;
            host.textContent = `${correct}/${total}`;
        },

        renderAnswerReview(results) {
            const host = document.getElementById('answerReview');
            if (!host) return;
            host.innerHTML = results.length ? `
                ${results.map((result) => `
                    <article class="answer-review-item ${result.is_graded ? (result.is_correct ? 'is-correct' : 'is-incorrect') : 'is-ungraded'}">
                        <strong>Q${result.question_number}: ${result.is_graded ? (result.is_correct ? 'Correct' : 'Incorrect') : 'Not graded'}</strong>
                        <p>${utils.escapeHtml(result.prompt || '')}</p>
                        <p>Your answer: ${utils.escapeHtml(result.response || 'No answer')}</p>
                        ${result.correct_answer ? `<p>Correct answer: ${utils.escapeHtml((Array.isArray(result.correct_answer) ? result.correct_answer : [result.correct_answer]).join(' / '))}</p>
                            <p>${utils.escapeHtml(result.explanation || '')}</p>
                            ${result.evidence ? `<button type="button" class="evidence-button" data-evidence="${utils.escapeHtml(result.evidence)}">Show evidence</button>` : ''}`
                            : '<p>Answer key not available for this question.</p>'}
                    </article>
                `).join('')}
            ` : '';
        },

        showEvidence(text) {
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
    };

    window.ENG.renderer = renderer;
})();