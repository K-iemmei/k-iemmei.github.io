// Small, best-effort tab cache. Only public feeds and account-keyed preferences use it.
const prefix = 'my-note-cache:v1:';
const pending = new Map();
export function readCache(key, maxAge) {
    try {
        const entry = JSON.parse(sessionStorage.getItem(prefix + key) || 'null');
        const age = Date.now() - entry?.time;
        return entry && age >= 0 && age < maxAge ? entry.data : null;
    } catch {
        return null;
    }
}
export function writeCache(key, data) {
    try {
        sessionStorage.setItem(prefix + key, JSON.stringify({ time: Date.now(), data }));
    } catch {
        /* A full or disabled cache must not prevent loading live data. */
    }
}
export function cachedLoad(key, loader, { maxAge, force = false } = {}) {
    if (!force) {
        const value = readCache(key, maxAge);
        if (value !== null) return Promise.resolve(value);
    }
    if (pending.has(key)) return pending.get(key);
    const request = Promise.resolve()
        .then(loader)
        .then((data) => {
            writeCache(key, data);
            return data;
        })
        .finally(() => pending.delete(key));
    pending.set(key, request);
    return request;
}
export function clearPreferenceCache() {
    try {
        for (let index = sessionStorage.length - 1; index >= 0; index--) {
            const key = sessionStorage.key(index);
            if (key?.startsWith(prefix + 'home-preferences:')) sessionStorage.removeItem(key);
        }
    } catch {
        /* Storage can be unavailable. */
    }
}
