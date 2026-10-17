import { escapeHtml as h } from '../../shared/escape-html.js';
import {
    courseUnits,
    lessons,
    lessonById,
    matchesLesson,
    readProgress,
    references,
} from './grammar-course.js';

const userId = localStorage.getItem('userId') || 'guest';
const progressKey = `grammar-progress:${userId}`;
let progress = readProgress(localStorage, userId);
const filters = { query: '', level: 'all', status: 'all' };
const library = document.getElementById('grammarLibrary');
const reader = document.getElementById('grammarReader');
const notice = document.getElementById('grammarNotice');
let libraryScroll = 0;
const urlFor = (id) => `english-grammar.html?lesson=${encodeURIComponent(id)}`;
const completed = (id) => progress.completed.includes(id);
const saved = (id) => progress.saved.includes(id);

function persist() {
    try {
        localStorage.setItem(progressKey, JSON.stringify(progress));
        notice.textContent = '';
    } catch {
        notice.textContent =
            'Không lưu được tiến độ trên trình duyệt này. Bài học vẫn dùng được trong phiên hiện tại.';
    }
}
function renderProgress() {
    document.getElementById('grammarProgressCount').textContent =
        `${progress.completed.length} / ${lessons.length}`;
    document.getElementById('grammarProgress').value = progress.completed.length;
    document.getElementById('grammarProgress').max = lessons.length;
    document.getElementById('grammarLessonCount').textContent = `${lessons.length} lessons`;
    const resume =
        lessonById.get(progress.lastLesson) ||
        lessons.find((lesson) => !completed(lesson.id)) ||
        lessons[0];
    const link = document.getElementById('grammarContinue');
    link.href = urlFor(resume.id);
    link.dataset.lesson = resume.id;
    link.innerHTML = `${progress.lastLesson ? 'Continue learning' : 'Start learning'} <span aria-hidden="true">→</span>`;
}
function renderLibrary() {
    renderProgress();
    let count = 0;
    document.getElementById('grammarUnits').innerHTML = courseUnits
        .map((unit, index) => {
            const visible = unit.lessons.filter((lesson) =>
                matchesLesson({ ...lesson, unitTitle: unit.title }, filters, progress),
            );
            if (!visible.length) return '';
            count += visible.length;
            const done = unit.lessons.filter((lesson) => completed(lesson.id)).length;
            return `<section class="grammar-unit-card" aria-labelledby="unit-${h(unit.id)}"><header class="grammar-unit-heading"><span class="grammar-unit-number">${String(index + 1).padStart(2, '0')}</span><div><h2 id="unit-${h(unit.id)}">${h(unit.title)}</h2><p>${h(unit.subtitle)}</p></div><span class="grammar-unit-count" aria-label="${done} of ${unit.lessons.length} completed">${done}/${unit.lessons.length}</span></header><ol class="grammar-lesson-list">${visible.map((lesson) => `<li><a href="${urlFor(lesson.id)}" data-lesson="${h(lesson.id)}" class="grammar-lesson-row ${completed(lesson.id) ? 'is-completed' : ''}"><span class="grammar-lesson-state" aria-label="${completed(lesson.id) ? 'Completed' : 'Not completed'}">${completed(lesson.id) ? '✓' : ''}</span><span class="grammar-lesson-copy"><span>${h(lesson.title)}${saved(lesson.id) ? '<span class="grammar-saved-dot" aria-label="Saved"> ◆</span>' : ''}</span><small>${h(lesson.subtitle)}</small></span><span class="grammar-level">${h(lesson.level)}</span><span class="grammar-row-arrow" aria-hidden="true">↗</span></a></li>`).join('')}</ol></section>`;
        })
        .join('');
    document.getElementById('grammarResultsCount').textContent =
        `${count} / ${lessons.length} lessons`;
    document.getElementById('grammarEmpty').hidden = count !== 0;
    document
        .querySelectorAll('[data-status]')
        .forEach((button) =>
            button.setAttribute('aria-pressed', String(button.dataset.status === filters.status)),
        );
}
function lessonReferences(id) {
    const specialised = {
        'conditional-inversion': {
            title: 'British Council · Inversion and conditionals',
            url: 'https://learnenglish.britishcouncil.org/free-resources/grammar/c1/inversion-conditionals',
        },
        'participle-clauses': {
            title: 'Cambridge · Finite and non-finite clauses',
            url: 'https://dictionary.cambridge.org/grammar/british-grammar/clauses-finite-and-non-finite',
        },
        'ellipsis-substitution': {
            title: 'Cambridge · Ellipsis',
            url: 'https://dictionary.cambridge.org/grammar/british-grammar/ellipsis',
        },
    };
    return [...(specialised[id] ? [specialised[id]] : []), ...references];
}
function renderOutline(current) {
    return `<aside class="grammar-outline" aria-label="Course navigation"><a class="grammar-outline-back" href="english-grammar.html" data-course>← All topics</a><p class="grammar-eyebrow">Your learning path</p>${courseUnits.map((unit, index) => `<details ${unit.id === current.unitId ? 'open' : ''}><summary><span>${String(index + 1).padStart(2, '0')}</span>${h(unit.title)}</summary><ol>${unit.lessons.map((lesson) => `<li><a href="${urlFor(lesson.id)}" data-lesson="${h(lesson.id)}" ${lesson.id === current.id ? 'aria-current="page"' : ''} class="${completed(lesson.id) ? 'is-completed' : ''}"><span class="grammar-outline-state" aria-hidden="true">${completed(lesson.id) ? '✓' : '·'}</span>${h(lesson.title)}</a></li>`).join('')}</ol></details>`).join('')}</aside>`;
}
function readerControls(lesson) {
    const mark = document.getElementById('grammarComplete');
    if (mark) {
        mark.setAttribute('aria-pressed', String(completed(lesson.id)));
        mark.textContent = completed(lesson.id)
            ? '✓ Completed · Mark as unread'
            : 'Mark lesson completed';
    }
    const bookmark = document.getElementById('grammarSave');
    if (bookmark) {
        bookmark.setAttribute('aria-pressed', String(saved(lesson.id)));
        bookmark.textContent = saved(lesson.id) ? '◆ Saved' : '◇ Save lesson';
    }
    reader.querySelectorAll('.grammar-outline a[data-lesson]').forEach((link) => {
        const done = completed(link.dataset.lesson);
        link.classList.toggle('is-completed', done);
        link.querySelector('.grammar-outline-state').textContent = done ? '✓' : '·';
    });
}
function revealCurrentOutline() {
    if (reader.hidden) return;
    const outline = reader.querySelector('.grammar-outline');
    const current = outline?.querySelector('[aria-current="page"]');
    if (!current) return;
    const bounds = outline.getBoundingClientRect();
    const active = current.getBoundingClientRect();
    if (active.top < bounds.top + 40 || active.bottom > bounds.bottom - 20)
        outline.scrollTop += active.top - bounds.top - 70;
}
function renderLesson(lesson) {
    document.title = `${lesson.title} · Grammar | Daily Note`;
    const previous = lessons[lesson.index - 1];
    const next = lessons[lesson.index + 1];
    reader.innerHTML = `<div class="grammar-reader-layout">${renderOutline(lesson)}<article class="grammar-article" aria-labelledby="grammarLessonTitle"><header class="grammar-lesson-header"><div class="grammar-lesson-meta"><span class="grammar-eyebrow">${h(lesson.unitTitle)} · ${lesson.index + 1} / ${lessons.length}</span><span class="grammar-level">${h(lesson.level)}</span></div><h1 id="grammarLessonTitle" tabindex="-1">${h(lesson.title)}</h1><p class="grammar-lesson-subtitle">${h(lesson.subtitle)}</p><p class="grammar-lesson-summary">${h(lesson.summary)}</p><button id="grammarSave" class="grammar-secondary" type="button" aria-pressed="${saved(lesson.id)}">Save lesson</button></header>
        <nav class="grammar-section-nav" aria-label="Lesson sections"><a href="#grammarTheory">Theory</a><a href="#grammarExamples">Examples</a><a href="#grammarTrap">Common trap</a><a href="#grammarPractice">Quick check</a></nav>
        <section id="grammarTheory" class="grammar-lesson-section"><p class="grammar-eyebrow">Understand the pattern</p><h2>Lý thuyết & cách dùng</h2><div class="grammar-rules">${lesson.rules.map((rule, index) => `<section class="grammar-rule"><span class="grammar-rule-number">${String(index + 1).padStart(2, '0')}</span><div><h3>${h(rule.title)}</h3><p>${h(rule.explanation)}</p><div class="grammar-pattern" lang="en">${h(rule.pattern)}</div></div></section>`).join('')}</div></section>
        <section id="grammarExamples" class="grammar-lesson-section"><p class="grammar-eyebrow">In real life</p><h2>Ví dụ thực tế</h2><div class="grammar-example-grid">${lesson.examples.map((example) => `<figure class="grammar-example"><figcaption>${h(example.context)}</figcaption><blockquote lang="en">${h(example.english)}</blockquote><p>${h(example.vietnamese)}</p></figure>`).join('')}</div></section>
        <section id="grammarTrap" class="grammar-trap"><p class="grammar-eyebrow">Common trap</p><h2>Điểm dễ nhầm</h2><div class="grammar-correction"><span>Tránh trong ngữ cảnh này</span><p lang="en"><s>${h(lesson.mistake.incorrect)}</s></p><span>Cách diễn đạt phù hợp</span><p lang="en">${h(lesson.mistake.correct)}</p></div><p>${h(lesson.mistake.explanation)}</p></section>
        <section id="grammarPractice" class="grammar-lesson-section grammar-practice"><p class="grammar-eyebrow">Make it stick</p><h2>Kiểm tra nhanh</h2><form id="grammarQuiz"><fieldset><legend lang="en">${h(lesson.check.question)}</legend>${lesson.check.options.map((option, index) => `<label class="grammar-answer"><input type="radio" name="answer" value="${index}" required /><span class="grammar-answer-letter">${String.fromCharCode(65 + index)}</span><span lang="en">${h(option)}</span></label>`).join('')}</fieldset><div class="grammar-quiz-actions"><button type="submit" class="grammar-primary">Check answer</button><button type="reset" class="grammar-secondary">Try again</button></div><div id="grammarQuizFeedback" class="grammar-quiz-feedback" role="status" aria-live="polite" hidden></div></form></section>
        <details class="grammar-references"><summary>Đọc thêm từ nguồn tham khảo</summary><ul>${lessonReferences(
            lesson.id,
        )
            .map(
                (reference) =>
                    `<li><a href="${h(reference.url)}" target="_blank" rel="noopener noreferrer">${h(reference.title)} ↗</a></li>`,
            )
            .join('')}</ul></details>
        <div class="grammar-complete-row"><button id="grammarComplete" class="grammar-primary" type="button" aria-pressed="false">Mark lesson completed</button><span>Đánh dấu sau khi đã đọc và tự giải thích được ví dụ.</span></div>
        <nav class="grammar-lesson-pagination" aria-label="Previous and next lessons">${previous ? `<a href="${urlFor(previous.id)}" data-lesson="${h(previous.id)}"><small>← Previous lesson</small><span>${h(previous.title)}</span></a>` : '<span></span>'}${next ? `<a href="${urlFor(next.id)}" data-lesson="${h(next.id)}"><small>Next lesson →</small><span>${h(next.title)}</span></a>` : '<a href="english-grammar.html" data-course><small>Learning path</small><span>Back to all topics →</span></a>'}</nav></article></div>`;
    readerControls(lesson);
    document.getElementById('grammarSave').addEventListener('click', () => {
        progress.saved = saved(lesson.id)
            ? progress.saved.filter((id) => id !== lesson.id)
            : [...progress.saved, lesson.id];
        persist();
        renderLibrary();
        readerControls(lesson);
    });
    document.getElementById('grammarComplete').addEventListener('click', () => {
        progress.completed = completed(lesson.id)
            ? progress.completed.filter((id) => id !== lesson.id)
            : [...progress.completed, lesson.id];
        persist();
        renderLibrary();
        readerControls(lesson);
        if (!notice.textContent)
            notice.textContent = completed(lesson.id)
                ? 'Đã đánh dấu bài học hoàn thành.'
                : 'Đã bỏ đánh dấu hoàn thành.';
    });
    const quiz = document.getElementById('grammarQuiz');
    quiz.addEventListener('submit', (event) => {
        event.preventDefault();
        const selected = new FormData(quiz).get('answer');
        if (selected === null) return;
        const answer = Number(selected);
        const correct = answer === lesson.check.answer;
        quiz.querySelectorAll('.grammar-answer').forEach((label, index) => {
            label.classList.toggle('answer-correct', index === lesson.check.answer);
            label.classList.toggle('answer-incorrect', index === answer && !correct);
        });
        const feedback = document.getElementById('grammarQuizFeedback');
        feedback.hidden = false;
        feedback.innerHTML = `<strong>${correct ? 'Chính xác.' : `Chưa đúng. Đáp án: ${h(lesson.check.options[lesson.check.answer])}.`}</strong><p>${h(lesson.check.explanation)}</p>`;
    });
    quiz.addEventListener('reset', () => {
        document.getElementById('grammarQuizFeedback').hidden = true;
        quiz.querySelectorAll('.grammar-answer').forEach((label) =>
            label.classList.remove('answer-correct', 'answer-incorrect'),
        );
    });
    revealCurrentOutline();
}
function renderLocation({ focus = false } = {}) {
    const id = new URLSearchParams(location.search).get('lesson');
    library.hidden = !!id;
    reader.hidden = !id;
    if (!id) {
        document.title = 'English Grammar | Daily Note';
        renderLibrary();
        if (focus) document.getElementById('grammarHeading').focus({ preventScroll: true });
        return;
    }
    const lesson = lessonById.get(id);
    if (!lesson) {
        document.title = 'Lesson not found · Grammar | Daily Note';
        reader.innerHTML =
            '<div class="grammar-empty"><h1>Không tìm thấy bài học</h1><p>Liên kết này không còn hợp lệ. Hãy chọn một chủ điểm trong lộ trình.</p><a class="grammar-primary" href="english-grammar.html" data-course>Back to all topics</a></div>';
        return;
    }
    progress.lastLesson = id;
    persist();
    renderLesson(lesson);
    if (focus) document.getElementById('grammarLessonTitle').focus({ preventScroll: true });
}
document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-lesson], a[data-course]');
    if (
        !link ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
    )
        return;
    event.preventDefault();
    if (!library.hidden) libraryScroll = window.scrollY;
    history.pushState({}, '', link.href);
    renderLocation({ focus: true });
    window.scrollTo(0, link.hasAttribute('data-course') ? libraryScroll : 0);
});
document.getElementById('grammarSearch').addEventListener('input', (event) => {
    filters.query = event.target.value;
    renderLibrary();
});
document.getElementById('grammarLevel').addEventListener('change', (event) => {
    filters.level = event.target.value;
    renderLibrary();
});
document.querySelectorAll('[data-status]').forEach((button) =>
    button.addEventListener('click', () => {
        filters.status = button.dataset.status;
        renderLibrary();
    }),
);
document.getElementById('grammarResetFilters').addEventListener('click', () => {
    Object.assign(filters, { query: '', level: 'all', status: 'all' });
    document.getElementById('grammarSearch').value = '';
    document.getElementById('grammarLevel').value = 'all';
    renderLibrary();
    document.getElementById('grammarSearch').focus();
});
window.addEventListener('popstate', () => renderLocation({ focus: true }));
window.addEventListener('resize', revealCurrentOutline);
window.addEventListener('storage', (event) => {
    if (event.key !== progressKey && event.key !== null) return;
    progress = readProgress(localStorage, userId);
    renderLibrary();
    const current = lessonById.get(new URLSearchParams(location.search).get('lesson'));
    if (current) readerControls(current);
});
renderLibrary();
renderLocation();
