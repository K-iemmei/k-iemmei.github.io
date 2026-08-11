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

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function normalizeAnswer(value) {
    return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

function buildFallbackLesson() {
    const parts = [
        {
            id: 'fallback-part-1', part_order: 1, part_title: '第一部分', question_instruction: '阅读短文，选择正确的答案。',
            passage: '顾客朋友们，本店现推出“购书送好礼”活动，购书满 100 元即可获得日记本一个，满 200 元可获得字典一部。另外，部分图书还有打折活动，其中，小说 7.5 折，杂志 8 折，研究生入学考试用书等 6 折。欢迎选购！祝您购物愉快！',
            questions: [
                ['购书满 100 元能获得什么礼物？', ['词典', '日记本', '故事书', '汉语书'], 'B', 'multiple_choice'],
                ['根据这段话，可以知道：', ['小说半价', '放寒假了', '有些书打折', '书店生意很好'], 'C', 'multiple_choice'],
                ['购书满 ______ 元可以获得一本字典。', [], '200', 'fill_blank']
            ]
        },
        {
            id: 'fallback-part-2', part_order: 2, part_title: '第二部分', question_instruction: '阅读短文，选择正确的答案或填写答案。',
            passage: '小李每天早上六点半起床。他先喝一杯牛奶，然后骑自行车去公司。公司离他家不远，骑车只需要十五分钟。中午，他通常和同事一起在公司附近吃饭。',
            questions: [
                ['小李每天几点起床？', ['六点','六点半','七点','七点半'], 'B', 'multiple_choice'],
                ['小李怎么去公司？', ['坐公共汽车','走路','骑自行车','坐地铁'], 'C', 'multiple_choice'],
                ['公司离小李家远不远？', [], '不远', 'fill_blank'],
                ['小李中午和谁一起吃饭？', ['朋友','家人','同事','老师'], 'C', 'multiple_choice']
            ]
        },
        {
            id: 'fallback-part-3', part_order: 3, part_title: '第三部分', question_instruction: '阅读短文，选择最合适的答案。',
            passage: '周末，天气很好，王老师带学生们去公园。学生们有的在树下看书，有的在草地上踢球，还有的在湖边拍照片。大家玩得很开心，下午五点才一起回家。',
            questions: [
                ['王老师什么时候带学生去公园？', ['星期一','周末','晚上','放学后'], 'B', 'multiple_choice'],
                ['学生们没有做什么？', ['看书','踢球','拍照片','游泳'], 'D', 'multiple_choice'],
                ['大家玩得怎么样？', [], '很开心', 'fill_blank']
            ]
        }
    ];

    let questionNumber = 1;
    return {
        lesson: { id: null, lesson_date: new Date().toISOString().slice(0, 10), title: '每日中文阅读' },
        parts: parts.map((part) => ({
            ...part,
            questions: part.questions.map((question) => ({
                id: `fallback-chinese-${questionNumber}`,
                order_index: questionNumber++,
                question_text: question[0], options: question[1], answer: question[2], question_type: question[3]
            }))
        }))
    };
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

    host.innerHTML = parts.map((part) => {
        const questionsHtml = (part.questions || []).map((question, index) => {
            const number = Number(question.order_index || index + 1);
            const options = parseOptions(question.options);
            const answerControl = question.question_type === 'fill_blank'
                ? `<input type="text" class="answer-input" data-question-id="${escapeHtml(question.id || '')}" data-answer="${escapeHtml(question.answer || question.correct_answer || '')}" aria-label="第${number}题答案" />`
                : `<div class="chinese-radio-list">${options.map((option, optionIndex) => { const optionValue = String.fromCharCode(65 + optionIndex); return `<label class="chinese-radio-option"><input type="radio" class="answer-input" name="question-${escapeHtml(question.id || number)}" value="${optionValue}" data-question-id="${escapeHtml(question.id || '')}" data-answer="${escapeHtml(question.answer || question.correct_answer || '')}" aria-label="第${number}题选项 ${optionValue}" /><span><strong>${optionValue}.</strong> ${escapeHtml(option)}</span></label>`; }).join('')}</div>`;

            return `<div class="question-row"><span class="question-label">${number}.</span><span class="question-prompt">${escapeHtml(question.question_text)}</span><div class="answer-row">${answerControl}</div></div>`;
        }).join('');

        return `<article class="chinese-exercise-card"><header class="chinese-card-header"><div><span class="section-kicker">${escapeHtml(part.part_title)}</span><h2>${escapeHtml(part.question_instruction)}</h2></div></header><article class="chinese-passage">${String(part.passage || '').split(/\n\s*\n/).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</article><div class="chinese-question-list">${questionsHtml}</div></article>`;
    }).join('');

    const lastCard = host.querySelector('.chinese-exercise-card:last-child');
    if (lastCard) {
        lastCard.insertAdjacentHTML('beforeend', `<section class="chinese-submit-panel"><div class="submit-area"><button class="secondary-button" type="button" id="resetChineseAnswers">重新填写</button><button class="primary-button" type="button" id="submitChineseAnswers">提交答案</button></div><div class="english-submit-message" id="chineseSubmitMessage" aria-live="polite"></div></section>`);
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
    if (!lessonId || !userId || !window.supabase) return;

    try {
        const rows = await window.supabase.get('chinese_user_answers', {
            filters: { user_id: `eq.${userId}`, lesson_id: `eq.${lessonId}` }
        });
        const answerMap = new Map((Array.isArray(rows) ? rows : []).map((row) => [row.question_id, row.submitted_answer || '']));
        document.querySelectorAll('#chineseQuestions .answer-input').forEach((input) => {
            const value = answerMap.get(input.dataset.questionId);
            if (!value) return;
            if (input.type === 'radio') {
                input.checked = input.value === value;
                input.closest('.chinese-radio-option')?.classList.toggle('is-selected', input.checked);
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
    const inputs = Array.from(document.querySelectorAll('#chineseQuestions .answer-input:checked, #chineseQuestions input[type="text"].answer-input'));

    if (!window.currentChineseLessonId || !userId || !window.supabase) {
        showMessage('请先登录后再提交答案。', 'error');
        return;
    }

    const payload = inputs.map((input) => {
        const answer = input.value.trim();
        return {
            user_id: userId,
            lesson_id: window.currentChineseLessonId,
            question_id: input.dataset.questionId,
            submitted_answer: answer,
            is_correct: normalizeAnswer(answer) === normalizeAnswer(input.dataset.answer),
            submitted_at: new Date().toISOString()
        };
    });
    const correctCount = payload.filter((row) => row.is_correct).length;

    try {
        await window.supabase.delete('chinese_user_answers', { filters: { user_id: `eq.${userId}`, lesson_id: `eq.${window.currentChineseLessonId}` } });
        await window.supabase.create('chinese_user_answers', payload);
        await window.supabase.delete('chinese_daily_results', { filters: { user_id: `eq.${userId}`, lesson_id: `eq.${window.currentChineseLessonId}` } });
        await window.supabase.create('chinese_daily_results', {
            user_id: userId,
            lesson_id: window.currentChineseLessonId,
            activity_date: window.currentChineseLessonDate,
            correct_count: correctCount,
            total_count: payload.length,
            score_percent: Number(((correctCount / payload.length) * 100).toFixed(2)),
            submitted_at: new Date().toISOString()
        });
        showMessage(`提交成功！你的成绩是 ${correctCount}/${payload.length}。`, 'success');
    } catch (error) {
        console.error('提交中文答案失败:', error);
        showMessage('提交失败，请稍后再试。', 'error');
    }
}

async function loadChineseLesson() {
    try {
        const lessons = await window.supabase.get('chinese_lessons', {
            filters: { is_active: 'eq.true' },
            order: { column: 'lesson_date', direction: 'desc' }
        });
        const lesson = Array.isArray(lessons) && lessons[0];
        if (!lesson) throw new Error('没有找到中文练习');
        const [parts, questions] = await Promise.all([
            window.supabase.get('chinese_lesson_parts', {
                filters: { lesson_id: `eq.${lesson.id}` },
                order: { column: 'part_order', direction: 'asc' }
            }),
            window.supabase.get('chinese_questions', {
            filters: { lesson_id: `eq.${lesson.id}` },
            order: { column: 'order_index', direction: 'asc' }
            })
        ]);
        if (!Array.isArray(parts) || parts.length === 0 || !Array.isArray(questions) || questions.length === 0) throw new Error('没有找到中文题目');
        window.currentChineseLessonId = lesson.id;
        window.currentChineseLessonDate = lesson.lesson_date;
        document.getElementById('chineseLessonTitle').textContent = lesson.title;
        const questionsByPart = new Map();
        questions.forEach((question) => {
            if (!questionsByPart.has(question.part_id)) questionsByPart.set(question.part_id, []);
            questionsByPart.get(question.part_id).push(question);
        });
        renderQuestions(parts.map((part) => ({ ...part, questions: questionsByPart.get(part.id) || [] })));
        await loadExistingAnswers(lesson.id);
    } catch (error) {
        console.warn('无法加载中文练习:', error);
        const fallback = buildFallbackLesson();
        window.currentChineseLessonId = null;
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
