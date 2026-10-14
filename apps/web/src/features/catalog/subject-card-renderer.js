import { subjects } from './subject-catalog.js';
import { escapeHtml } from '../../shared/escape-html.js';

export function renderSubjectLinks(host) {
    if (!host) return;
    host.innerHTML = subjects
        .map((subject) => {
            const state = subject.href ? '' : ' - Coming soon';
            const content = `<div class="subject-top"><span class="subject-icon pixel-subject-icon subject-icon--${escapeHtml(subject.id)}">${escapeHtml(subject.icon)}</span></div><div class="quest-info"><h3>${escapeHtml(subject.name)}</h3><p>${escapeHtml(subject.description)}${state}</p></div>`;
            return subject.href
                ? `<a class="subject-card pixel-quest-card subject-card--${escapeHtml(subject.id)}" href="${escapeHtml(subject.href)}">${content}</a>`
                : `<div class="subject-card pixel-quest-card subject-card--${escapeHtml(subject.id)}" aria-disabled="true">${content}</div>`;
        })
        .join('');
}
