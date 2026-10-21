import { appIcon } from '../shared/icons.js';
export function initTheme() {
    const button = document.getElementById('themeToggle');
    if (
        button?.hasAttribute('data-theme-switch') &&
        !button.querySelector('.theme-switch-track, .grammar-switch')
    ) {
        button.removeAttribute('data-theme-switch');
        button.removeAttribute('role');
        button.removeAttribute('aria-checked');
    }
    function apply(theme) {
        if (theme === 'dark') document.documentElement.dataset.theme = 'dark';
        else document.documentElement.removeAttribute('data-theme');
        if (button?.hasAttribute('data-theme-switch')) {
            button.setAttribute('aria-checked', String(theme === 'dark'));
            button.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        } else if (button) {
            button.innerHTML = appIcon(theme === 'dark' ? 'sun' : 'moon');
            button.setAttribute(
                'aria-label',
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
            );
            button.title = button.getAttribute('aria-label');
        }
    }
    apply(localStorage.getItem('theme'));
    button?.addEventListener('click', () => {
        const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        apply(theme);
    });
}
