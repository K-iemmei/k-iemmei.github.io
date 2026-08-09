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

function buildFallbackLesson() {
    return {
        lesson: {
            type: 'reading',
            title: 'AI and the future of work',
            subtitle: 'IELTS Reading · Day 01',
            duration_minutes: 30,
            skill_focus: 'Reading for main idea and detail',
            passage: 'Artificial intelligence is increasingly shaping the workplace, but its effect on employment is still a matter of debate. Some analysts argue that AI will replace many routine tasks, particularly in administration, data processing and basic customer service. These roles often involve repetitive work that can be automated with software. As a result, workers in these fields may need to retrain or focus on more complex responsibilities that require judgment, empathy and creativity. However, the impact of AI is not simply negative. In many industries, it can improve productivity by handling large amounts of information quickly and accurately. For example, doctors may use AI tools to review scans, while teachers can use language programs to personalize learning. In these situations, technology acts as a support system rather than a total replacement for human professionals. The real challenge is therefore not whether AI will change the labor market, but how societies adapt to that change. Governments, companies and education providers need to invest in training programs that help workers develop new skills. The most successful employees are likely to be those who can combine technical knowledge with strong communication and problem-solving abilities.',
            summary: 'Focus on main idea and inference.'
        },
        sections: [
            {
                id: 'section-1',
                lesson_id: null,
                section_order: 1,
                section_title: 'Part 1',
                section_instruction: 'Identify the main cause of workplace change.'
            },
            {
                id: 'section-2',
                lesson_id: null,
                section_order: 2,
                section_title: 'Part 2',
                section_instruction: 'Explain how automation affects different job functions.'
            },
            {
                id: 'section-3',
                lesson_id: null,
                section_order: 3,
                section_title: 'Part 3',
                section_instruction: 'Summarize the future skills and adaptation required.'
            }
        ],
        exercises: [
            {
                id: 'fallback-question-1',
                lesson_id: null,
                section_id: 'section-1',
                order_index: 1,
                question_text: 'According to the passage, what is the main challenge created by AI in the workplace?',
                question_type: 'short_answer',
                options: '[]',
                answer_hint: 'Look for the sentence that discusses the real challenge in the final paragraph.',
                points: 1,
                correct_answer: 'How society adapts to the changes brought by AI'
            },
            {
                id: 'fallback-question-2',
                lesson_id: null,
                section_id: 'section-1',
                order_index: 2,
                question_text: 'What roles are mentioned as being affected by automation?',
                question_type: 'short_answer',
                options: '[]',
                answer_hint: 'Look for routine work that can be automated.',
                points: 1,
                correct_answer: 'Administration, data processing and basic customer service'
            },
            {
                id: 'fallback-question-3',
                lesson_id: null,
                section_id: 'section-1',
                order_index: 3,
                question_text: 'What does the passage say workers may need to do?',
                question_type: 'short_answer',
                options: '[]',
                answer_hint: 'The passage talks about retraining and new responsibilities.',
                points: 1,
                correct_answer: 'Retrain and focus on more complex responsibilities'
            },
            {
                id: 'fallback-question-4',
                lesson_id: null,
                section_id: 'section-1',
                order_index: 4,
                question_text: 'Which professional roles are used as examples of AI support?',
                question_type: 'short_answer',
                options: '[]',
                answer_hint: 'The passage mentions doctors and teachers.',
                points: 1,
                correct_answer: 'Doctors and teachers'
            },
            {
                id: 'fallback-question-5',
                lesson_id: null,
                section_id: 'section-1',
                order_index: 5,
                question_text: 'What skill combination is described as useful for future employees?',
                question_type: 'short_answer',
                options: '[]',
                answer_hint: 'The final paragraph mentions two capabilities.',
                points: 1,
                correct_answer: 'Technical knowledge and communication/problem-solving abilities'
            },
            {
                id: 'fallback-question-6',
                lesson_id: null,
                section_id: 'section-2',
                order_index: 6,
                question_text: 'What is the main idea of paragraph 1?',
                question_type: 'short_answer',
                options: '[]',
                answer_hint: 'Read the first paragraph carefully.',
                points: 1,
                correct_answer: 'AI is changing workplace tasks and challenging employment'
            },
            {
                id: 'fallback-question-7',
                lesson_id: null,
                section_id: 'section-2',
                order_index: 7,
                question_text: 'What kind of work is said to be suitable for automation?',
                question_type: 'short_answer',
                options: '[]',
                answer_hint: 'The passage gives examples of repetitive work.',
                points: 1,
                correct_answer: 'Routine administrative and customer service tasks'
            },
            {
                id: 'fallback-question-8',
                lesson_id: null,
                section_id: 'section-2',
                order_index: 8,
                question_text: 'What can AI do in many industries according to the passage?',
                question_type: 'short_answer',
                options: '[]',
                answer_hint: 'Look at the sentence about productivity.',
                points: 1,
                correct_answer: 'Improve productivity and process information quickly and accurately'
            },
            {
                id: 'fallback-question-9',
                lesson_id: null,
                section_id: 'section-2',
                order_index: 9,
                question_text: 'How does the author describe AI in relation to human professionals?',
                question_type: 'short_answer',
                options: '[]',
                answer_hint: 'Look toward the second paragraph.',
                points: 1,
                correct_answer: 'A support system rather than a total replacement'
            },
            {
                id: 'fallback-question-10',
                lesson_id: null,
                section_id: 'section-2',
                order_index: 10,
                question_text: 'Which institutions are expected to support adaptation to change?',
                question_type: 'short_answer',
                options: '[]',
                answer_hint: 'The final paragraph includes the actors.',
                points: 1,
                correct_answer: 'Governments, companies and education providers'
            },
            {
                id: 'fallback-question-11',
                lesson_id: null,
                section_id: 'section-3',
                order_index: 11,
                question_text: 'What kind of training do workers need according to the passage?',
                question_type: 'short_answer',
                options: '[]',
                answer_hint: 'The final paragraph refers to subjects that help workers develop new skills.',
                points: 1,
                correct_answer: 'Training programs for new skills'
            },
            {
                id: 'fallback-question-12',
                lesson_id: null,
                section_id: 'section-3',
                order_index: 12,
                question_text: 'Which of the human abilities are mentioned as still necessary?',
                question_type: 'short_answer',
                options: '[]',
                answer_hint: 'The passage refers to judgment, empathy and creativity.',
                points: 1,
                correct_answer: 'Judgment, empathy and creativity'
            },
            {
                id: 'fallback-question-13',
                lesson_id: null,
                section_id: 'section-3',
                order_index: 13,
                question_text: 'What is the final position of the author about AI?',
                question_type: 'short_answer',
                options: '[]',
                answer_hint: 'The last paragraph emphasizes adaptation rather than denial of change.',
                points: 1,
                correct_answer: 'AI will change the labor market, so society must adapt'
            },
            {
                id: 'fallback-question-14',
                lesson_id: null,
                section_id: 'section-3',
                order_index: 14,
                question_text: 'What phrase best summarizes the passage?',
                question_type: 'short_answer',
                options: '[]',
                answer_hint: 'Think about the overall message of the reading.',
                points: 1,
                correct_answer: 'AI brings change to work, but adaptation and human skills matter'
            }
        ]
    };
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getPassageParagraphs(passage) {
    if (!passage) return ['<p>No passage available.</p>'];

    const clean = String(passage).trim();
    const paragraphs = clean.split(/\n\s*\n/);

    return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`);
}

function normalizeOptions(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    return [];
}

function renderQuestions(sections = [], exercises = []) {
    const questionsHost = document.getElementById('englishQuestions');
    const exerciseTotal = document.getElementById('exerciseTotal');

    if (!questionsHost) {
        return;
    }

    const safeSections = Array.isArray(sections) ? sections : [];
    const safeExercises = Array.isArray(exercises) ? exercises : [];

    if (safeSections.length === 0 && safeExercises.length === 0) {
        questionsHost.innerHTML = '<div class="empty-state">No exercises available.</div>';
        if (exerciseTotal) exerciseTotal.textContent = '';
        return;
    }

    const orderedSections = [...safeSections].sort((a, b) => Number(a.section_order || 0) - Number(b.section_order || 0));

    const groupedExercises = new Map();
    safeExercises.forEach((exercise) => {
        const sectionId = exercise.section_id || exercise.lesson_id;
        if (!groupedExercises.has(sectionId)) {
            groupedExercises.set(sectionId, []);
        }
        groupedExercises.get(sectionId).push(exercise);
    });

    const sectionBlocks = orderedSections.map((section) => {
        const sectionQuestions = groupedExercises.get(section.id) || [];
        const sectionQuestionsHtml = sectionQuestions
            .sort((a, b) => Number(a.order_index || 0) - Number(b.order_index || 0))
            .map((exercise, localIndex) => {
                const questionNumber = Number(exercise.order_index || localIndex + 1);
                const questionText = exercise.question_text || exercise.question || '';

                return `<div class="question-row">
                    <span class="question-label">${questionNumber}.</span>
                    <span class="question-prompt">${escapeHtml(questionText)}</span>
                    <div class="answer-row">
                        <input type="text" class="answer-input" data-question-id="${escapeHtml(exercise.id || '')}" aria-label="Answer for question ${questionNumber}" />
                    </div>
                </div>`;
            })
            .join('');

        if (!sectionQuestionsHtml) {
            return '';
        }

        return `<section class="section-block">
            <div class="section-block-header">
                <div class="section-title-wrap">
                    <span class="section-kicker">${escapeHtml(section.section_title || 'Exercise Section')}</span>
                    <div class="section-instruction">${escapeHtml(section.section_instruction || '')}</div>
                </div>
            </div>
            <div class="question-list">${sectionQuestionsHtml}</div>
        </section>`;
    }).join('');

    questionsHost.innerHTML = sectionBlocks;

    if (exerciseTotal) {
        exerciseTotal.textContent = '';
    }
}

async function loadExistingUserAnswers(lessonId) {
    const userId = localStorage.getItem('userId');
    const answerInputs = Array.from(document.querySelectorAll('#englishQuestions .answer-input'));

    if (!lessonId || !userId || !answerInputs.length || !window.supabase || typeof window.supabase.get !== 'function') {
        return;
    }

    try {
        const rows = await window.supabase.get('english_user_answers', {
            select: '*',
            filters: {
                user_id: `eq.${userId}`,
                lesson_id: `eq.${lessonId}`
            }
        });

        const storedAnswers = Array.isArray(rows) ? rows : [];
        const answerMap = new Map(
            storedAnswers
                .filter((row) => row && row.question_id)
                .map((row) => [row.question_id, row.submitted_answer || ''])
        );

        answerInputs.forEach((input) => {
            const questionId = input.getAttribute('data-question-id');
            if (questionId && answerMap.has(questionId)) {
                input.value = answerMap.get(questionId) || '';
            }
        });
    } catch (error) {
        console.warn('Unable to load existing English answers for this user:', error);
    }
}

function showEnglishSubmitMessage(message, type = 'info') {
    const host = document.getElementById('englishSubmitMessage');
    if (!host) {
        return;
    }

    host.className = `english-submit-message ${type}`;
    host.textContent = message;
}

async function submitEnglishAnswers() {
    const answerInputs = Array.from(document.querySelectorAll('#englishQuestions .answer-input'));
    const userId = localStorage.getItem('userId');

    if (window.englishFallbackMode) {
        showEnglishSubmitMessage('The live lesson is not available now, so sample answers cannot be saved to the database.', 'error');
        return;
    }

    if (!window.currentEnglishLessonId || !userId || !window.supabase || typeof window.supabase.upsert !== 'function') {
        console.warn('Cannot submit English answers without an active lesson or authenticated user.');
        showEnglishSubmitMessage('Please log in before submitting your answers.', 'error');
        return;
    }

    const payload = answerInputs
        .map((input) => {
            const questionId = input.getAttribute('data-question-id');
            const value = input.value.trim();

            if (!questionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(questionId)) {
                return null;
            }

            return {
                user_id: userId,
                lesson_id: window.currentEnglishLessonId,
                question_id: questionId,
                submitted_answer: value,
                submitted_at: new Date().toISOString()
            };
        })
        .filter(Boolean);

    if (payload.length === 0) {
        showEnglishSubmitMessage('No answer fields are available to submit yet.', 'info');
        return;
    }

    try {
        const existingDelete = await window.supabase.delete('english_user_answers', {
            filters: {
                user_id: `eq.${userId}`,
                lesson_id: `eq.${window.currentEnglishLessonId}`
            }
        });

        const result = await window.supabase.create('english_user_answers', payload);

        console.log('English submission payload:', payload);
        console.log('Delete old answers result:', existingDelete);
        console.log('Create result:', result);

        if (Array.isArray(result) && result.length > 0) {
            showEnglishSubmitMessage('Your answers have been submitted successfully.', 'success');
        } else {
            showEnglishSubmitMessage('Your answers were accepted by the server.', 'success');
        }
    } catch (error) {
        console.error('Unable to submit English answers:', error);
        showEnglishSubmitMessage('Unable to submit answers. Please try again.', 'error');
    }
}

async function loadEnglishLesson() {
    const titleHost = document.getElementById('englishTitle');
    const eyebrowHost = document.getElementById('englishEyebrow');
    const passageHost = document.getElementById('englishPassage');
    const readingTitleHost = document.getElementById('readingTitle');

    if (!passageHost || !eyebrowHost) {
        return;
    }

    const fallback = buildFallbackLesson();

    try {
        if (!window.supabase || typeof window.supabase.get !== 'function') {
            throw new Error('Supabase client is not available');
        }

        const lessons = await window.supabase.get('english_lessons', {
            select: '*',
            filters: {
                is_active: 'eq.true'
            },
            order: {
                column: 'lesson_date',
                direction: 'desc'
            }
        });

        const lesson = Array.isArray(lessons) && lessons.length > 0 ? lessons[0] : null;

        if (!lesson) {
            throw new Error('No English lesson found');
        }

        const [sections, exercises] = await Promise.all([
            window.supabase.get('english_lesson_sections', {
                select: '*',
                filters: {
                    lesson_id: `eq.${lesson.id}`
                },
                order: {
                    column: 'section_order',
                    direction: 'asc'
                }
            }),
            window.supabase.get('english_questions', {
                select: '*',
                filters: {
                    lesson_id: `eq.${lesson.id}`
                },
                order: {
                    column: 'order_index',
                    direction: 'asc'
                }
            })
        ]);

        if (titleHost) {
            titleHost.textContent = lesson.title || 'English lesson';
        }
        if (readingTitleHost) {
            readingTitleHost.textContent = lesson.title || 'English lesson';
        }
        eyebrowHost.textContent = 'Reading Exercise';
        passageHost.innerHTML = getPassageParagraphs(lesson.passage || '').join('');
        renderQuestions(Array.isArray(sections) ? sections : [], Array.isArray(exercises) ? exercises : []);

        window.currentEnglishLessonId = lesson.id;
        await loadExistingUserAnswers(lesson.id);

    } catch (error) {
        console.warn('Unable to load English lesson from Supabase:', error);
        const lesson = fallback.lesson;
        if (titleHost) {
            titleHost.textContent = lesson.title;
        }
        if (readingTitleHost) {
            readingTitleHost.textContent = lesson.title;
        }
        eyebrowHost.textContent = 'Reading Exercise';
        passageHost.innerHTML = getPassageParagraphs(lesson.passage || '').join('');
        renderQuestions(fallback.sections, fallback.exercises);
        window.currentEnglishLessonId = null;
        window.englishFallbackMode = true;

        const submitButton = document.getElementById('submitEnglishAnswers');
        if (submitButton) {
            submitButton.disabled = true;
        }

        showEnglishSubmitMessage('Reading sample is showing from fallback data because the live lesson is not available right now.', 'info');
    }
}

const submitButton = document.getElementById('submitEnglishAnswers');
if (submitButton) {
    submitButton.addEventListener('click', submitEnglishAnswers);
}

const resetButton = document.getElementById('resetEnglishAnswers');
if (resetButton) {
    resetButton.addEventListener('click', () => {
        const answerInputs = document.querySelectorAll('#englishQuestions .answer-input');
        answerInputs.forEach((input) => {
            input.value = '';
        });
        showEnglishSubmitMessage('Answers cleared. You can start again.', 'info');
    });
}

loadEnglishLesson();
