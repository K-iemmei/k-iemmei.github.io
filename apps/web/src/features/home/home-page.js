import { readCache, writeCache, cachedLoad } from '../../core/page-cache.js';
import { apiRequest } from '../../core/database-client.js';
import { clearSession } from '../../core/session-storage.js';
import { escapeHtml as h } from '../../shared/escape-html.js';
import { initWeather } from './home-weather.js';

const defaultCity = { name: 'Hà Nội, Việt Nam', latitude: 21.0285, longitude: 105.8542 };
const $ = (id) => document.getElementById(id);
const name = localStorage.getItem('username') || 'User';
$('sidebarUserName').textContent = name;
document.querySelector('.top-avatar').textContent = name.trim().charAt(0).toUpperCase() || 'U';
$('homeGreeting').textContent = `Hello ${name}`;
$('homeDate').textContent = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});
$('logoutButton').addEventListener('click', async () => {
    $('logoutButton').disabled = true;
    try {
        await clearSession();
        location.href = 'index.html';
    } catch {
        $('logoutButton').disabled = false;
        $('logoutButton').title = 'Unable to log out. Try again.';
    }
});
const preferenceKey = 'home-preferences:' + localStorage.getItem('userId');
let todos = [],
    preferences = readCache(preferenceKey, 86400000) || { city: null, news_category: 'latest' },
    ready = false,
    busy = false,
    savingPreferences = false;
let newsRequest = 0;
const send = (path, method, data) => apiRequest(path, { method, body: JSON.stringify(data) });
function controls() {
    $('todoForm')
        .querySelectorAll('input,button')
        .forEach((e) => (e.disabled = !ready || busy));
    $('todoList')
        .querySelectorAll('input,button')
        .forEach((e) => (e.disabled = busy));
    $('todoRefresh').disabled = busy;
}
function renderTodos() {
    const visible = todos
        .filter((t) => !$('pinnedOnly').checked || t.pinned)
        .sort(
            (a, b) =>
                Number(b.pinned) - Number(a.pinned) ||
                Number(a.completed) - Number(b.completed) ||
                b.created_at.localeCompare(a.created_at),
        );
    $('todoCount').textContent = `${todos.filter((t) => t.completed).length} / ${todos.length}`;
    $('todoList').innerHTML = visible.length
        ? visible
              .map(
                  (t) =>
                      `<li class="todo-item ${t.completed ? 'is-complete' : ''}" data-id="${h(t.id)}"><div class="todo-main"><input class="todo-check" type="checkbox" aria-label="Complete ${h(t.title)}" ${t.completed ? 'checked' : ''}/><span class="todo-title">${h(t.title)}</span><div class="todo-actions"><button type="button" data-action="pin" aria-label="${t.pinned ? 'Unpin' : 'Pin'} task" aria-pressed="${t.pinned}" title="${t.pinned ? 'Unpin' : 'Pin'}">${t.pinned ? '◆' : '◇'}</button><button type="button" data-action="edit" aria-label="Edit task">Edit</button><button type="button" data-action="delete" aria-label="Delete task">×</button></div></div><form class="todo-edit" hidden><label class="home-sr-only" for="edit-${h(t.id)}">Task title</label><input id="edit-${h(t.id)}" name="title" value="${h(t.title)}" maxlength="300" required/><button type="submit">Save</button><button type="button" data-action="cancel">Cancel</button></form></li>`,
              )
              .join('')
        : '<li class="home-muted todo-empty">No tasks yet.</li>';
    controls();
}
async function loadHome() {
    if (busy) return;
    busy = true;
    controls();
    try {
        const previousCity = JSON.stringify(preferences.city || defaultCity);
        const previousCategory = preferences.news_category;
        const data = await apiRequest('/api/home');
        todos = data.todos;
        preferences = data.preferences;
        writeCache(preferenceKey, preferences);
        ready = true;
        $('newsCategory').value = preferences.news_category;
        $('todoMessage').textContent = '';
        renderTodos();
        if (JSON.stringify(preferences.city || defaultCity) !== previousCity)
            weather.show(preferences.city || defaultCity);
        if (preferences.news_category !== previousCategory) loadNews();
    } catch (e) {
        $('todoMessage').textContent = e.message;
    } finally {
        busy = false;
        $('newsCategory').disabled = !ready || savingPreferences;
        controls();
    }
}
async function savePreferences(changes) {
    if (!ready || savingPreferences) throw new Error('Please wait for your settings to load.');
    savingPreferences = true;
    $('newsCategory').disabled = true;
    try {
        const next = { ...preferences, ...changes };
        await send('/api/home/preferences', 'PUT', next);
        preferences = next;
        writeCache(preferenceKey, preferences);
    } finally {
        savingPreferences = false;
        $('newsCategory').disabled = !ready;
    }
}
const weather = initWeather(async (city) => {
    await savePreferences({ city });
});
async function mutateTask(task, changes, remove = false) {
    if (busy) return;
    busy = true;
    controls();
    $('todoMessage').textContent = '';
    try {
        const result = await send('/api/home/todos/' + task.id, remove ? 'DELETE' : 'PUT', {
            version: task.version,
            ...changes,
        });
        todos = remove
            ? todos.filter((t) => t.id !== task.id)
            : todos.map((t) => (t.id === task.id ? result : t));
        renderTodos();
    } catch (e) {
        $('todoMessage').textContent = e.message;
        const check = $('todoList').querySelector(`[data-id="${task.id}"] .todo-check`);
        if (check) check.checked = task.completed;
    } finally {
        busy = false;
        controls();
    }
}
$('todoForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = $('todoInput').value.trim();
    if (!ready || busy || !title) return;
    busy = true;
    controls();
    $('todoMessage').textContent = '';
    try {
        todos.unshift(await send('/api/home/todos', 'POST', { title, pinned: true }));
        $('todoInput').value = '';
        renderTodos();
    } catch (e) {
        $('todoMessage').textContent = e.message;
    } finally {
        busy = false;
        controls();
        $('todoInput').focus();
    }
});
$('todoList').addEventListener('change', (e) => {
    if (!e.target.matches('.todo-check') || busy) return;
    const task = todos.find((t) => t.id === e.target.closest('[data-id]').dataset.id);
    if (task) mutateTask(task, { completed: e.target.checked });
});
$('todoList').addEventListener('click', (e) => {
    const button = e.target.closest('[data-action]');
    if (!button || busy) return;
    const row = button.closest('[data-id]'),
        task = todos.find((t) => t.id === row.dataset.id);
    if (!task) return;
    if (button.dataset.action === 'pin') mutateTask(task, { pinned: !task.pinned });
    if (button.dataset.action === 'edit') {
        row.querySelector('.todo-edit').hidden = false;
        row.querySelector('.todo-edit input').focus();
    }
    if (button.dataset.action === 'cancel') {
        row.querySelector('.todo-edit').hidden = true;
        row.querySelector('.todo-edit input').value = task.title;
    }
    if (button.dataset.action === 'delete') {
        if (button.dataset.confirm === 'yes') mutateTask(task, {}, true);
        else {
            button.dataset.confirm = 'yes';
            button.textContent = 'Delete?';
            button.setAttribute('aria-label', 'Confirm delete task');
        }
    }
});
$('todoList').addEventListener('submit', (e) => {
    if (!e.target.matches('.todo-edit')) return;
    e.preventDefault();
    const task = todos.find((t) => t.id === e.target.closest('[data-id]').dataset.id);
    const title = e.target.elements.title.value.trim();
    if (task && title) mutateTask(task, { title });
});
$('pinnedOnly').addEventListener('change', renderTodos);
$('todoRefresh').addEventListener('click', loadHome);
async function loadNews({ force = false } = {}) {
    const request = ++newsRequest;
    $('newsRefresh').disabled = true;
    $('newsMessage').textContent = 'Loading news…';
    try {
        const category = $('newsCategory').value;
        const data = await cachedLoad(
            'public-news:' + category,
            () => apiRequest('/api/home/news?category=' + encodeURIComponent(category)),
            { maxAge: 300000, force },
        );
        if (request !== newsRequest) return;
        $('newsList').innerHTML = data.items
            .map(
                (item) =>
                    `<article class="news-item"><time datetime="${h(item.published_at)}">${h(new Date(item.published_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }))}</time><a href="${h(item.url)}" target="_blank" rel="noopener noreferrer">${h(item.title)}<span aria-hidden="true"> ↗</span></a>${item.summary ? `<p class="news-summary">${h(item.summary)}</p>` : ''}</article>`,
            )
            .join('');
        $('newsMessage').textContent = data.stale
            ? 'Showing the last available update.'
            : `Updated ${new Date(data.updated_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    } catch (e) {
        if (request === newsRequest) $('newsMessage').textContent = e.message;
    } finally {
        if (request === newsRequest) $('newsRefresh').disabled = false;
    }
}
$('newsCategory').disabled = true;
$('newsCategory').addEventListener('change', async () => {
    try {
        await savePreferences({ news_category: $('newsCategory').value });
        await loadNews();
    } catch (e) {
        $('newsCategory').value = preferences.news_category;
        $('newsMessage').textContent = e.message;
    }
});
$('newsRefresh').addEventListener('click', () => loadNews({ force: true }));
controls();
// Independent panels start immediately; neither waits for the personal database.
$('newsCategory').value = preferences.news_category;
weather.show(preferences.city || defaultCity);
loadNews();
await loadHome();
$('newsCategory').disabled = !ready;
