import { clearPreferenceCache } from './page-cache.js';
import { deployment } from './deployment-config.js';
import { cloudUser, cloudLogout } from './supabase-session.js';

export function saveSession(user) {
    localStorage.setItem('username', user.name || user.username);
    localStorage.setItem('userId', user.id);
    localStorage.setItem(
        'user',
        JSON.stringify({ id: user.id, name: user.name, username: user.username }),
    );
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isLoggedIn');
}
export async function clearSession() {
    clearPreferenceCache();
    if (deployment.mode === 'supabase') {
        await cloudLogout();
        for (const key of ['username', 'userId', 'user', 'accessToken', 'isLoggedIn'])
            localStorage.removeItem(key);
        return;
    }
    const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
    });
    if (!response.ok) throw new Error('Unable to end session');
    for (const key of ['username', 'userId', 'user', 'accessToken', 'isLoggedIn'])
        localStorage.removeItem(key);
}
export async function requireSession() {
    if (deployment.mode === 'supabase') {
        const user = await cloudUser();
        if (!user) {
            window.location.replace('index.html');
            return false;
        }
        saveSession(user);
        return true;
    }
    const response = await fetch('/api/auth/session', {
        credentials: 'same-origin',
        cache: 'no-store',
    });
    if (response.status === 401) {
        window.location.replace('/index.html');
        return false;
    }
    if (!response.ok) throw new Error('Cannot verify session');
    saveSession(await response.json());
    return true;
}
