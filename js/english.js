const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.documentElement.dataset.theme = 'dark';
    if (themeToggle) themeToggle.textContent = '☾';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.dataset.theme === 'dark';

        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '☼';
        } else {
            document.documentElement.dataset.theme = 'dark';
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☾';
        }
    });
}

const answerOptions = document.querySelectorAll('.answer-option');
answerOptions.forEach((option) => {
    option.addEventListener('click', () => {
        answerOptions.forEach((item) => item.classList.remove('selected'));
        option.classList.add('selected');
    });
});
