import { apiRequest } from '../../core/database-client.js';
import { escapeHtml as h } from '../../shared/escape-html.js';

const deckId = new URLSearchParams(location.search).get('id');
const deckForm = document.getElementById('deckForm');
const cardForm = document.getElementById('cardForm');
const message = document.getElementById('pageMessage');
const tabs = document.querySelector('.deck-tabs');
const flashcard = document.getElementById('studyCard');
const reviewActions = document.getElementById('reviewActions');
let currentCard = null;
let loadedCards = 0;
let cardsRequest = 0;
const cardList = document.getElementById('cardList');
const loadMore = document.getElementById('loadMoreCards');

function showTab(tab) {
    document.getElementById('studyPanel').hidden = tab !== 'study';
    document.getElementById('cardsPanel').hidden = tab !== 'cards';
    tabs.querySelectorAll('[data-tab]').forEach((button) =>
        button.setAttribute('aria-selected', String(button.dataset.tab === tab)),
    );
}
tabs.addEventListener('click', (event) => {
    const button = event.target.closest('[data-tab]');
    if (button) showTab(button.dataset.tab);
});

async function loadDeck() {
    const deck = await apiRequest(`/api/vocabulary/decks/${encodeURIComponent(deckId)}`);
    document.getElementById('deckEyebrow').textContent = 'Vocabulary deck';
    document.getElementById('deckTitle').textContent = deck.name;
    document.title = `${deck.name} | Daily Note`;
    document.getElementById('deckDescription').textContent =
        deck.description || 'Review words and keep your memory fresh.';
    document.getElementById('deckStats').hidden = false;
    document.getElementById('totalCount').textContent = deck.card_count;
    document.getElementById('dueCount').textContent = deck.due_count;
    const settings = await apiRequest('/api/vocabulary/settings');
    document.getElementById('studyProgress').textContent =
        settings.daily_limit === null
            ? `${settings.studied_today} studied today · ${deck.due_count} due`
            : `${settings.studied_today}/${settings.daily_limit} studied today · ${deck.due_count} due`;
}

async function loadCards(reset = true) {
    const requestId = ++cardsRequest;
    const offset = reset ? 0 : loadedCards;
    loadMore.disabled = true;
    try {
        const cards = await apiRequest(
            `/api/vocabulary/decks/${encodeURIComponent(deckId)}/cards?offset=${offset}`,
        );
        if (requestId !== cardsRequest) return;
        const markup = cards
            .map(
                (card) =>
                    `<article class="word-row"><div><strong>${h(card.term)}</strong><p>${h(card.meaning)}</p></div><small>${h(card.state)}</small></article>`,
            )
            .join('');
        if (reset)
            cardList.innerHTML =
                markup ||
                '<div class="empty-state"><h2>No words yet</h2><p>Add your first word using the form.</p></div>';
        else cardList.insertAdjacentHTML('beforeend', markup);
        loadedCards = offset + cards.length;
        document.getElementById('cardCountLabel').textContent = `${loadedCards} loaded`;
        loadMore.hidden = cards.length < 100;
    } finally {
        if (requestId === cardsRequest) loadMore.disabled = false;
    }
}
loadMore.addEventListener('click', () => {
    if (loadMore.disabled) return;
    message.textContent = '';
    message.classList.remove('error');
    loadCards(false).catch((error) => {
        message.textContent = error.message;
        message.classList.add('error');
    });
});

async function loadStudy() {
    currentCard = await apiRequest(`/api/vocabulary/study?deck_id=${encodeURIComponent(deckId)}`);
    reviewActions.hidden = true;
    if (!currentCard) {
        const settings = await apiRequest('/api/vocabulary/settings');
        flashcard.innerHTML =
            settings.remaining === 0
                ? '<div><h3>Daily goal reached</h3><p>You can review more cards tomorrow or change your daily limit on the deck list.</p></div>'
                : '<div><h3>No cards due right now</h3><p>Reviewed words return when their timer ends.</p></div>';
        return;
    }
    flashcard.innerHTML = `<div><p class="card-label">Recall the meaning</p><h3>${h(currentCard.term)}</h3><button id="revealAnswer" class="outline-button" type="button">Show answer</button><div id="answerArea" hidden><p class="card-answer">${h(currentCard.meaning)}</p>${currentCard.example ? `<p class="card-example">${h(currentCard.example)}</p>` : ''}</div></div>`;
    document.getElementById('revealAnswer').addEventListener('click', (event) => {
        event.currentTarget.hidden = true;
        document.getElementById('answerArea').hidden = false;
        reviewActions.hidden = false;
    });
}

reviewActions.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-minutes]');
    if (!button || !currentCard) return;
    reviewActions.querySelectorAll('button').forEach((item) => {
        item.disabled = true;
    });
    try {
        await apiRequest(`/api/vocabulary/cards/${encodeURIComponent(currentCard.id)}/review`, {
            method: 'POST',
            body: JSON.stringify({ interval_minutes: Number(button.dataset.minutes) }),
        });
        await Promise.all([loadDeck(), loadCards(), loadStudy()]);
    } catch (error) {
        message.textContent = error.message;
        message.classList.add('error');
    } finally {
        reviewActions.querySelectorAll('button').forEach((item) => {
            item.disabled = false;
        });
    }
});

deckForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = deckForm.querySelector('[type="submit"]');
    if (button.disabled) return;
    button.disabled = true;
    try {
        const deck = await apiRequest('/api/vocabulary/decks', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(new FormData(deckForm))),
        });
        location.replace(`vocabulary-deck.html?id=${encodeURIComponent(deck.id)}`);
    } catch (error) {
        message.textContent = error.message;
        message.classList.add('error');
    } finally {
        button.disabled = false;
    }
});

cardForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = cardForm.querySelector('[type="submit"]');
    if (button.disabled) return;
    button.disabled = true;
    try {
        await apiRequest(`/api/vocabulary/decks/${encodeURIComponent(deckId)}/cards`, {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(new FormData(cardForm))),
        });
        cardForm.reset();
        message.classList.remove('error');
        message.textContent = 'Card added to this deck.';
        await Promise.all([loadDeck(), loadCards(), loadStudy()]);
    } catch (error) {
        message.textContent = error.message;
        message.classList.add('error');
    } finally {
        button.disabled = false;
    }
});

if (deckId) {
    document.getElementById('createPanel').hidden = true;
    document.getElementById('deckWorkspace').hidden = false;
    try {
        await Promise.all([loadDeck(), loadCards(), loadStudy()]);
    } catch (error) {
        message.textContent = error.message;
        message.classList.add('error');
        document.getElementById('deckWorkspace').hidden = true;
    }
}
