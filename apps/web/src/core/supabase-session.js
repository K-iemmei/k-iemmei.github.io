import { deployment } from './deployment-config.js';

export const cloudSessionKey = 'my_note_supabase_session';
const storageKey = cloudSessionKey;
let cached = null;
let cachedRaw;
let verifiedUserId = null;
const accountChanged = () =>
    Object.assign(
        new Error('Account changed in another tab. Reload this page before continuing.'),
        { code: 'ACCOUNT_CHANGED' },
    );
const endpoint = (path) => `${deployment.url}/auth/v1/${path}`;
const headers = { apikey: deployment.anonKey, 'Content-Type': 'application/json' };

function remember(session) {
    const raw = JSON.stringify(session);
    localStorage.setItem(storageKey, raw);
    cached = session;
    cachedRaw = raw;
    return session;
}
function stored() {
    try {
        const raw = localStorage.getItem(storageKey);
        if (raw !== cachedRaw) {
            cached = JSON.parse(raw || 'null');
            cachedRaw = raw;
        }
    } catch {
        cached = null;
        cachedRaw = undefined;
    }
    return cached;
}
let refreshPromise = null;
function refresh() {
    if (!refreshPromise)
        refreshPromise = refreshSession().finally(() => {
            refreshPromise = null;
        });
    return refreshPromise;
}
async function refreshSession() {
    const current = stored();
    if (!current?.refresh_token) return null;
    const response = await fetch(endpoint('token?grant_type=refresh_token'), {
        method: 'POST',
        headers,
        body: JSON.stringify({ refresh_token: current.refresh_token }),
    });
    // A slower refresh must not restore an account that has just signed out or changed.
    if (stored()?.refresh_token !== current.refresh_token) return null;
    if (!response.ok) {
        if (response.status >= 500)
            throw new Error('Authentication service is temporarily unavailable');
        clearCloudSession();
        return null;
    }
    const session = await response.json();
    if (stored()?.refresh_token !== current.refresh_token) return null;
    return remember(session);
}
export async function cloudLogin(email, password) {
    const response = await fetch(endpoint('token?grant_type=password'), {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password }),
    });
    if (response.status === 400) return null;
    if (!response.ok) throw new Error('Could not connect to Supabase Auth');
    const session = remember(await response.json());
    verifiedUserId = session.user.id;
    return {
        id: session.user.id,
        name: session.user.user_metadata?.name || email.split('@')[0],
        email,
    };
}
export async function cloudToken() {
    let session = stored();
    if (!session) return null;
    if (verifiedUserId && session.user?.id !== verifiedUserId) throw accountChanged();
    if (session.expires_at && Date.now() / 1000 > session.expires_at - 60)
        session = await refresh();
    if (verifiedUserId && session && session.user?.id !== verifiedUserId) throw accountChanged();
    return session?.access_token || null;
}
export async function cloudUser() {
    let token = await cloudToken();
    if (!token) return null;
    const requestedUserId = stored()?.user?.id;
    let response = await fetch(endpoint('user'), {
        headers: { apikey: deployment.anonKey, Authorization: `Bearer ${token}` },
    });
    if (!stored() || stored().user?.id !== requestedUserId) throw accountChanged();
    if (response.status === 401 && (token = (await refresh())?.access_token))
        response = await fetch(endpoint('user'), {
            headers: { apikey: deployment.anonKey, Authorization: `Bearer ${token}` },
        });
    if (!stored() || stored().user?.id !== requestedUserId) throw accountChanged();
    if (!response.ok) {
        if (response.status >= 500)
            throw new Error('Authentication service is temporarily unavailable');
        clearCloudSession();
        return null;
    }
    const user = await response.json();
    if (
        !stored() ||
        stored().user?.id !== requestedUserId ||
        (requestedUserId && requestedUserId !== user.id)
    )
        throw accountChanged();
    verifiedUserId = user.id;
    return {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Learner',
        email: user.email,
    };
}
export function clearCloudSession() {
    cached = null;
    cachedRaw = null;
    verifiedUserId = null;
    localStorage.removeItem(storageKey);
}
export async function cloudLogout() {
    const token = await cloudToken();
    if (token)
        await fetch(endpoint('logout'), {
            method: 'POST',
            headers: { ...headers, Authorization: `Bearer ${token}` },
        }).catch(() => {});
    clearCloudSession();
}
