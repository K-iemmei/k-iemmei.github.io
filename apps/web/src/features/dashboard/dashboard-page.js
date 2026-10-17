import { normalizeDailyProgress } from './progress-calculator.js';
import { generateHeatmap } from './heatmap-renderer.js';
import { loadDashboardData, loadLeaderboard } from './dashboard-repository.js';
import { clearSession } from '../../core/session-storage.js';
import { escapeHtml } from '../../shared/escape-html.js';
import { database } from '../../core/database-client.js';
import { englishProgress, trackingDate } from '../../domain/english-tracking.js';
let dashboardData = {};

// =========================
// User
// =========================

const username =
    localStorage.getItem('username') ||
    JSON.parse(localStorage.getItem('user') || 'null')?.name ||
    'User';

const usernameDisplay = document.getElementById('usernameDisplay');
const sidebarUserName = document.getElementById('sidebarUserName');
if (sidebarUserName) sidebarUserName.textContent = username;

const topAvatar = document.querySelector('.top-avatar');

const greetingTitle = document.getElementById('greetingTitle');

const currentDateDisplay = document.getElementById('currentDateDisplay');

if (usernameDisplay) {
    usernameDisplay.textContent = username;
}

if (topAvatar) {
    topAvatar.textContent = username.trim().charAt(0).toUpperCase() || 'U';
    topAvatar.title = username;
}

if (currentDateDisplay) {
    currentDateDisplay.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

async function loadDashboardUserName() {
    const userId = localStorage.getItem('userId');
    if (!userId || !database || typeof database.get !== 'function') return;

    try {
        const rows = await database.get('users', {
            select: 'name',
            filters: { id: `eq.${userId}` },
        });
        const databaseName = Array.isArray(rows) ? rows[0]?.name : null;
        if (!databaseName) return;

        if (greetingTitle) greetingTitle.textContent = `Hello ${databaseName}`;
        if (usernameDisplay) usernameDisplay.textContent = databaseName;
        if (sidebarUserName) sidebarUserName.textContent = databaseName;
        if (topAvatar) {
            topAvatar.textContent = String(databaseName).trim().charAt(0).toUpperCase() || 'U';
            topAvatar.title = databaseName;
        }
    } catch (error) {
        console.warn('Unable to load dashboard user name:', error);
    }
}

// =========================
// Logout
// =========================

const logoutButton = document.getElementById('logoutButton');

if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        logoutButton.disabled = true;
        try {
            await clearSession();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Unable to log out:', error);
            logoutButton.disabled = false;
            logoutButton.title = 'Could not log out. Try again.';
        }
    });
}

// =========================
// Create heatmaps & Quest progress
// =========================

function refreshHeatmaps() {
    const englishRecords =
        dashboardData && Array.isArray(dashboardData.activities) ? dashboardData.activities : [];
    const chineseRecords =
        dashboardData && Array.isArray(dashboardData.chineseActivities)
            ? dashboardData.chineseActivities
            : [];

    const year = Number(document.getElementById('yearSelector')?.value || new Date().getFullYear());

    // Filter year active counts
    const countActiveDays = (records) => {
        const activeDates = new Set();
        records.forEach((record) => {
            const date = String(
                record.activity_date || record.date || record.updated_at || '',
            ).slice(0, 10);
            const progress = normalizeDailyProgress(record);
            if (date.startsWith(`${year}-`) && (progress.total > 0 || progress.completed > 0)) {
                activeDates.add(date);
            }
        });
        return activeDates.size;
    };

    const englishDays = countActiveDays(englishRecords);
    const chineseDays = countActiveDays(chineseRecords);

    const engBadge = document.getElementById('englishActiveDaysBadge');
    const chiBadge = document.getElementById('chineseActiveDaysBadge');
    if (engBadge) engBadge.textContent = `${englishDays} ACTIVE DAYS`;
    if (chiBadge) chiBadge.textContent = `${chineseDays} ACTIVE DAYS`;

    generateHeatmap('heatmap-english', 0, englishRecords);
    renderEnglishLog(englishRecords, year);
    generateHeatmap('heatmap-chinese', 0, chineseRecords);
    updateActivitySummary([...englishRecords, ...chineseRecords]);
    updateTodayQuestTracker(englishRecords, chineseRecords);
}

function renderEnglishLog(records, year) {
    const host = document.getElementById('englishTrackingSummary');
    const rows = document.getElementById('englishTrackingRows');
    if (!host || !rows) return;
    if (dashboardData.englishTrackingError) {
        host.textContent = 'Unable to load English log. Reload to retry.';
        rows.replaceChildren();
        return;
    }
    const selected = records.filter((record) => record.activity_date.startsWith(`${year}-`));
    const total = selected.reduce(
        (sum, record) => {
            const progress = englishProgress(record);
            return {
                reading: sum.reading + progress.reading,
                minutes: sum.minutes + progress.minutes,
            };
        },
        { reading: 0, minutes: 0 },
    );
    host.textContent = `${year}: ${total.reading} Reading submissions · ${total.minutes.toFixed(1)} Listening minutes`;
    rows.innerHTML =
        selected
            .sort((a, b) => b.activity_date.localeCompare(a.activity_date))
            .map((record) => {
                const progress = englishProgress(record);
                return `<tr><th scope="row">${escapeHtml(record.activity_date)}</th><td>${progress.reading}</td><td>${progress.minutes.toFixed(1)}</td><td>${progress.points.toFixed(1)}</td></tr>`;
            })
            .join('') || '<tr><td colspan="4">No activity recorded for this year.</td></tr>';
}

function updateTodayQuestTracker(englishRecords = [], chineseRecords = []) {
    const today = new Date().toISOString().slice(0, 10);

    const isDone = (records) =>
        records.some((r) => {
            const d = String(r.activity_date || r.date || r.updated_at || '').slice(0, 10);
            const p = normalizeDailyProgress(r);
            return d === today && (p.completed > 0 || p.total > 0);
        });

    const englishDone = isDone(englishRecords);
    const chineseDone = isDone(chineseRecords);

    let completedCount = 0;
    if (englishDone) completedCount += 1;
    if (chineseDone) completedCount += 1;

    const countHost = document.getElementById('questProgressCount');
    const barHost = document.getElementById('questProgressBar');
    const engDot = document.getElementById('englishStatusDot');
    const chiDot = document.getElementById('chineseStatusDot');

    if (countHost) countHost.textContent = `${completedCount} / 2 DONE`;
    if (barHost) barHost.style.width = `${(completedCount / 2) * 100}%`;

    if (engDot) engDot.className = `status-dot ${englishDone ? 'active' : ''}`;
    if (chiDot) chiDot.className = `status-dot ${chineseDone ? 'active' : ''}`;
}

function updateActivitySummary(records = []) {
    const year = Number(document.getElementById('yearSelector')?.value || new Date().getFullYear());
    const yearRecords = records
        .map((record) => ({
            record,
            date: String(record.activity_date || record.date || record.updated_at || '').slice(
                0,
                10,
            ),
            progress: normalizeDailyProgress(record),
        }))
        .filter((entry) => entry.date.startsWith(`${year}-`) && entry.progress.total > 0);

    const activeDates = [...new Set(yearRecords.map((entry) => entry.date))].sort();
    const activeDaysHost = document.getElementById('activeDaysValue');
    const streakHost = document.getElementById('dayStreakValue');
    const averageScoreHost = document.getElementById('averageScoreValue');

    let totalCorrect = 0;
    let totalExercises = 0;
    yearRecords.forEach((entry) => {
        totalCorrect += entry.progress.completed;
        totalExercises += entry.progress.total;
    });

    let streak = 0;
    if (activeDates.length > 0) {
        const dateToNumber = (date) => Date.parse(`${date}T00:00:00`);
        let cursor = dateToNumber(activeDates[activeDates.length - 1]);
        for (let index = activeDates.length - 1; index >= 0; index -= 1) {
            if (dateToNumber(activeDates[index]) !== cursor) break;
            streak += 1;
            cursor -= 86400000;
        }
    }

    const averagePercent =
        totalExercises > 0 ? Math.round((totalCorrect / totalExercises) * 100) : 0;

    if (activeDaysHost) activeDaysHost.textContent = String(activeDates.length);
    if (streakHost) streakHost.textContent = String(streak);
    if (averageScoreHost)
        averageScoreHost.textContent = `${Math.round(totalCorrect)}/${Math.round(totalExercises)} (${averagePercent}%)`;
}

const yearSelector = document.getElementById('yearSelector');

if (yearSelector) {
    yearSelector.addEventListener('change', refreshHeatmaps);
}

const subjectCards = document.querySelectorAll('[data-go]');
subjectCards.forEach((card) => {
    card.addEventListener('click', () => {
        window.location.href = card.dataset.go;
    });
});

// =========================
// Leaderboard
// =========================

function renderLeaderboard(leaderboard) {
    const listHost = document.getElementById('leaderboardList');
    if (!listHost) return;
    if (!leaderboard.length) {
        listHost.textContent = 'No users yet.';
        return;
    }
    const currentUser = localStorage.getItem('userId');
    listHost.innerHTML = leaderboard
        .map((user) => {
            const rank = Number(user.rank);
            const rankClass =
                rank === 1 ? 'first' : rank === 2 ? 'second' : rank === 3 ? 'third' : '';
            const points = Number(user.points);
            const label =
                points > 0 && points < 0.01
                    ? '&lt;0.01'
                    : points.toLocaleString('en-US', { maximumFractionDigits: 2 });
            const own = user.user_id === currentUser;
            const detail =
                Number(user.reading_submissions) +
                ' Reading submits · ' +
                (Number(user.listening_seconds) / 60).toFixed(1) +
                ' Listening min';
            return (
                '<div class="leaderboard-item pixel-rank-item' +
                (own ? ' leaderboard-self' : '') +
                '" title="' +
                escapeHtml(detail) +
                '">' +
                '<span class="leaderboard-rank ' +
                rankClass +
                '">' +
                rank +
                '</span>' +
                '<span class="leaderboard-name">' +
                escapeHtml(user.name) +
                (own ? ' (you)' : '') +
                '</span>' +
                '<span class="leaderboard-streak">' +
                label +
                ' pts</span></div>'
            );
        })
        .join('');
}

const leaderboardDateInput = document.getElementById('leaderboardDate');
if (leaderboardDateInput) leaderboardDateInput.value = trackingDate();
let leaderboardRequest = 0;
async function refreshLeaderboard() {
    const list = document.getElementById('leaderboardList');
    const status = document.getElementById('leaderboardStatus');
    if (!list || !leaderboardDateInput) return;
    const request = ++leaderboardRequest;
    list.setAttribute('aria-busy', 'true');
    try {
        const users = await loadLeaderboard(leaderboardDateInput.value);
        if (request !== leaderboardRequest) return;
        renderLeaderboard(users);
        if (status)
            status.textContent =
                leaderboardDateInput.value + ' · UTC+7 · ' + users.length + ' users';
    } catch (error) {
        if (request !== leaderboardRequest) return;
        console.warn('Unable to load Hall of Fame:', error);
        list.textContent = 'Unable to load users. Use Refresh to retry.';
        if (status) status.textContent = 'Hall of Fame unavailable';
    } finally {
        if (request === leaderboardRequest) list.removeAttribute('aria-busy');
    }
}
leaderboardDateInput?.addEventListener('change', refreshLeaderboard);
document.getElementById('leaderboardRefresh')?.addEventListener('click', refreshLeaderboard);
setInterval(() => {
    if (!document.hidden) refreshLeaderboard();
}, 60000);
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refreshLeaderboard();
});

async function initializeDashboard() {
    // Hall of Fame loads independently so a failed personal log cannot block the user list.
    const leaderboard = refreshLeaderboard();
    [dashboardData] = await Promise.all([loadDashboardData(), loadDashboardUserName()]);
    refreshHeatmaps();
    await leaderboard;
}

initializeDashboard();
