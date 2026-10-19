import { renderCompletion } from './reading-completion.js';
import { sanitizeReadingHtml } from '../../../domain/reading-html.js';
// Replace blanks in text nodes only, preserving table structure and one control per question.
export function renderRichCompletion(html, questions, renderControl) {
    const template = document.createElement('template');
    template.innerHTML = sanitizeReadingHtml(html);
    const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const used = new Set();
    for (const node of nodes) {
        const completion = renderCompletion(node.nodeValue, questions, renderControl, used);
        const replacement = document.createElement('template');
        replacement.innerHTML = completion.html;
        node.replaceWith(replacement.content);
    }
    return { html: template.innerHTML, used };
}
