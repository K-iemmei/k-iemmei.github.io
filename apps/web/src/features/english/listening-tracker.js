import { apiRequest } from '../../core/database-client.js';
import { trackingDate } from '../../domain/english-tracking.js';

const tabId = crypto.randomUUID();
const prefix = () => `listening-activity:${localStorage.getItem('userId')}:`;
const storageKey = () => prefix() + tabId;
const memory = new Map();
const memoryOnly = new Set();
function read(key) {
    if (memoryOnly.has(key)) return memory.get(key) || [];
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
        return memory.get(key) || [];
    }
}
function write(key, events) {
    memory.set(key, events);
    try {
        if (events.length) localStorage.setItem(key, JSON.stringify(events));
        else localStorage.removeItem(key);
        memoryOnly.delete(key);
    } catch {
        memoryOnly.add(key);
    }
}
let flushing;
export function flushListeningActivity() {
    if (flushing) return flushing;
    flushing = (async () => {
        const keys = new Set([...memory.keys()].filter((key) => key.startsWith(prefix())));
        try {
            for (let index = 0; index < localStorage.length; index++) {
                const key = localStorage.key(index);
                if (key?.startsWith(prefix())) keys.add(key);
            }
        } catch {
            /* Use the memory queue when storage is blocked. */
        }
        for (const key of keys)
            while (true) {
                const batch = read(key).slice(0, 100);
                if (!batch.length) break;
                await apiRequest('/api/tracking/listening', {
                    method: 'POST',
                    body: JSON.stringify({ events: batch }),
                    keepalive: true,
                });
                const saved = new Set(batch.map((event) => event.id));
                write(
                    key,
                    read(key).filter((event) => !saved.has(event.id)),
                );
            }
    })().finally(() => {
        flushing = null;
    });
    return flushing;
}

// Count elapsed playback, never currentTime jumps caused by seeking.
export function createPlaybackClock(now = () => Date.now()) {
    let started = null;
    return {
        start() {
            if (started === null) started = now();
        },
        take(continuing = false) {
            const end = now();
            const events = [];
            if (started !== null && end > started) {
                // Split at midnight in Bangkok, including playback in a background tab.
                let cursor = started;
                while (cursor < end) {
                    const date = trackingDate(cursor);
                    const midnight = Date.parse(`${date}T00:00:00+07:00`) + 86400000;
                    const until = Math.min(end, midnight, cursor + 300000);
                    events.push({ activity_date: date, seconds: (until - cursor) / 1000 });
                    cursor = until;
                }
            }
            started = continuing && started !== null ? end : null;
            return events;
        },
    };
}

export function trackListeningAudio(audio) {
    const key = storageKey();
    const clock = createPlaybackClock();
    const status = document.getElementById('listeningTrackingStatus');
    const sync = () =>
        flushListeningActivity()
            .then(() => {
                if (status)
                    status.textContent = 'Listening time saved. Only audio playback counts.';
            })
            .catch(() => {
                if (status)
                    status.textContent =
                        'Listening time pending sync. Keep this browser data to retry.';
            });
    function capture(continuing = false) {
        const events = clock
            .take(continuing)
            .map((event) => ({ ...event, id: crypto.randomUUID() }));
        if (events.length) write(key, [...read(key), ...events]);
        sync();
    }
    audio.addEventListener('playing', () => clock.start());
    for (const event of ['pause', 'ended', 'waiting', 'seeking', 'error', 'emptied'])
        audio.addEventListener(event, () => capture());
    audio.addEventListener('seeked', () => {
        if (!audio.paused && !audio.ended && audio.readyState >= 3) clock.start();
    });
    setInterval(
        () => capture(!audio.paused && !audio.ended && !audio.seeking && audio.readyState >= 3),
        15000,
    );
    document.addEventListener('visibilitychange', () => {
        if (document.hidden)
            capture(!audio.paused && !audio.ended && !audio.seeking && audio.readyState >= 3);
    });
    window.addEventListener('pagehide', () => capture());
    window.addEventListener('online', sync);
    sync();
}
