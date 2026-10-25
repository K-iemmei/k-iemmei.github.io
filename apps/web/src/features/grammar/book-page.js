import { escapeHtml as h } from '../../shared/escape-html.js';
import { apiRequest } from '../../core/database-client.js';
import { book } from './content/book-curriculum.js';
import { bookLessons } from './content/book-lessons.js';
import { lessons as supplementary, normaliseSearch } from './grammar-course.js';
const $ = (id) => document.getElementById(id),
    userId = localStorage.getItem('userId');
const key = `grammar-book-v1:${userId}`;
let data = { progress: [], reviews: [] },
    ready = false,
    busy = false,
    revision = 0,
    current = null,
    mode = 'quick',
    draft = {};
try {
    draft = JSON.parse(localStorage.getItem(key) || '{}');
} catch {}
if (!draft || typeof draft !== 'object' || Array.isArray(draft)) draft = {};
const backup = () => {
    try {
        localStorage.setItem(key, JSON.stringify(draft));
    } catch {
        $('grammarNotice').textContent =
            'Không lưu được nháp trên thiết bị; hãy lưu lên tài khoản.';
    }
};
const progress = (id) => data.progress.find((p) => p.unit_id === id);
const due = (id) =>
    data.reviews.filter(
        (r) => r.unit_id === id && (Date.parse(r.due_at) <= Date.now() || r.streak === 0),
    );
const url = (id) => `english-grammar.html?lesson=${encodeURIComponent(id)}`;
const send = (path, method, body) => apiRequest(path, { method, body: JSON.stringify(body) });
const update = (entry) => {
    data.progress = data.progress.filter((p) => p.unit_id !== entry.unit_id).concat(entry);
};
const rounds = (p) => Number(p?.study_rounds || 0);
const today = () =>
    new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());
const dots = (p) =>
    `<span class="grammar-round-dots" role="img" aria-label="Đã học ${rounds(p)} trong 5 lượt">${Array.from({ length: 5 }, (_, i) => `<i class="${i < rounds(p) ? 'is-done' : ''}" aria-hidden="true"></i>`).join('')}</span>`;
const expanded = new Set();
try {
    JSON.parse(localStorage.getItem(`${key}:sections`) || '[0]').forEach((i) => expanded.add(i));
} catch {
    expanded.add(0);
}
function roundPanel() {
    if (!$('grammarRoundPanel') || !current) return;
    const p = progress(current.id),
        count = rounds(p),
        active = !!p?.study_session_id,
        doneToday = p?.last_studied_on >= today();
    $('grammarRoundPanel').innerHTML =
        `${dots(p)}<div><strong>${count === 5 ? 'Đã hoàn thành 5 lượt' : active ? `Đang học lượt ${count + 1}` : doneToday ? `Đã ghi nhận lượt ${count} hôm nay` : `Lượt học ${count + 1}`}</strong><p>${count === 5 ? 'Bạn vẫn có thể luyện tập và ôn lại.' : active ? `Đọc bài: ${p.round_read ? 'đã xác nhận' : 'chưa xác nhận'} · Kiểm tra: ${p.round_score}% / cần 80%` : doneToday ? 'Lượt tiếp theo mở vào ngày mai (giờ Việt Nam).' : 'Bắt đầu lượt, học phần kiến thức và đạt kiểm tra từ 80%. Mỗi ngày ghi nhận một lượt.'}</p></div>${!active && count < 5 && !doneToday ? '<button id="grammarStartRound" class="grammar-primary" type="button">Bắt đầu lượt ' + (count + 1) + '</button>' : ''}`;
    $('grammarStartRound')?.addEventListener('click', () =>
        mutate(async () => {
            const id = current.id;
            const result = await send(`/api/grammar/${id}/rounds`, 'POST', {});
            bookLessons[Number(id.slice(4))].questions.forEach((q) => delete draft[q.id]);
            backup();
            update(result.progress);
            if (current?.id === id) {
                quiz();
            }
        }),
    );
}
function controls() {
    const p = progress(current?.id);
    document
        .querySelectorAll(
            '#grammarReader button,#grammarReader input,#grammarReader textarea,#grammarReader select',
        )
        .forEach((e) => {
            e.disabled =
                !ready ||
                busy ||
                (e.id === 'grammarRead' && (!p?.study_session_id || p.round_read));
        });
}
async function mutate(callback) {
    if (!ready || busy) return;
    busy = true;
    revision++;
    controls();
    $('grammarNotice').textContent = '';
    try {
        await callback();
        library();
    } catch (e) {
        $('grammarNotice').textContent = e.message;
    } finally {
        busy = false;
        if ($('grammarRead')) $('grammarRead').checked = !!progress(current?.id)?.round_read;
        roundPanel();
        controls();
    }
}
function library() {
    const completed = data.progress.reduce((sum, p) => sum + rounds(p), 0);
    $('grammarProgressCount').textContent = `${completed} / 725 lượt`;
    $('grammarProgress').value = completed;
    const next =
        data.progress
            .filter((p) => rounds(p) < 5)
            .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]?.unit_id ||
        book.units.find((u) => u.status === 'ready' && rounds(progress(u.id)) < 5)?.id ||
        'giu-001';
    $('grammarContinue').href = url(next);
    $('grammarContinue').textContent = `Tiếp tục · Unit ${Number(next.slice(4))}`;
    $('grammarReviewCount').textContent = ready
        ? `${data.reviews.filter((r) => Date.parse(r.due_at) <= Date.now() || r.streak === 0).length} câu cần ôn`
        : 'Đang tải tiến độ…';
    const query = normaliseSearch($('grammarSearch').value.trim()),
        filter = $('grammarStatus').value,
        selectedSection = $('grammarSection').value;
    let count = 0;
    $('grammarUnits').innerHTML = [...new Set(book.units.map((u) => u.section))]
        .map((section, index) => {
            if (selectedSection && section !== selectedSection) return '';
            const units = book.units
                .filter((u) => u.section === section)
                .filter((u) => {
                    const p = progress(u.id);
                    return (
                        normaliseSearch(`${u.unitNumber} ${u.title} ${u.section}`).includes(
                            query,
                        ) &&
                        (filter === 'all' ||
                            (filter === 'ready' && u.status === 'ready') ||
                            (filter === 'reference' && u.status !== 'ready') ||
                            (filter === 'started' && p && rounds(p) < 5) ||
                            (filter === 'completed' && rounds(p) === 5) ||
                            (filter === 'review' && due(u.id).length))
                    );
                });
            count += units.length;
            if (!units.length) return '';
            return `<details class="grammar-unit-card" data-section="${index}" ${query || filter !== 'all' || selectedSection || expanded.has(index) ? 'open' : ''}><summary class="grammar-unit-heading"><span><strong>${h(section)}</strong><small>Unit ${units[0].unitNumber}–${units.at(-1).unitNumber}</small></span><span>${units.length} bài</span></summary><ol class="grammar-lesson-list">${units
                .map((u) => {
                    const p = progress(u.id),
                        label =
                            u.status !== 'ready'
                                ? 'Tham chiếu sách'
                                : rounds(p) === 5
                                  ? 'Hoàn thành'
                                  : due(u.id).length
                                    ? 'Cần ôn'
                                    : p
                                      ? 'Đang học'
                                      : 'Học & luyện tập';
                    return `<li><a class="grammar-lesson-row ${rounds(p) === 5 ? 'is-completed' : ''}" href="${url(u.id)}"><span class="grammar-unit-number">${u.unitNumber}</span><span class="grammar-lesson-copy"><span>${h(u.title)}</span><small>${label}${p?.best_score ? ` · ${p.best_score}%` : ''}</small></span>${dots(p)}</a></li>`;
                })
                .join('')}</ol></details>`;
        })
        .join('');
    document.querySelectorAll('[data-section]').forEach((el) =>
        el.querySelector('summary').addEventListener('click', () => {
            const i = Number(el.dataset.section);
            if (!el.open) expanded.add(i);
            else expanded.delete(i);
            try {
                localStorage.setItem(`${key}:sections`, JSON.stringify([...expanded]));
            } catch {}
        }),
    );
    $('grammarResultsCount').textContent = count ? `${count} unit` : 'Không có unit phù hợp.';
}
function mark(text, focus) {
    const i = text.indexOf(focus);
    return i < 0
        ? h(text)
        : h(text.slice(0, i)) + `<mark>${h(focus)}</mark>` + h(text.slice(i + focus.length));
}
function quiz() {
    const lesson = bookLessons[current.unitNumber],
        qs = lesson.questions.filter((q) =>
            mode === 'review'
                ? due(current.id).some((r) => r.question_id === q.id)
                : q.mode === mode,
        );
    $('grammarQuizArea').innerHTML = qs.length
        ? `<form id="grammarQuiz">${qs.map((q, i) => `<fieldset class="grammar-exercise"><legend>${i + 1}. ${h(q.prompt)}</legend><small>${h(q.type)}</small>${q.type === 'choice' ? q.options.map((option) => `<label class="grammar-answer"><input type="radio" name="${q.id}" value="${h(option)}" required ${draft[q.id] === option ? 'checked' : ''}/><span>${h(option)}</span></label>`).join('') : `<label><span class="grammar-sr-only">Câu trả lời ${i + 1}</span><input name="${q.id}" value="${h(draft[q.id] || '')}" maxlength="1000" autocomplete="off" required /></label>`}${mode !== 'assessment' ? `<details><summary>Gợi ý</summary><p>${h(q.hint)}</p></details>` : ''}<div data-feedback="${q.id}" class="grammar-quiz-feedback" hidden></div></fieldset>`).join('')}<div class="grammar-quiz-actions"><button class="grammar-primary" type="submit">${mode === 'assessment' ? 'Nộp kiểm tra' : 'Kiểm tra câu trả lời'}</button><button class="grammar-secondary" id="grammarRetry" type="button">Làm lại</button></div><p id="grammarQuizResult" role="status"></p></form>`
        : '<p>Chưa có câu cần ôn ở unit này. Lịch ôn: 1, 3, 7, 14 và 30 ngày.</p>';
    const form = $('grammarQuiz');
    if (!form) return;
    form.addEventListener('input', (e) => {
        if (e.target.name) {
            draft[e.target.name] = e.target.value;
            backup();
        }
    });
    $('grammarRetry').addEventListener('click', () => {
        qs.forEach((q) => delete draft[q.id]);
        backup();
        quiz();
        controls();
    });
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const answers = Object.fromEntries(new FormData(form)),
            id = current.id,
            submittedMode = mode;
        mutate(async () => {
            const result = await send(`/api/grammar/${id}/attempts`, 'POST', {
                answers,
                mode: submittedMode,
                request_id: crypto.randomUUID(),
                session_id: progress(id)?.study_session_id || undefined,
            });
            update(result.progress);
            for (const r of result.attempt.results) {
                data.reviews = data.reviews.filter((item) => item.question_id !== r.id);
                data.reviews.push({
                    unit_id: id,
                    question_id: r.id,
                    streak: r.correct ? 1 : 0,
                    due_at: new Date(Date.now() + 86400000).toISOString(),
                });
            }
            if (current?.id !== id || mode !== submittedMode) return;
            for (const r of result.attempt.results) {
                const el = document.querySelector(`[data-feedback="${r.id}"]`);
                if (!el) continue;
                el.hidden = false;
                el.innerHTML = `<strong>${r.correct ? 'Đúng.' : 'Chưa khớp đáp án bài luyện có kiểm soát.'}</strong><p>${h(r.explanation)}</p><p>Đáp án: ${r.accepted.map(h).join(' / ')}</p>${!r.correct ? `<p>Bạn nhập: ${h(r.answer)}</p>` : ''}`;
            }
            $('grammarQuizResult').textContent =
                `${result.attempt.score}/${result.attempt.total} đúng.${rounds(result.progress) === 5 ? ' Đã hoàn thành đủ 5 lượt.' : submittedMode === 'assessment' ? ' Hoàn thành khi đã đọc bài và đạt ít nhất 80%.' : ''}`;
            const refreshedAt = revision;
            roundPanel();
            apiRequest('/api/grammar')
                .then((latest) => {
                    if (revision !== refreshedAt) return;
                    data = latest;
                    library();
                })
                .catch(() => {});
        });
    });
    controls();
}
function locationView() {
    const requestedMode = new URLSearchParams(location.search).get('mode');
    if (['quick', 'deep', 'assessment', 'review'].includes(requestedMode)) mode = requestedMode;
    const id = new URLSearchParams(location.search).get('lesson');
    $('grammarLibrary').hidden = !!id;
    $('grammarReader').hidden = !id;
    if (!id) {
        current = null;
        library();
        return;
    }
    const legacy = supplementary.find((l) => l.id === id);
    if (legacy) {
        $('grammarReader').innerHTML =
            `<article class="grammar-article"><a href="english-grammar.html">← Lộ trình</a><h1>${h(legacy.title)}</h1><p>Bài bổ trợ · không thay thế một unit sách.</p>${legacy.rules.map((r) => `<section class="grammar-lesson-section"><h2>${h(r.title)}</h2><p>${h(r.explanation)}</p><p class="grammar-pattern">${h(r.pattern)}</p></section>`).join('')}${legacy.examples.map((e) => `<figure class="grammar-example"><blockquote>${h(e.english)}</blockquote><p>${h(e.vietnamese)}</p></figure>`).join('')}<p>${h(legacy.mistake.explanation)}</p></article>`;
        return;
    }
    current = book.units.find((u) => u.id === id);
    if (!current) {
        $('grammarReader').innerHTML =
            '<p>Không tìm thấy unit.</p><a href="english-grammar.html">Lộ trình</a>';
        return;
    }
    const u = current,
        l = bookLessons[u.unitNumber];
    document.title = `Unit ${u.unitNumber}: ${u.title} | Grammar`;
    const header = `<a href="english-grammar.html">← Lộ trình</a><h1 id="grammarLessonTitle">${u.unitNumber}. ${h(u.title)}</h1><p class="grammar-source-note">English Grammar in Use · Fifth Edition · Unit ${u.unitNumber} · trang sách ${u.sourceReference.printedPage}–${u.sourceReference.printedPage + 1} · trang PDF ${u.sourceReference.pdfPage}–${u.sourceReference.pdfPage + 1}</p>`;
    const nav = `<nav class="grammar-lesson-pagination">${u.unitNumber > 1 ? `<a href="${url(book.units[u.unitNumber - 2].id)}">← Unit ${u.unitNumber - 1}</a>` : '<span></span>'}${u.unitNumber < 145 ? `<a href="${url(book.units[u.unitNumber].id)}">Unit ${u.unitNumber + 1} →</a>` : ''}</nav>`;
    if (!l) {
        $('grammarReader').innerHTML =
            `<article class="grammar-article">${header}<p>Unit có trong lộ trình sách. Bài giảng và bài tập tương tác chưa được biên soạn; chưa thể đánh dấu hoàn thành trên ứng dụng.</p><p>Hãy đọc unit tương ứng trong bản EngInUse.pdf của bạn.</p>${supplementary
                .filter((s) =>
                    normaliseSearch(s.title)
                        .split(' ')
                        .some((w) => w.length > 5 && normaliseSearch(u.title).includes(w)),
                )
                .slice(0, 3)
                .map((s) => `<p><a href="${url(s.id)}">Bổ trợ: ${h(s.title)}</a></p>`)
                .join('')}${nav}</article>`;
        return;
    }
    $('grammarReader').innerHTML =
        `<article class="grammar-article">${header}<section id="grammarRoundPanel" class="grammar-round-panel" aria-live="polite"></section><p class="grammar-source-note">Bài giảng, ví dụ và bài luyện tự biên soạn bổ sung, không phải đáp án chép từ sách.</p><section class="grammar-lesson-section"><h2>Mục tiêu</h2><p>${h(l.objective)}</p>${u.prerequisites.length ? `<p>Nên biết trước: <a href="${url(u.prerequisites[0])}">Unit ${u.unitNumber - 1}</a></p>` : ''}<p>Khoảng 25 phút · Có thể học từng phần và quay lại sau.</p></section><section class="grammar-lesson-section"><h2>Hiểu & sử dụng</h2>${l.rules.map(([title, explanation, pattern]) => `<section class="grammar-rule"><div><h3>${h(title)}</h3><p>${h(explanation)}</p><p class="grammar-pattern">${h(pattern)}</p></div></section>`).join('')}</section><section class="grammar-lesson-section"><h2>Ví dụ thực tế</h2><div class="grammar-example-grid">${l.examples.map(([context, en, vi, focus, why, variation]) => `<figure class="grammar-example"><figcaption>${h(context)}</figcaption><blockquote lang="en">${mark(en, focus)}</blockquote><p>${h(vi)}</p><p>${h(why)}</p><small>Biến thể: ${h(variation)}</small></figure>`).join('')}</div></section><section class="grammar-trap"><h2>Điểm dễ nhầm</h2><p><s>${h(l.trap[0])}</s></p><p>${h(l.trap[1])}</p><p>${h(l.trap[2])}</p></section><label class="grammar-reading-check"><input id="grammarRead" type="checkbox" ${progress(u.id)?.round_read ? 'checked' : ''}/> Tôi đã đọc và tự giải thích được các ví dụ.</label><section class="grammar-lesson-section"><h2>Luyện tập</h2><label>Chế độ <select id="grammarMode"><option value="quick">Luyện nhanh · 8 câu</option><option value="deep">Luyện sâu · 6 câu</option><option value="assessment">Kiểm tra cuối unit · 5 câu</option><option value="review">Ôn câu sai / đến hạn</option></select></label><p class="grammar-source-note">Bài viết lại/sửa lỗi yêu cầu giữ nguyên ý và cấu trúc đã cho. Không dùng bài này để chấm mọi cách diễn đạt tự do.</p><div id="grammarQuizArea"></div></section><section class="grammar-lesson-section"><h2>Ứng dụng & hội thoại</h2><p>Viết trước, sau đó đối chiếu mẫu và tiêu chí. Phần này tự đánh giá, không chấm điểm tự động và không ảnh hưởng điểm kiểm tra.</p>${l.scenarios.map((s) => `<section class="grammar-scenario"><h3>${h(s.title)}</h3><p>${h(s.prompt)}</p><label for="${s.id}">Bài viết của bạn</label><textarea id="${s.id}" maxlength="5000" rows="5">${h(draft[s.id] ?? progress(u.id)?.drafts?.[s.id] ?? '')}</textarea><button class="grammar-secondary" data-save-writing="${s.id}">Lưu bản viết</button><span id="${s.id}-status" role="status"></span><details><summary>Phản hồi mẫu & tiêu chí</summary><p lang="en">${h(s.model)}</p><ul>${s.rubric.map((r) => `<li>${h(r)}</li>`).join('')}</ul><p>Có nhiều cách viết đúng khác; khác mẫu không đồng nghĩa với sai.</p></details></section>`).join('')}</section>${nav}</article>`;
    $('grammarRead').addEventListener('change', () => {
        const id = u.id;
        mutate(async () => {
            const result = await send(`/api/grammar/${id}`, 'PUT', {
                read: true,
                session_id: progress(id)?.study_session_id,
            });
            update(result.progress);
        });
    });
    $('grammarMode').value = mode;
    $('grammarMode').addEventListener('change', (e) => {
        mode = e.target.value;
        quiz();
    });
    for (const s of l.scenarios) {
        const input = $(s.id);
        input.addEventListener('input', () => {
            draft[s.id] = input.value;
            backup();
            $(s.id + '-status').textContent = 'Chưa lưu lên tài khoản';
        });
        document.querySelector(`[data-save-writing="${s.id}"]`).addEventListener('click', () => {
            const value = input.value;
            mutate(async () => {
                const result = await send(`/api/grammar/${u.id}`, 'PUT', {
                    drafts: { [s.id]: value },
                });
                update(result.progress);
                if ($(s.id + '-status')) $(s.id + '-status').textContent = 'Đã lưu lên tài khoản';
            });
        });
    }
    roundPanel();
    quiz();
    controls();
}
$('grammarSection').innerHTML =
    '<option value="">Tất cả các phần</option>' +
    [...new Set(book.units.map((u) => u.section))]
        .map((section) => `<option value="${h(section)}">${h(section)}</option>`)
        .join('');
$('grammarSection').addEventListener('change', library);
$('grammarSearch').addEventListener('input', library);
$('grammarStatus').addEventListener('change', library);
$('grammarAppendices').innerHTML = book.appendices
    .map((a) => `<li>${h(a.title)} · trang sách ${a.printedPage} · PDF ${a.pdfPage}</li>`)
    .join('');
$('grammarSupplementary').innerHTML = supplementary
    .map((l) => `<a class="grammar-supplement-link" href="${url(l.id)}">${h(l.title)}</a>`)
    .join('');
document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    const target = new URL(a.href);
    if (target.pathname !== location.pathname || target.origin !== location.origin) return;
    e.preventDefault();
    history.pushState({}, '', a.href);
    locationView();
    window.scrollTo(0, 0);
});
window.addEventListener('popstate', locationView);
library();
locationView();
try {
    data = await apiRequest('/api/grammar');
    ready = true;
    library();
    locationView();
} catch (e) {
    $('grammarNotice').textContent =
        `Không tải được tiến độ: ${e.message}. Chưa thể lưu hoặc nộp bài.`;
    controls();
}
