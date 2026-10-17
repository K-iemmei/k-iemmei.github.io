export function initTheme() {
    const button = document.getElementById('themeToggle');
    function apply(theme) {
        if (theme === 'dark') document.documentElement.dataset.theme = 'dark';
        else document.documentElement.removeAttribute('data-theme');
        if (button?.hasAttribute('data-theme-switch')) {
            button.setAttribute('aria-checked', String(theme === 'dark'));
            button.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        } else if (button) button.textContent = theme === 'dark' ? '☾' : '☼';
    }
    apply(localStorage.getItem('theme'));
    button?.addEventListener('click', () => {
        const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        apply(theme);
    });
}
