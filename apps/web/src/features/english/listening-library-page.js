import { apiRequest } from '../../core/database-client.js';
import { escapeHtml as h } from '../../shared/escape-html.js';

const grid = document.getElementById('listeningGrid');
const search = document.getElementById('listeningSearch');
const pages = document.getElementById('listeningPages');
const count = document.getElementById('listeningCount');
let sessions = [];
let page = 1;
const pageSize = 16;
function render() {
    const query = search.value.trim().toLowerCase();
    const visible = sessions.filter((session) =>
        `${session.title} cambridge ${session.book_number} test ${session.test_number} part ${session.part_number}`
            .toLowerCase()
            .includes(query),
    );
    count.textContent = `${visible.length} parts`;
    const maxPage = Math.max(1, Math.ceil(visible.length / pageSize));
    page = Math.min(page, maxPage);
    grid.innerHTML = visible.length
        ? visible
              .slice((page - 1) * pageSize, page * pageSize)
              .map(
                  (session) =>
                      `<a class="listening-card" href="english-listening.html?session=${encodeURIComponent(session.slug)}"><span class="listening-card-kicker">CAMBRIDGE ${session.book_number} · TEST ${session.test_number}</span><h2>Part ${session.part_number}</h2><span class="listening-card-detail">${session.first_question}–${session.last_question} · IELTS questions & dictation</span><span class="listening-card-arrow" aria-hidden="true">↗</span>${session.status === 'draft' ? '<span class="listening-card-status">OCR draft</span>' : ''}</a>`,
              )
              .join('')
        : '<p class="listening-empty">No listening parts found.</p>';
    pages.innerHTML =
        maxPage > 1
            ? `<button type="button" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>Previous</button><span>Page ${page} of ${maxPage}</span><button type="button" data-page="${page + 1}" ${page === maxPage ? 'disabled' : ''}>Next</button>`
            : '';
}
try {
    sessions = await apiRequest('/api/listening');
    render();
} catch (error) {
    count.textContent = 'Unable to load';
    grid.innerHTML = `<p class="listening-empty">${h(error.message)}</p>`;
}
search.addEventListener('input', () => {
    page = 1;
    render();
});
pages.addEventListener('click', (event) => {
    const button = event.target.closest('[data-page]');
    if (!button || button.disabled) return;
    page = Number(button.dataset.page);
    render();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
