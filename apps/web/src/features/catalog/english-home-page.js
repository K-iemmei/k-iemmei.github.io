import { getSubject, activityTypes } from './subject-catalog.js';
import { escapeHtml } from '../../shared/escape-html.js';
import { appIcon } from '../../shared/icons.js';
import { apiRequest } from '../../core/database-client.js';
const skillIcons = {
    reading: 'book',
    listening: 'headphones',
    grammar: 'grammar',
    vocabulary: 'cards',
};
const skillDescriptions = {
    reading: 'Passages & practice tests',
    listening: 'IELTS audio & dictation',
    grammar: 'English Grammar in Use · 145 units',
    vocabulary: 'Words & spaced repetition',
};

const host = document.querySelector('.category-grid');
if (host) {
    host.innerHTML = getSubject('english')
        .activities.map((activity) => {
            const type = activityTypes[activity.type];
            const content = `<div class="category-card-top"><div class="category-icon">${appIcon(skillIcons[activity.type])}</div><span class="card-arrow">${appIcon('arrow')}</span></div>
        <h2>${escapeHtml(type.label)}</h2>
        <p>${escapeHtml(skillDescriptions[activity.type] || activity.description || '')}</p>
        ${activity.href ? '' : '<span class="action-label">Coming soon</span>'}`;
            return activity.href
                ? `<a class="category-card" href="${escapeHtml(activity.href)}">${content}</a>`
                : `<article class="category-card coming-soon" aria-disabled="true">${content}</article>`;
        })
        .join('');
    document.body.classList.remove('page-loading');
    apiRequest('/api/grammar')
        .then((data) => {
            const card = host.querySelector('a[href="english-grammar.html"] p');
            const completed = data.progress.filter((unit) => unit.completed_at).length;
            const due = data.reviews.filter(
                (item) => Date.parse(item.due_at) <= Date.now() || item.streak === 0,
            ).length;
            if (card) card.textContent = `${completed}/145 units · ${due} câu cần ôn`;
        })
        .catch(() => {});
}
