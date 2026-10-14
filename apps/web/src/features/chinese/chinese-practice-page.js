import { buildFallbackLesson } from './sample-lesson.js';
import { escapeHtml } from '../../shared/escape-html.js';
import { lessons } from './chinese-repository.js';
let currentLessonId = null;
let currentLessonDate = null;

function normalizeAnswer(value) {
    return String(value || '')
        .trim()
        .replace(/\s+/g, ' ')
        .toLocaleLowerCase();
}

function parseOptions(value) {
    if (Array.isArray(value)) return value;
    try {
        const parsed = JSON.parse(value || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function renderQuestions(parts) {
    const host = document.getElementById('chineseQuestions');
    if (!host) return;

    host.innerHTML = parts
        .map((part) => {
            const questionsHtml = (part.questions || [])
                .map((question, index) => {
                    const number = Number(question.order_index || index + 1);
                    const options = parseOptions(question.options);
                    const answerControl =
                        question.question_type === 'fill_blank'
                            ? `<input type="text" class="answer-input" data-question-id="${escapeHtml(question.id || '')}" data-answer="${escapeHtml(question.answer || question.correct_answer || '')}" aria-label="第${number}题答案" />`
                            : `<div class="chinese-radio-list">${options
                                  .map((option, optionIndex) => {
                                      const optionValue = String.fromCharCode(65 + optionIndex);
                                      return `<label class="chinese-radio-option"><input type="radio" class="answer-input" name="question-${escapeHtml(question.id || number)}" value="${optionValue}" data-question-id="${escapeHtml(question.id || '')}" data-answer="${escapeHtml(question.answer || question.correct_answer || '')}" aria-label="第${number}题选项 ${optionValue}" /><span><strong>${optionValue}.</strong> ${escapeHtml(option)}</span></label>`;
                                  })
                                  .join('')}</div>`;

                    return `<div class="question-row"><span class="question-label">${number}.</span><span class="question-prompt">${escapeHtml(question.question_text)}</span><div class="answer-row">${answerControl}</div></div>`;
                })
                .join('');

            return `<article class="chinese-exercise-card"><header class="chinese-card-header"><div><span class="section-kicker">${escapeHtml(part.part_title)}</span><h2>${escapeHtml(part.question_instruction)}</h2></div></header><article class="chinese-passage">${String(
                part.passage || '',
            )
                .split(/\n\s*\n/)
                .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
                .join(
                    '',
                )}</article><div class="chinese-question-list">${questionsHtml}</div></article>`;
        })
        .join('');

    const lastCard = host.querySelector('.chinese-exercise-card:last-child');
    if (lastCard) {
        lastCard.insertAdjacentHTML(
            'beforeend',
            `<section class="chinese-submit-panel"><div class="submit-area"><button class="secondary-button" type="button" id="resetChineseAnswers">重新填写</button><button class="primary-button" type="button" id="submitChineseAnswers">提交答案</button></div><div class="english-submit-message" id="chineseSubmitMessage" aria-live="polite"></div></section>`,
        );
    }

    host.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            host.querySelectorAll(`input[name="${radio.name}"]`).forEach((sibling) => {
                sibling.closest('.chinese-radio-option')?.classList.remove('is-selected');
            });
            radio.closest('.chinese-radio-option')?.classList.add('is-selected');
        });
    });
}

async function loadExistingAnswers(lessonId) {
    const userId = localStorage.getItem('userId');
    if (!lessonId || !userId) return;

    try {
        const rows = await lessons.answers(userId, lessonId);
        const answerMap = new Map(
            (Array.isArray(rows) ? rows : []).map((row) => [
                row.question_id,
                row.submitted_answer || '',
            ]),
        );
        document.querySelectorAll('#chineseQuestions .answer-input').forEach((input) => {
            const value = answerMap.get(input.dataset.questionId);
            if (!value) return;
            if (input.type === 'radio') {
                input.checked = input.value === value;
                input
                    .closest('.chinese-radio-option')
                    ?.classList.toggle('is-selected', input.checked);
            } else {
                input.value = value;
            }
        });
    } catch (error) {
        console.warn('无法加载已保存的答案:', error);
    }
}

function showMessage(message, type = 'info') {
    const host = document.getElementById('chineseSubmitMessage');
    if (!host) return;
    host.className = `english-submit-message ${type}`;
    host.textContent = message;
}

async function submitChineseAnswers() {
    const userId = localStorage.getItem('userId');
    const inputs = Array.from(
        document.querySelectorAll(
            '#chineseQuestions .answer-input:checked, #chineseQuestions input[type="text"].answer-input',
        ),
    );

    if (!currentLessonId || !userId) {
        showMessage('请先登录后再提交答案。', 'error');
        return;
    }

    const payload = inputs.map((input) => {
        const answer = input.value.trim();
        return {
            user_id: userId,
            lesson_id: currentLessonId,
            question_id: input.dataset.questionId,
            submitted_answer: answer,
            is_correct: normalizeAnswer(answer) === normalizeAnswer(input.dataset.answer),
            submitted_at: new Date().toISOString(),
        };
    });
    const correctCount = payload.filter((row) => row.is_correct).length;

    try {
        await lessons.saveResult(userId, currentLessonId, currentLessonDate, payload);
        showMessage(`提交成功！你的成绩是 ${correctCount}/${payload.length}。`, 'success');
    } catch (error) {
        console.error('提交中文答案失败:', error);
        showMessage('提交失败，请稍后再试。', 'error');
    }
}

async function loadChineseLesson() {
    try {
        const lesson = await lessons.latest();
        if (!lesson) throw new Error('没有找到中文练习');
        const [parts, questions] = await Promise.all([
            lessons.parts(lesson.id),
            lessons.questions(lesson.id),
        ]);
        if (
            !Array.isArray(parts) ||
            parts.length === 0 ||
            !Array.isArray(questions) ||
            questions.length === 0
        )
            throw new Error('没有找到中文题目');
        currentLessonId = lesson.id;
        currentLessonDate = lesson.lesson_date;
        document.getElementById('chineseLessonTitle').textContent = lesson.title;
        const questionsByPart = new Map();
        questions.forEach((question) => {
            if (!questionsByPart.has(question.part_id)) questionsByPart.set(question.part_id, []);
            questionsByPart.get(question.part_id).push(question);
        });
        renderQuestions(
            parts.map((part) => ({ ...part, questions: questionsByPart.get(part.id) || [] })),
        );
        await loadExistingAnswers(lesson.id);
    } catch (error) {
        console.warn('无法加载中文练习:', error);
        const fallback = buildFallbackLesson();
        currentLessonId = null;
        document.getElementById('chineseLessonTitle').textContent = fallback.lesson.title;
        renderQuestions(fallback.parts);
        showMessage('当前显示练习样题，请先在数据库中创建中文练习。', 'info');
    }
}

document.addEventListener('click', (event) => {
    if (event.target.closest('#submitChineseAnswers')) {
        submitChineseAnswers();
    }

    if (event.target.closest('#resetChineseAnswers')) {
        document.querySelectorAll('#chineseQuestions .answer-input').forEach((input) => {
            if (input.type === 'radio') {
                input.checked = false;
                input.closest('.chinese-radio-option')?.classList.remove('is-selected');
            } else {
                input.value = '';
            }
        });
        showMessage('答案已清空，可以重新填写。', 'info');
    }
});

loadChineseLesson();
