import { apiRequest } from '../../core/database-client.js';
import { clearSession } from '../../core/session-storage.js';
import { escapeHtml as h } from '../../shared/escape-html.js';
export { h };
export const userId = localStorage.getItem('userId');
export const request = (path, options = {}) => apiRequest(path, { cache: 'no-store', ...options });
export const dateLabel = (value) =>
    value
        ? new Intl.DateTimeFormat('vi-VN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              timeZone: 'Asia/Bangkok',
          }).format(new Date(value))
        : '';
export const excerpt = (value = '') =>
    value
        .replace(/```[\s\S]*?```/g, ' [code / visual] ')
        .replace(/\$\$[\s\S]*?(?:\$\$|$)/g, ' [formula] ')
        .replace(/\$[^$\n]+\$/g, ' [formula] ')
        .replace(/!\[[^\]]*\]\([^)]+\)/g, ' [image] ')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[#>*`_$~]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 180);
export const tagsHTML = (tags = []) =>
    tags.map((tag) => `<span class="writing-tag">${h(tag)}</span>`).join('');
export function message(text, kind = 'info') {
    const element = document.getElementById('writingMessage');
    if (element) {
        element.textContent = text;
        element.dataset.kind = kind;
    }
}
export function initWritingShell() {
    const name = localStorage.getItem('username') || 'Your account';
    const label = document.getElementById('sidebarUserName');
    if (label) label.textContent = name;
    const avatar = document.querySelector('.top-avatar');
    if (avatar) {
        avatar.textContent = name.trim().charAt(0).toUpperCase() || 'U';
        avatar.title = name;
    }
    document.getElementById('logoutButton')?.addEventListener('click', async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        try {
            await clearSession();
            location.href = 'index.html';
        } catch (error) {
            button.disabled = false;
            message(error.message, 'error');
        }
    });
}
let renderer;
const assetCache = new Map();
export async function paintRich(element, source) {
    renderer ||= import(new URL('vendor/rich/rendering.js', new URL('.', document.baseURI)).href);
    const { renderRich } = await renderer;
    return renderRich(element, source, {
        resolveAsset(id) {
            if (!assetCache.has(id))
                assetCache.set(
                    id,
                    request('/api/notes/assets/' + encodeURIComponent(id)).catch((error) => {
                        assetCache.delete(id);
                        throw error;
                    }),
                );
            return assetCache.get(id);
        },
    });
}
export async function disposeWriting(element) {
    if (renderer) (await renderer).disposeRich(element);
}
export function watchTheme(callback) {
    new MutationObserver(callback).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
    });
}
export async function confirmAction({ title, detail, label = 'Confirm' }) {
    const dialog = document.getElementById('writingConfirm');
    dialog.querySelector('h2').textContent = title;
    dialog.querySelector('p').textContent = detail;
    dialog.querySelector('[value="confirm"]').textContent = label;
    dialog.returnValue = '';
    dialog.showModal();
    return new Promise((resolve) =>
        dialog.addEventListener('close', () => resolve(dialog.returnValue === 'confirm'), {
            once: true,
        }),
    );
}
