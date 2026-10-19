import { escapeHtml as h } from '../../../shared/escape-html.js';

// Parse plain text, never authored HTML. Every question gets at most one input.
export function renderCompletion(text, questions, renderControl, used = new Set()) {
    const marker =
        /\((\d+)\)\s*(?:_{2,}|\.{3,}|\u2026+)|\[(\d+)\]\s*(?:_{2,}|\.{3,}|\u2026+)|\{\{(\d+)\}\}|_{3,}/g;
    const safeText = (value) => h(value).replace(/\n/g, '<br>');
    let html = '',
        end = 0;
    for (const match of String(text).matchAll(marker)) {
        html += safeText(text.slice(end, match.index));
        const label = Number(match[1] || match[2] || match[3]) || null;
        const question = label
            ? questions.find((q) => q.number === label || q.metadata?.source_number === label) ||
              questions.find((q) => new RegExp(`^Blank\\s+${label}$`, 'i').test(q.prompt.trim())) ||
              questions[label - 1]
            : questions.find((q) => !used.has(q.id));
        if (!question) html += safeText(match[0]);
        else if (used.has(question.id))
            html += `<button type="button" class="blank-reference" data-jump-id="${h(question.id)}">See ${question.number}</button>`;
        else {
            used.add(question.id);
            html += `<span class="question-row inline-question" data-question-id="${h(question.id)}"><label class="inline-blank"><span class="blank-number">${question.number}</span>${renderControl(question)}</label></span>`;
        }
        end = match.index + match[0].length;
    }
    html += safeText(text.slice(end));
    return { html, used };
}
