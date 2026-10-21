import { initWritingShell, request, h, dateLabel, message, userId } from './common.js';
initWritingShell();
const tree = document.getElementById('notesTree');
const search = document.getElementById('writingSearch');
const dialog = document.getElementById('noteMoveDialog');
const parentSelect = document.getElementById('noteParent');
const key = `notes-expanded:${userId}`;
let expanded = new Set();
try {
    expanded = new Set(JSON.parse(localStorage.getItem(key) || '[]'));
} catch {}
let items = [],
    moving = null,
    busy = false;
function remember() {
    try {
        localStorage.setItem(key, JSON.stringify([...expanded]));
    } catch {}
}
function render() {
    const byId = new Map(items.map((item) => [item.id, item]));
    const children = new Map();
    for (const item of items) {
        const parent = byId.has(item.parent_id) ? item.parent_id : null;
        if (!children.has(parent)) children.set(parent, []);
        children.get(parent).push(item);
    }
    const q = search.value.trim().toLocaleLowerCase();
    const visible = new Set();
    if (q)
        for (const item of items) {
            if (![item.title, ...(item.tags || [])].join(' ').toLocaleLowerCase().includes(q))
                continue;
            let current = item;
            while (current && !visible.has(current.id)) {
                visible.add(current.id);
                current = byId.get(current.parent_id);
            }
        }
    const visited = new Set();
    function branch(parent) {
        return (children.get(parent) || [])
            .filter((item) => !q || visible.has(item.id))
            .map((item) => {
                if (visited.has(item.id)) return '';
                visited.add(item.id);
                const hasChildren = !!children.get(item.id)?.length;
                const open = !!q || expanded.has(item.id);
                return `<li class="note-branch"><div class="note-tree-row" data-id="${h(item.id)}">
                ${hasChildren ? `<button class="note-toggle" data-action="toggle" aria-expanded="${open}" aria-label="${open ? 'Collapse' : 'Expand'} ${h(item.title || 'Untitled note')}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6" /></svg></button>` : '<span class="note-toggle-space" aria-hidden="true"></span>'}
                <a class="note-tree-link" href="note.html?id=${encodeURIComponent(item.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h4" /></svg><span>${h(item.title || 'Untitled note')}</span></a>
                <time datetime="${h(item.updated_at)}">${dateLabel(item.updated_at)}</time>
                <button class="note-row-action" data-action="add" aria-label="Add child note to ${h(item.title || 'Untitled note')}" title="Add child note">+</button>
                <button class="note-row-action" data-action="move" aria-label="Move ${h(item.title || 'Untitled note')}" title="Move note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h6l2 2h8v11H4zM14 4h7m-3-3 3 3-3 3" /></svg></button>
                </div>${hasChildren ? `<ul ${open ? '' : 'hidden'}>${branch(item.id)}</ul>` : ''}</li>`;
            })
            .join('');
    }
    tree.innerHTML = `<ul>${branch(null)}</ul>`;
    document.getElementById('writingEmpty').hidden = items.length > 0 && (!q || visible.size > 0);
}
async function load() {
    tree.setAttribute('aria-busy', 'true');
    try {
        items = (await request('/api/notes/tree')).items;
        message('');
        render();
    } catch (error) {
        message(error.message, 'error');
    } finally {
        tree.removeAttribute('aria-busy');
    }
}
async function create(parent = null) {
    if (busy) return;
    busy = true;
    document.getElementById('noteCreate').disabled = true;
    try {
        const note = await request('/api/notes/tree', {
            method: 'POST',
            body: JSON.stringify({ title: '', body: '', tags: [], parent_id: parent }),
        });
        if (parent) {
            expanded.add(parent);
            remember();
        }
        location.href = `note.html?id=${encodeURIComponent(note.id)}`;
    } catch (error) {
        message(error.message, 'error');
        busy = false;
        document.getElementById('noteCreate').disabled = false;
    }
}
document.getElementById('noteCreate').addEventListener('click', () => create());
search.addEventListener('input', render);
tree.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button || busy) return;
    const id = button.closest('[data-id]').dataset.id;
    if (button.dataset.action === 'toggle') {
        expanded.has(id) ? expanded.delete(id) : expanded.add(id);
        remember();
        render();
        tree.querySelector(`[data-id="${id}"] .note-toggle`)?.focus();
    } else if (button.dataset.action === 'add') create(id);
    else {
        moving = items.find((item) => item.id === id);
        const excluded = new Set([id]);
        let changed = true;
        while (changed) {
            changed = false;
            for (const item of items)
                if (excluded.has(item.parent_id) && !excluded.has(item.id)) {
                    excluded.add(item.id);
                    changed = true;
                }
        }
        parentSelect.innerHTML =
            '<option value="">Top level</option>' +
            items
                .filter((item) => !excluded.has(item.id))
                .map(
                    (item) =>
                        `<option value="${h(item.id)}">${h(item.title || 'Untitled note')}</option>`,
                )
                .join('');
        parentSelect.value = moving.parent_id || '';
        dialog.showModal();
    }
});
document.getElementById('noteMoveCancel').addEventListener('click', () => dialog.close());
document.getElementById('noteMoveForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy || !moving) return;
    busy = true;
    const submit = event.submitter;
    submit.disabled = true;
    try {
        const parent = parentSelect.value || null;
        await request(`/api/notes/${moving.id}/move`, {
            method: 'POST',
            body: JSON.stringify({ parent_id: parent, version: moving.version }),
        });
        if (parent) {
            expanded.add(parent);
            remember();
        }
        dialog.close();
        await load();
    } catch (error) {
        dialog.close();
        message(error.message, 'error');
    } finally {
        busy = false;
        submit.disabled = false;
    }
});
window.addEventListener('pageshow', (event) => {
    if (event.persisted) load();
});
await load();
