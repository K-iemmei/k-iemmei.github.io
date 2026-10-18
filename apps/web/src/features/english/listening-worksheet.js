import { escapeHtml as h } from '../../shared/escape-html.js';

export function renderWorksheet(text, { first_question: first, last_question: last }) {
    // Horizontal spacing only: consuming newlines here joins unrelated worksheet rows.
    return h(text).replace(
        /\((\d{1,2})\)[ \t]*(?:_{3,}|\.{3,}|·{3,}|…+|-{3,})/g,
        (match, number) => {
            const value = Number(number);
            if (value < first || value > last) return match;
            return `(${value}) <input class="inline-answer" data-answer="${value}" aria-label="Answer ${value}" autocomplete="off" />`;
        },
    );
}
