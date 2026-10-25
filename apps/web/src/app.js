import { initTheme } from './core/theme-controller.js';
import { requireSession } from './core/session-storage.js';
import { cloudSessionKey } from './core/supabase-session.js';
import { deployment } from './core/deployment-config.js';

// Each page loads only its own feature. Module dependencies replace script ordering.
const pages = {
    login: () => import('./features/auth/login-page.js'),
    dashboard: () => import('./features/dashboard/dashboard-page.js'),
    home: () => import('./features/home/home-page.js'),
    chinese: () => import('./features/chinese/chinese-practice-page.js'),
    reading: async () => (await import('./features/english/reading/reading-page.js')).initReading(),
    'reading-library': () => import('./features/english/reading-library-page.js'),
    'listening-library': () => import('./features/english/listening-library-page.js'),
    listening: () => import('./features/english/listening-page.js'),
    'english-home': () => import('./features/catalog/english-home-page.js'),
    grammar: () => import('./features/grammar/book-page.js'),
    notes: () => import('./features/publishing/notes-tree-page.js'),
    blog: () => import('./features/publishing/list-page.js'),
    'note-editor': () => import('./features/publishing/editor-page.js'),
    'blog-post': () => import('./features/publishing/post-page.js'),
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
        if (error.code === 'ACCOUNT_CHANGED') window.location.reload();
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
    if (deployment.mode === 'supabase' && page !== 'login') {
        const pageUserId = localStorage.getItem('userId');
        window.addEventListener('storage', (event) => {
            if (event.key !== cloudSessionKey && event.key !== null) return;
            let nextUserId;
            try {
                nextUserId = JSON.parse(localStorage.getItem(cloudSessionKey) || 'null')?.user?.id;
            } catch {
                nextUserId = null;
            }
            if (nextUserId !== pageUserId) window.location.reload();
        });
    }
    try {
        if (!pages[page]) throw new Error(`Unknown page: ${page}`);
        const feature = pages[page]();
        // The optional capture menu must not delay the page's own data requests.
        if (page !== 'login')
            import('./features/vocabulary/vocabulary-capture.js')
                .then(({ initVocabularyCapture }) => initVocabularyCapture())
                .catch((error) => console.warn('Unable to load vocabulary capture:', error));
        await feature;
    } catch (error) {
        console.error('Unable to initialize page:', error);
        const message = document.createElement('p');
        message.setAttribute('role', 'alert');
        message.textContent = 'Unable to load this page. Please reload and try again.';
        document.body.prepend(message);
    }
}
