import { apiRequest } from '../../core/database-client.js';

function wordAtPoint(x, y) {
    const position = document.caretPositionFromPoint?.(x, y);
    const range = position ? null : document.caretRangeFromPoint?.(x, y);
    const node = position?.offsetNode || range?.startContainer;
    const offset = position?.offset ?? range?.startOffset;
    if (node?.nodeType !== Node.TEXT_NODE) return '';
    const value = node.textContent || '';
    const character = Math.min(offset, value.length - 1);
    const words = /[\p{L}\p{M}\p{N}]+(?:['’\-][\p{L}\p{M}\p{N}]+)*/gu;
    for (const match of value.matchAll(words)) {
        if (character >= match.index && character < match.index + match[0].length) return match[0];
    }
    return '';
}

function termFromEvent(event) {
    const target = event.target;
    if (
        !(target instanceof Element) ||
        target.closest('[data-vocab-capture], input[type="password"], [contenteditable="true"]')
    )
        return '';
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        return target.value.slice(target.selectionStart, target.selectionEnd).trim();
    }
    const selection = window.getSelection();
    const selected = selection?.toString().trim() || '';
    if (selected && selection.rangeCount && selection.getRangeAt(0).intersectsNode(target))
        return selected;
    return wordAtPoint(event.clientX, event.clientY);
}

export function initVocabularyCapture() {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = '/styles/components/vocabulary-capture.css';
    document.head.append(stylesheet);

    const menu = document.createElement('button');
    menu.type = 'button';
    menu.className = 'vocab-capture-menu';
    menu.dataset.vocabCapture = '';
    menu.textContent = 'Save to vocabulary';
    menu.hidden = true;
    document.body.append(menu);

    const dialog = document.createElement('dialog');
    dialog.className = 'vocab-capture-dialog';
    dialog.dataset.vocabCapture = '';
    dialog.innerHTML = `<form class="vocab-capture-form">
        <div class="vocab-capture-title"><div><p>VOCABULARY</p><h2>Save a word</h2></div><button type="button" class="vocab-capture-close" aria-label="Close">×</button></div>
        <label>Word or phrase<input name="term" maxlength="500" required></label>
        <label>Meaning <span>(required)</span><textarea name="meaning" maxlength="4000" rows="3" required></textarea></label>
        <label>Example <span>(optional)</span><textarea name="example" maxlength="4000" rows="2"></textarea></label>
        <label>Audio path <span>(optional)</span><input name="audio_path" maxlength="1000" placeholder="Local audio path"></label>
        <label>Save in deck<select name="deck_id" required></select></label>
        <label class="vocab-capture-new" hidden>New deck name<input name="new_deck_name" maxlength="120"></label>
        <p class="vocab-capture-message" role="status" aria-live="polite"></p>
        <button class="vocab-capture-submit" type="submit">Save card</button>
    </form>`;
    document.body.append(dialog);
    const form = dialog.querySelector('form');
    const deckSelect = form.elements.deck_id;
    const newDeck = form.querySelector('.vocab-capture-new');
    const status = form.querySelector('.vocab-capture-message');
    let capturedTerm = '';

    const hideMenu = () => {
        menu.hidden = true;
    };
    document.addEventListener('contextmenu', (event) => {
        const term = termFromEvent(event).replace(/\s+/g, ' ').trim();
        if (!term || term.length > 500) return hideMenu();
        event.preventDefault();
        capturedTerm = term;
        menu.textContent = `Save “${term.length > 35 ? `${term.slice(0, 35)}…` : term}” to vocabulary`;
        menu.hidden = false;
        menu.style.left = `${Math.max(8, Math.min(event.clientX, window.innerWidth - 285))}px`;
        menu.style.top = `${Math.max(8, Math.min(event.clientY, window.innerHeight - 50))}px`;
        menu.focus();
    });
    document.addEventListener('pointerdown', (event) => {
        if (event.target !== menu) hideMenu();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') hideMenu();
    });
    menu.addEventListener('click', async () => {
        hideMenu();
        form.reset();
        form.elements.term.value = capturedTerm;
        status.textContent = '';
        deckSelect.innerHTML = '<option value="" disabled selected>Loading decks…</option>';
        dialog.showModal();
        form.elements.meaning.focus();
        try {
            const decks = await apiRequest('/api/vocabulary/decks');
            deckSelect.replaceChildren();
            for (const deck of decks) deckSelect.add(new Option(deck.name, deck.id));
            deckSelect.add(new Option('+ Create a new deck', 'new'));
            if (decks.length === 0) deckSelect.value = 'new';
            deckSelect.dispatchEvent(new Event('change'));
        } catch (error) {
            status.textContent = error.message;
        }
    });
    deckSelect.addEventListener('change', () => {
        newDeck.hidden = deckSelect.value !== 'new';
        form.elements.new_deck_name.required = deckSelect.value === 'new';
    });
    form.querySelector('.vocab-capture-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    });
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submit = form.querySelector('.vocab-capture-submit');
        submit.disabled = true;
        status.textContent = 'Saving…';
        try {
            let deckId = deckSelect.value;
            if (deckId === 'new') {
                const deck = await apiRequest('/api/vocabulary/decks', {
                    method: 'POST',
                    body: JSON.stringify({ name: form.elements.new_deck_name.value.trim() }),
                });
                deckId = deck.id;
            }
            await apiRequest(`/api/vocabulary/decks/${encodeURIComponent(deckId)}/cards`, {
                method: 'POST',
                body: JSON.stringify({
                    term: form.elements.term.value.trim(),
                    meaning: form.elements.meaning.value.trim(),
                    example: form.elements.example.value.trim(),
                    audio_path: form.elements.audio_path.value.trim(),
                }),
            });
            dialog.close();
            const toast = document.createElement('div');
            toast.className = 'vocab-capture-toast';
            toast.setAttribute('role', 'status');
            toast.textContent = `Saved “${form.elements.term.value.trim()}” to vocabulary`;
            document.body.append(toast);
            setTimeout(() => toast.remove(), 3500);
        } catch (error) {
            status.textContent = error.message;
        } finally {
            submit.disabled = false;
        }
    });
}
