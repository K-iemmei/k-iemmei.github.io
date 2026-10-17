import { initWritingShell, request, h, excerpt, tagsHTML, dateLabel, message } from './common.js';
initWritingShell();
const blog = document.body.dataset.page === 'blog';
const grid = document.getElementById('writingGrid');
const search = document.getElementById('writingSearch');
const filter = document.getElementById('writingFilter');
const state = { page: 1, q: '', status: 'all' };
let generation = 0,
    timer;
async function load() {
    const current = ++generation;
    grid.setAttribute('aria-busy', 'true');
    message('');
    const query = new URLSearchParams({
        q: state.q,
        page: String(state.page),
        status: state.status,
    });
    try {
        const data = await request(`/api/${blog ? 'blog' : 'notes'}?${query}`);
        if (current !== generation) return;
        grid.innerHTML = data.items
            .map((item) => {
                const href = `${blog ? 'post' : 'note'}.html?id=${encodeURIComponent(item.id)}`;
                const posted = !!item.published_at;
                const badge = blog
                    ? 'Article'
                    : posted
                      ? item.published_version < item.version
                          ? 'Private changes'
                          : 'Posted'
                      : 'Private';
                return `<a class="writing-card" href="${href}"><div class="writing-card-top"><span class="writing-card-icon" aria-hidden="true">${blog ? '↗' : '✎'}</span><span class="writing-badge ${posted ? 'is-posted' : ''}">${badge}</span></div><h2>${h(item.title || 'Untitled note')}</h2><p>${h(excerpt(item.excerpt) || 'No content yet.')}</p><div class="writing-tags">${tagsHTML(item.tags)}</div><div class="writing-card-footer"><span>${blog ? h(item.author_name) : 'Only you'}</span><span>${dateLabel(blog ? item.published_at : item.updated_at)}${blog ? ` · ${item.reading_minutes} min read` : ''}</span></div></a>`;
            })
            .join('');
        document.getElementById('writingEmpty').hidden = data.items.length !== 0;
        document.getElementById('writingResultCount').textContent =
            `${data.items.length} ${blog ? 'posts' : 'notes'} · page ${state.page}`;
        document.getElementById('writingPrevious').disabled = state.page === 1;
        document.getElementById('writingNext').disabled = !data.has_more;
    } catch (error) {
        if (current === generation) {
            grid.replaceChildren();
            document.getElementById('writingEmpty').hidden = true;
            message('Unable to load ' + (blog ? 'Blog' : 'Notes') + ': ' + error.message, 'error');
        }
    } finally {
        if (current === generation) grid.removeAttribute('aria-busy');
    }
}
search.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        state.q = search.value.trim();
        state.page = 1;
        load();
    }, 250);
});
filter?.addEventListener('change', () => {
    state.status = filter.value;
    state.page = 1;
    load();
});
document.getElementById('writingPrevious').addEventListener('click', () => {
    state.page = Math.max(1, state.page - 1);
    load();
});
document.getElementById('writingNext').addEventListener('click', () => {
    state.page += 1;
    load();
});
document.getElementById('writingRefresh').addEventListener('click', load);
const initialQuery = new URLSearchParams(location.search).get('q');
if (initialQuery) {
    search.value = initialQuery;
    state.q = initialQuery;
}
await load();
