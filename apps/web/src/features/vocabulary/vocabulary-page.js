import { apiRequest } from '../../core/database-client.js';
import { deployment } from '../../core/deployment-config.js';
import { parseApkgInBrowser } from './apkg-browser.js';
import { escapeHtml as h } from '../../shared/escape-html.js';

const host = document.getElementById('deckList');
const message = document.getElementById('pageMessage');
const fileInput = document.getElementById('apkgInput');
const limitInput = document.getElementById('dailyLimit');

async function loadActivity() {
    const activity = await apiRequest('/api/vocabulary/activity');
    limitInput.value = String(activity.daily_limit);
    if (limitInput.value !== String(activity.daily_limit)) {
        const option = document.createElement('option');
        option.value = String(activity.daily_limit);
        option.textContent = String(activity.daily_limit);
        limitInput.add(option);
        limitInput.value = option.value;
    }
    const days = new Map(activity.days.map((day) => [day.day.slice(0, 10), day.cards]));
    const chart = document.getElementById('activityChart');
    const today = new Date();
    const dates = Array.from({ length: 30 }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - 29 + index);
        return {
            key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
            label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        };
    });
    const max = Math.max(1, ...dates.map((date) => days.get(date.key) || 0));
    chart.innerHTML = dates
        .map((date) => {
            const count = days.get(date.key) || 0;
            return `<div class="activity-bar" style="--bar-height:${Math.max(5, (count / max) * 100)}%" title="${h(date.label)}: ${count} cards" aria-label="${h(date.label)}: ${count} cards"><span></span></div>`;
        })
        .join('');
    const recent = dates.reduce((sum, date) => sum + (days.get(date.key) || 0), 0);
    document.getElementById('activitySummary').textContent =
        `${recent} cards studied over the last 30 days · ${activity.studied_today} today${activity.daily_limit === null ? '' : ` / ${activity.daily_limit} daily limit`}`;
    chart.setAttribute('aria-label', `${recent} distinct cards studied in the last 30 days`);
}

limitInput.addEventListener('change', async () => {
    limitInput.disabled = true;
    try {
        await apiRequest('/api/vocabulary/settings', {
            method: 'PUT',
            body: JSON.stringify({
                daily_limit: limitInput.value === 'null' ? null : Number(limitInput.value),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Bangkok',
            }),
        });
        await loadActivity();
    } catch (error) {
        message.textContent = error.message;
        message.classList.add('error');
    } finally {
        limitInput.disabled = false;
    }
});

async function loadDecks() {
    try {
        const decks = await apiRequest('/api/vocabulary/decks');
        document.getElementById('deckCount').textContent =
            `${decks.length} ${decks.length === 1 ? 'deck' : 'decks'}`;
        host.innerHTML = decks.length
            ? decks
                  .map(
                      (
                          deck,
                      ) => `<a class="deck-card" href="vocabulary-deck.html?id=${encodeURIComponent(deck.id)}">
                <span class="deck-icon" aria-hidden="true">▤</span>
                <h3>${h(deck.name)}</h3>
                <p>${h(deck.description || 'Your personal word collection')}</p>
                <div class="deck-meta"><span>${deck.card_count} ${deck.card_count === 1 ? 'card' : 'cards'}</span><span class="due-badge">${deck.due_count} due today &rarr;</span></div>
              </a>`,
                  )
                  .join('')
            : `<div class="empty-state"><span class="deck-icon" aria-hidden="true">▤</span><h2>No decks yet</h2><p>Create a deck and add your first word to start practicing.</p><a class="primary-button" href="vocabulary-deck.html">Create your first deck</a></div>`;
    } catch (error) {
        host.innerHTML = '<p class="empty-state">Unable to load your decks.</p>';
        message.textContent = error.message;
        message.classList.add('error');
    }
}

fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    message.classList.remove('error');
    if (file.size > 250 * 1024 * 1024) {
        message.textContent = 'This package exceeds the 250 MB import limit.';
        message.classList.add('error');
        fileInput.value = '';
        return;
    }
    message.textContent = `Importing ${file.name}…`;
    try {
        if (deployment.mode === 'supabase') {
            const parsed = await parseApkgInBrowser(file);
            const deck = await apiRequest('/api/vocabulary/decks', {
                method: 'POST',
                body: JSON.stringify({
                    name: parsed.name,
                    description: `Imported from ${file.name}`,
                    source_type: 'apkg',
                }),
            });
            for (let at = 0; at < parsed.cards.length; at += 200) {
                await apiRequest(
                    `/api/vocabulary/decks/${encodeURIComponent(deck.id)}/cards/batch`,
                    {
                        method: 'POST',
                        body: JSON.stringify({ cards: parsed.cards.slice(at, at + 200) }),
                    },
                );
                message.textContent = `Importing ${Math.min(at + 200, parsed.cards.length)} / ${parsed.cards.length} cards…`;
            }
            message.textContent = `Imported ${parsed.cards.length} cards into 1 deck.`;
            await loadDecks();
            return;
        }
        const response = await fetch('/api/vocabulary/import-apkg', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/octet-stream',
                'X-File-Name': encodeURIComponent(file.name),
            },
            body: file,
        });
        if (!(response.headers.get('content-type') || '').includes('application/json')) {
            throw new Error(
                'Import API is unavailable. Restart the local server to load the latest routes.',
            );
        }
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Import failed');
        message.textContent = `Imported ${result.card_count} cards into ${result.deck_count} ${result.deck_count === 1 ? 'deck' : 'decks'}.`;
        await loadDecks();
    } catch (error) {
        message.textContent = error.message;
        message.classList.add('error');
    } finally {
        fileInput.value = '';
    }
});

await Promise.all([
    loadDecks(),
    loadActivity().catch((error) => {
        message.textContent = error.message;
        message.classList.add('error');
    }),
]);
