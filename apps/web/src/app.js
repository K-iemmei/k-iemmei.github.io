import { initTheme } from './core/theme-controller.js';
import { requireSession } from './core/session-storage.js';

// Each page loads only its own feature. Module dependencies replace script ordering.
const pages = {
    login: () => import('./features/auth/login-page.js'),
    dashboard: () => import('./features/dashboard/dashboard-page.js'),
    chinese: () => import('./features/chinese/chinese-practice-page.js'),
    reading: async () => (await import('./features/english/reading/reading-page.js')).initReading(),
    'reading-library': () => import('./features/english/reading-library-page.js'),
    'english-home': () => import('./features/catalog/english-home-page.js'),
    vocabulary: () => import('./features/vocabulary/vocabulary-page.js'),
    'vocabulary-deck': () => import('./features/vocabulary/vocabulary-deck-page.js'),
    'reading-author': () => import('./features/english/reading/reading-authoring-page.js'),
    admin: () => import('./features/admin/admin-page.js'),
};

initTheme();
const page = document.body.dataset.page;
let canOpen = page === 'login';
let sessionError = false;
if (!canOpen) {
    try {
        canOpen = await requireSession();
    } catch (error) {
        sessionError = true;
        console.error('Unable to verify session:', error);
        const message = document.createElement('p');
        message.setAttribute('role', 'alert');
        message.textContent = 'Unable to verify sign-in. Check your connection and reload.';
        document.body.prepend(message);
    }
}
if (canOpen || sessionError) document.documentElement.removeAttribute('data-auth-pending');
if (canOpen) {
    try {
        if (page !== 'login') {
            const { initVocabularyCapture } =
                await import('./features/vocabulary/vocabulary-capture.js');
            initVocabularyCapture();
        }
        if (!pages[page]) throw new Error(`Unknown page: ${page}`);
        await pages[page]();
    } catch (error) {
        console.error('Unable to initialize page:', error);
        const message = document.createElement('p');
        message.setAttribute('role', 'alert');
        message.textContent = 'Unable to load this page. Please reload and try again.';
        document.body.prepend(message);
    }
}
