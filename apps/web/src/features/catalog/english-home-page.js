import { getSubject, activityTypes } from './subject-catalog.js';
import { escapeHtml } from '../../shared/escape-html.js';

const host = document.querySelector('.category-grid');
if (host) {
    host.innerHTML = getSubject('english')
        .activities.map((activity) => {
            const type = activityTypes[activity.type];
            const content = `<div class="category-icon">${escapeHtml(type.label[0])}</div>
        <h2>${escapeHtml(type.label)}</h2>
        <div class="category-footer">
        <span class="action-label">${activity.href ? '→' : 'Coming soon'}</span></div>`;
            return activity.href
                ? `<a class="category-card" href="${escapeHtml(activity.href)}">${content}</a>`
                : `<article class="category-card coming-soon" aria-disabled="true">${content}</article>`;
        })
        .join('');
    document.body.classList.remove('page-loading');
}
