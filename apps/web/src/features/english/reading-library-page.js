import { libraryPagination } from './library-pagination.js';
import { listReadingTests } from './reading/reading-repository.js';
import { escapeHtml as h } from '../../shared/escape-html.js';
const grid = document.getElementById('testGrid');
const search = document.getElementById('searchInput');
const category = document.getElementById('categoryFilter');
const pagination = document.getElementById('libraryPagination');
const pageSize = 15;
let tests = [];
let currentPage = 1;
function render() {
    const query = search.value.trim().toLowerCase();
    const visible = tests.filter(
        (test) =>
            (category.value === 'all' || test.category === category.value) &&
            `${test.title} ${test.category} ${test.slug}`.toLowerCase().includes(query),
    );
    const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
    currentPage = Math.min(currentPage, pageCount);
    const start = (currentPage - 1) * pageSize;
    grid.innerHTML = visible
        .slice(start, start + pageSize)
        .map((test) => {
            // Imported Cambridge titles carry the book/test reference before the passage title.
            const parts = test.title.match(
                /^(Cambridge\s+\d+(?:\s+Academic)?\s*[-\u2013\u2014]\s*Test\s+\d+(?:\s*[-\u2013\u2014]\s*Passage\s+\d+)?)\s*:\s*(.+)$/i,
            );
            const reference = parts ? parts[1].replace(/\s*[-\u2013\u2014]\s*/g, ' \u00b7 ') : '';
            const title = parts ? parts[2] : test.title;
            return `<a class="test-card" href="english.html?test=${encodeURIComponent(test.slug)}" aria-label="Open ${h(test.title)}"><span class="test-meta">${h(test.category)}</span>${reference ? `<span class="test-reference">${h(reference)}</span>` : ''}<h2>${h(title)}</h2><span class="card-arrow" aria-hidden="true">&rarr;</span></a>`;
        })
        .join('');
    document.getElementById('testCountPill').textContent = `${visible.length} tests`;
    document.getElementById('emptyState').style.display = visible.length ? 'none' : 'block';
    pagination.hidden = visible.length <= pageSize;
    pagination.innerHTML = libraryPagination({
        page: currentPage,
        pageCount,
        start,
        pageSize,
        total: visible.length,
        label: 'tests',
    });
}
try {
    tests = await listReadingTests();
    category.innerHTML =
        '<option value="all">All categories</option>' +
        [...new Set(tests.map((test) => test.category))]
            .map((value) => `<option value="${h(value)}">${h(value)}</option>`)
            .join('');
    render();
} catch (error) {
    document.getElementById('testCountPill').textContent = 'Unable to load tests';
    document.getElementById('emptyState').textContent = error.message;
    document.getElementById('emptyState').style.display = 'block';
}
for (const [element, event] of [
    [search, 'input'],
    [category, 'change'],
])
    element.addEventListener(event, () => {
        currentPage = 1;
        render();
    });
pagination.addEventListener('click', (event) => {
    const button = event.target.closest('[data-page-number]');
    if (!button || button.disabled) return;
    currentPage = Number(button.dataset.pageNumber);
    render();
    pagination.querySelector('[aria-current="page"]')?.focus({ preventScroll: true });
    grid.scrollIntoView({ block: 'start', behavior: 'smooth' });
});
