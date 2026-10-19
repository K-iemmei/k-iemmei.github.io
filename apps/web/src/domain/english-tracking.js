export function trackingDate(value = new Date()) {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(value));
}

export function englishProgress(record = {}) {
    const safe = (value) => (Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0);
    const reading = safe(record.reading_submissions);
    const listening = safe(record.listening_submissions);
    const minutes = safe(record.listening_seconds) / 60;
    const points = reading + listening + minutes / 10;
    return {
        reading,
        listening,
        minutes,
        points,
        level: points <= 0 ? 0 : points < 1 ? 1 : points < 2 ? 2 : points < 3 ? 3 : 4,
    };
}

export function leaderboardDate(value = trackingDate()) {
    if (
        typeof value !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        !Number.isFinite(Date.parse(value)) ||
        new Date(value).toISOString().slice(0, 10) !== value
    )
        throw Object.assign(new Error('Invalid leaderboard date'), { status: 400 });
    return value;
}

export function validateListeningBatch(body) {
    const rows = body?.events;
    const invalid = () => {
        throw Object.assign(new Error('Invalid listening activity'), { status: 400 });
    };
    if (!Array.isArray(rows) || rows.length < 1 || rows.length > 100) invalid();
    return rows.map((row) => {
        if (
            !row ||
            !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(row.id || '') ||
            !/^\d{4}-\d{2}-\d{2}$/.test(row.activity_date || '') ||
            !Number.isFinite(Date.parse(row.activity_date)) ||
            new Date(row.activity_date).toISOString().slice(0, 10) !== row.activity_date ||
            typeof row.seconds !== 'number' ||
            !Number.isFinite(row.seconds) ||
            row.seconds <= 0 ||
            row.seconds > 300 ||
            row.activity_date > trackingDate()
        )
            invalid();
        return { id: row.id, activity_date: row.activity_date, seconds: row.seconds };
    });
}
