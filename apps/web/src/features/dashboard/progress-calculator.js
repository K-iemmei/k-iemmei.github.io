import { englishProgress } from '../../domain/english-tracking.js';

export function normalizeDailyProgress(record = {}) {
    if (
        'reading_submissions' in record ||
        'listening_submissions' in record ||
        'listening_seconds' in record
    ) {
        const { points } = englishProgress(record);
        return { total: points, completed: points, ratio: Math.min(1, points / 3) };
    }
    const totalFromExplicit = Number(
        record.total_count ??
            record.total_exercises ??
            record.total ??
            record.exercise_total ??
            record.goal ??
            0,
    );
    const completedFromExplicit = Number(
        record.correct_count ?? record.completed_exercises ?? record.completed ?? record.done ?? 0,
    );
    const scoreFromExplicit = Number(record.score ?? 0);
    const minutesFromExplicit = Number(record.minutes ?? 0);

    let total = totalFromExplicit || 0;
    let completed = completedFromExplicit || 0;

    if (total === 0 && minutesFromExplicit > 0 && completed <= minutesFromExplicit) {
        total = minutesFromExplicit;
    }

    if (total > 0 && completed === 0 && scoreFromExplicit > 0 && scoreFromExplicit <= 100) {
        completed = Math.round((scoreFromExplicit / 100) * total);
    }

    if (total === 0 && scoreFromExplicit > 0 && scoreFromExplicit <= 100) {
        total = 100;
        completed = scoreFromExplicit;
    }

    const safeTotal = Number.isFinite(total) ? Math.max(0, total) : 0;
    const safeCompleted = Number.isFinite(completed) ? Math.max(0, completed) : 0;
    const ratio = safeTotal > 0 ? Math.min(1, Math.max(0, safeCompleted / safeTotal)) : 0;

    return {
        total: safeTotal,
        completed: safeCompleted,
        ratio,
    };
}
