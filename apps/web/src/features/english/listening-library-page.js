import { apiRequest } from '../../core/database-client.js';
import { escapeHtml as h } from '../../shared/escape-html.js';
import { libraryPagination } from './library-pagination.js';

const grid = document.getElementById('listeningGrid');
const search = document.getElementById('listeningSearch');
const book = document.getElementById('listeningBookFilter');
const pages = document.getElementById('listeningPages');
const count = document.getElementById('listeningCount');
const empty = document.getElementById('listeningEmpty');
let sessions = [];
let page = 1;
const pageSize = 15;

function render() {
    const query = search.value.trim().toLowerCase();
    const visible = sessions.filter(
        (session) =>
            (book.value === 'all' || String(session.book_number) === book.value) &&
            `${session.title} cambridge ${session.book_number} test ${session.test_number} part ${session.part_number}`
                .toLowerCase()
                .includes(query),
    );
    count.textContent = `${visible.length} parts`;
    const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
    page = Math.min(page, pageCount);
    const start = (page - 1) * pageSize;
    grid.innerHTML = visible
        .slice(start, start + pageSize)
        .map(
            (session) =>
                `<a class="test-card" href="english-listening.html?session=${encodeURIComponent(session.slug)}" aria-label="Open ${h(session.title)}"><span class="test-meta">IELTS Listening</span><span class="test-reference">Cambridge ${h(session.book_number)} &middot; Test ${h(session.test_number)}</span><h2>Part ${h(session.part_number)}</h2><span class="test-detail">Questions ${h(session.first_question)}&ndash;${h(session.last_question)} &middot; IELTS questions &amp; dictation</span><span class="card-arrow" aria-hidden="true">&rarr;</span>${session.status === 'draft' ? '<span class="test-status">OCR draft</span>' : ''}</a>`,
        )
        .join('');
    empty.style.display = visible.length ? 'none' : 'block';
    pages.hidden = visible.length <= pageSize;
    pages.innerHTML = libraryPagination({
        page,
        pageCount,
        start,
        pageSize,
        total: visible.length,
        label: 'parts',
    });
}
try {
    sessions = await apiRequest('/api/listening');
    book.innerHTML =
        '<option value="all">All books</option>' +
        [...new Set(sessions.map((session) => session.book_number))]
            .sort((a, b) => a - b)
            .map((value) => `<option value="${h(value)}">Cambridge ${h(value)}</option>`)
            .join('');
    render();
} catch (error) {
    count.textContent = 'Unable to load parts';
    empty.textContent = error.message;
    empty.style.display = 'block';
}
for (const [element, event] of [
    [search, 'input'],
    [book, 'change'],
]) {
    element.addEventListener(event, () => {
        page = 1;
        render();
    });
}
pages.addEventListener('click', (event) => {
    const button = event.target.closest('[data-page-number]');
    if (!button || button.disabled) return;
    page = Number(button.dataset.pageNumber);
    render();
    pages.querySelector('[aria-current="page"]')?.focus({ preventScroll: true });
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
