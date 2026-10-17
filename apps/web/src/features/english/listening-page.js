import { apiRequest } from '../../core/database-client.js';
import { escapeHtml as h } from '../../shared/escape-html.js';
import { trackListeningAudio } from './listening-tracker.js';

const slug = new URLSearchParams(location.search).get('session');
const result = document.getElementById('listeningResult');
const audio = document.getElementById('listeningAudio');
trackListeningAudio(audio);
let session;
function showResult(html) {
    result.hidden = false;
    result.innerHTML = html;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function renderWorksheet(text) {
    return h(text).replace(/\((\d{1,2})\)[\s._·…-]{3,}/g, (match, number) => {
        const value = Number(number);
        if (value < session.first_question || value > session.last_question) return match;
        return `(${value}) <input class="inline-answer" data-answer="${value}" aria-label="Answer ${value}" autocomplete="off" />`;
    });
}
function syncAnswer(event) {
    const input = event.target.closest('[data-answer]');
    if (!input) return;
    document.querySelectorAll(`[data-answer="${input.dataset.answer}"]`).forEach((other) => {
        if (other !== input) other.value = input.value;
    });
}
function setMode(mode) {
    document.getElementById('examPanel').hidden = mode !== 'exam';
    document.getElementById('dictationPanel').hidden = mode !== 'dictation';
    document.querySelectorAll('[data-mode]').forEach((button) => {
        button.setAttribute('aria-selected', String(button.dataset.mode === mode));
    });
    result.hidden = true;
}
if (!slug) location.replace('english-listening-library.html');
else {
    try {
        session = await apiRequest(`/api/listening/${encodeURIComponent(slug)}`);
        document.title = `${session.title} | Listening`;
        document.getElementById('listeningTitle').textContent = session.title;
        document.getElementById('listeningSubtitle').textContent =
            `Questions ${session.first_question}–${session.last_question} · ${session.status === 'draft' ? 'OCR draft awaiting review' : 'Ready to practise'}`;
        document.getElementById('sourceNote').textContent =
            `Transcribed from PDF page${session.source_pages.length === 1 ? '' : 's'} ${session.source_pages.join(', ')}. Check OCR wording against the source before adding answer keys.`;
        document.getElementById('worksheetText').innerHTML = renderWorksheet(session.question_text);
        document.getElementById('answerGrid').innerHTML = Array.from(
            { length: session.last_question - session.first_question + 1 },
            (_, index) =>
                `<label class="answer-item"><span>${session.first_question + index}</span><input data-answer="${session.first_question + index}" autocomplete="off" aria-label="Answer ${session.first_question + index}" /></label>`,
        ).join('');
        const audioData = await apiRequest(`/api/listening/${encodeURIComponent(slug)}/audio-url`);
        if (audioData.url) {
            audio.src = audioData.url;
            audio.hidden = false;
            document.getElementById('rewindAudio').disabled = false;
            document.getElementById('audioSpeed').disabled = false;
            document.getElementById('audioStatus').textContent =
                'Play the audio and work through this part.';
        } else
            document.getElementById('audioStatus').textContent =
                `Audio not added yet. Expected file: ${session.audio_filename}`;
    } catch (error) {
        showResult(`<p>${h(error.message)}</p>`);
        document.getElementById('audioStatus').textContent = 'Could not load this part.';
    }
}
document
    .querySelectorAll('[data-mode]')
    .forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
document.getElementById('examPanel').addEventListener('input', syncAnswer);
document.getElementById('audioSpeed').addEventListener('change', (event) => {
    audio.playbackRate = Number(event.target.value);
});
document.getElementById('rewindAudio').addEventListener('click', () => {
    audio.currentTime = Math.max(0, audio.currentTime - 5);
});
document.getElementById('examForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!session) return;
    const button = event.submitter;
    button.disabled = true;
    const responses = {};
    document.querySelectorAll('#answerGrid [data-answer]').forEach((input) => {
        responses[input.dataset.answer] = input.value.trim();
    });
    try {
        const saved = await apiRequest(`/api/listening/${encodeURIComponent(slug)}/attempts`, {
            method: 'POST',
            body: JSON.stringify({ mode: 'exam', responses }),
        });
        showResult(
            `<h2>${saved.graded ? `${saved.correct} / ${saved.graded} correct · ${saved.score}%` : 'Answers saved'}</h2><p>${saved.graded ? 'Check your answers below.' : 'Answer key is being reviewed; this attempt is saved without a score.'}</p><div class="review-grid">${saved.review.map((item) => `<div><strong>${item.number}</strong><span>${h(item.answer || '—')}</span><span>${item.correct === null ? 'Awaiting key' : item.correct ? 'Correct' : `Expected: ${h(item.expected.join(' / '))}`}</span></div>`).join('')}</div>`,
        );
    } catch (error) {
        showResult(`<p>${h(error.message)}</p>`);
    } finally {
        button.disabled = false;
    }
});
document.getElementById('dictationText').addEventListener('input', (event) => {
    document.getElementById('dictationWordCount').textContent =
        `${event.target.value.trim().split(/\s+/).filter(Boolean).length} words`;
});
document.getElementById('dictationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!session) return;
    const button = event.submitter;
    button.disabled = true;
    try {
        const saved = await apiRequest(`/api/listening/${encodeURIComponent(slug)}/attempts`, {
            method: 'POST',
            body: JSON.stringify({
                mode: 'dictation',
                text: document.getElementById('dictationText').value,
            }),
        });
        showResult(
            `<h2>${saved.score === null ? 'Dictation saved' : `${saved.score}% approximate word match`}</h2><p>${saved.transcript ? 'Compare your writing with the OCR audioscript below. The score is approximate until the text is proofread.' : 'Audioscript is not available yet. Your dictation has been saved for later review.'}</p>${saved.transcript ? `<div class="transcript-review">${h(saved.transcript)}</div>` : ''}`,
        );
    } catch (error) {
        showResult(`<p>${h(error.message)}</p>`);
    } finally {
        button.disabled = false;
    }
});
