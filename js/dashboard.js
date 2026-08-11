// =========================
// Theme
// =========================
const isLoggedIn = localStorage.getItem("isLoggedIn"); if (isLoggedIn !== "true") { window.location.href = "index.html"; }
const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.dataset.theme = "dark";
    if (themeToggle) {
        themeToggle.textContent = "☾";
    }
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {

        const isDark =
            document.documentElement.dataset.theme === "dark";

        if (isDark) {

            document.documentElement.removeAttribute("data-theme");

            localStorage.setItem("theme", "light");

            themeToggle.textContent = "☼";

        } else {

            document.documentElement.dataset.theme = "dark";

            localStorage.setItem("theme", "dark");

            themeToggle.textContent = "☾";
        }
    });
}


// =========================
// Supabase dashboard data
// =========================

function normalizeDailyProgress(record = {}) {
    const totalFromExplicit = Number(record.total_count ?? record.total_exercises ?? record.total ?? record.exercise_total ?? record.goal ?? 0);
    const completedFromExplicit = Number(record.correct_count ?? record.completed_exercises ?? record.completed ?? record.done ?? 0);
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
        ratio
    };
}

async function loadDashboardData() {
    const userId = localStorage.getItem("userId");

    if (!userId || !window.supabase || typeof window.supabase.get !== "function") {
        window.dashboardData = { subjects: [], activities: [], chineseActivities: [] };
        return window.dashboardData;
    }

    try {
        const subjects = await window.supabase.get("subjects", {
            select: "id, slug, name, color, description"
        });

        const englishSubject = Array.isArray(subjects)
            ? subjects.find((subject) => String(subject.slug || subject.name || "").toLowerCase() === "english")
            : null;

        const englishSubjectId = englishSubject ? englishSubject.id : null;

        const loadActivity = async (resultTable, fallbackSubjectId = null) => {
            try {
                return await window.supabase.get(resultTable, {
                    select: "*",
                    filters: { user_id: `eq.${userId}` }
                });
            } catch (resultError) {
                if (!fallbackSubjectId) return [];
                try {
                    return await window.supabase.get("subject_daily_activity", {
                        select: "*",
                        filters: {
                            user_id: `eq.${userId}`,
                            subject_id: `eq.${fallbackSubjectId}`
                        }
                    });
                } catch (fallbackError) {
                    return [];
                }
            }
        };

        const [englishActivities, chineseActivities] = await Promise.all([
            loadActivity("english_daily_results", englishSubjectId),
            loadActivity("chinese_daily_results")
        ]);

        window.dashboardData = {
            subjects: Array.isArray(subjects) ? subjects : [],
            activities: Array.isArray(englishActivities) ? englishActivities : [],
            chineseActivities: Array.isArray(chineseActivities) ? chineseActivities : []
        };

        return window.dashboardData;
    } catch (error) {
        console.warn("Unable to load dashboard data from Supabase:", error);
        window.dashboardData = {
            subjects: [],
            activities: [],
            chineseActivities: []
        };
        return window.dashboardData;
    }
}

// =========================
// Generate heatmap
// =========================

function generateHeatmap(elementId, seed, records = []) {

    const container = document.getElementById(elementId);

    if (!container) return;

    const yearSelector = document.getElementById("yearSelector");
    const year = Number(yearSelector?.value || new Date().getFullYear());
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    container.innerHTML = "";

    const labelsRow = document.createElement("div");
    labelsRow.classList.add("months-row");

    const grid = document.createElement("div");
    grid.classList.add("heatmap-grid");

    const cellSize = 10;
    const gap = 3;
    const shouldShowProgress = Number(seed) > 0 || Array.isArray(records) && records.length > 0;
    let random = seed;

    function pseudoRandom() {
        random = (random * 9301 + 49297) % 233280;
        return random / 233280;
    }

    const progressByDate = new Map();
    (Array.isArray(records) ? records : []).forEach((record) => {
        const rawDate = record.activity_date || record.date || record.updated_at || "";
        const dateKey = String(rawDate).slice(0, 10);

        if (!dateKey) return;

        const normalized = normalizeDailyProgress(record);
        if (normalized.total > 0 || normalized.completed > 0) {
            progressByDate.set(dateKey, normalized);
        }
    });

    const monthData = monthNames.map((name, monthIndex) => {
        const firstDay = new Date(year, monthIndex, 1);
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const firstWeekday = firstDay.getDay();
        const weeksInMonth = Math.ceil((firstWeekday + daysInMonth) / 7);

        return {
            name,
            monthIndex,
            firstDay,
            daysInMonth,
            firstWeekday,
            weeksInMonth
        };
    });

    let totalCols = 0;
    monthData.forEach((month) => {
        totalCols += month.weeksInMonth + 1;
    });

    grid.style.setProperty("--cols", totalCols);
    labelsRow.style.width = `${totalCols * (cellSize + gap) - gap}px`;

    let currentColumn = 1;

    monthData.forEach((month) => {
        const monthLabel = document.createElement("span");
        monthLabel.classList.add("month-label");
        monthLabel.textContent = month.name;
        const monthWidth = month.weeksInMonth * (cellSize + gap);
        monthLabel.style.left = `${(currentColumn - 1) * (cellSize + gap) + monthWidth / 2}px`;
        labelsRow.appendChild(monthLabel);

        for (let week = 0; week < month.weeksInMonth; week++) {
            for (let day = 0; day < 7; day++) {
                const date = new Date(year, month.monthIndex, 1 + week * 7 + day - month.firstWeekday);
                const isCurrentMonth = date.getFullYear() === year && date.getMonth() === month.monthIndex;

                if (!isCurrentMonth) {
                    continue;
                }

                const cell = document.createElement("div");
                cell.classList.add("heat-cell");
                cell.style.gridColumn = String(currentColumn + week);
                cell.style.gridRow = String(day + 1);

                const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                const dailyProgress = progressByDate.get(dateKey) || null;

                if (!dailyProgress || dailyProgress.total <= 0) {
                    cell.classList.add("heat-empty");
                    cell.title = `${date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} · 0/0 exercises`;
                    grid.appendChild(cell);
                    continue;
                }

                let level = 0;
                if (dailyProgress.ratio >= 0.75) {
                    level = 4;
                } else if (dailyProgress.ratio >= 0.5) {
                    level = 3;
                } else if (dailyProgress.ratio >= 0.25) {
                    level = 2;
                } else if (dailyProgress.ratio > 0) {
                    level = 1;
                }

                if (level > 0) {
                    cell.classList.add(`level-${level}`);
                } else {
                    cell.classList.add("heat-empty");
                }

                const formattedDate = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                });

                cell.title = `${formattedDate} · ${dailyProgress.completed}/${dailyProgress.total} exercises`;
                grid.appendChild(cell);
            }
        }

        currentColumn += month.weeksInMonth + 1;
    });

    if (!shouldShowProgress && !records.length) {
        const allCells = grid.querySelectorAll(".heat-cell");
        allCells.forEach((cell) => {
            cell.classList.add("heat-empty");
        });
    }

    container.appendChild(labelsRow);
    container.appendChild(grid);
}
// =========================
// User
// =========================

const username =
    localStorage.getItem("username") || JSON.parse(localStorage.getItem("user") || "null")?.name || "User";

const usernameDisplay =
    document.getElementById("usernameDisplay");

const topAvatar =
    document.querySelector(".top-avatar");

if (usernameDisplay) {
    usernameDisplay.textContent = username;
}

if (topAvatar) {
    topAvatar.textContent = username.trim().charAt(0).toUpperCase() || "U";
    topAvatar.title = `Log out ${username}`;
}


// =========================
// Logout
// =========================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", () => {

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");

        window.location.href = "index.html";
    });
}



// =========================
// Create heatmaps
// =========================

function refreshHeatmaps() {
    const englishRecords = (window.dashboardData && Array.isArray(window.dashboardData.activities))
        ? window.dashboardData.activities
        : [];
    const chineseRecords = (window.dashboardData && Array.isArray(window.dashboardData.chineseActivities))
        ? window.dashboardData.chineseActivities
        : [];

    generateHeatmap("heatmap-english", 0, englishRecords);
    generateHeatmap("heatmap-chinese", 0, chineseRecords);
    updateActivitySummary([...englishRecords, ...chineseRecords]);
}

function updateActivitySummary(records = []) {
    const year = Number(document.getElementById("yearSelector")?.value || new Date().getFullYear());
    const yearRecords = records
        .map((record) => ({
            record,
            date: String(record.activity_date || record.date || record.updated_at || "").slice(0, 10),
            progress: normalizeDailyProgress(record)
        }))
        .filter((entry) => entry.date.startsWith(`${year}-`) && entry.progress.total > 0);

    const activeDates = [...new Set(yearRecords.map((entry) => entry.date))].sort();
    const activeDaysHost = document.getElementById("activeDaysValue");
    const streakHost = document.getElementById("dayStreakValue");
    const averageScoreHost = document.getElementById("averageScoreValue");

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

    const averagePercent = totalExercises > 0
        ? Math.round((totalCorrect / totalExercises) * 100)
        : 0;

    if (activeDaysHost) activeDaysHost.textContent = String(activeDates.length);
    if (streakHost) streakHost.textContent = String(streak);
    if (averageScoreHost) averageScoreHost.textContent = `${Math.round(totalCorrect)}/${Math.round(totalExercises)} (${averagePercent}%)`;
}

const yearSelector = document.getElementById("yearSelector");

if (yearSelector) {
    yearSelector.addEventListener("change", refreshHeatmaps);
}

const subjectCards = document.querySelectorAll('[data-go]');
subjectCards.forEach((card) => {
    card.addEventListener('click', () => {
        window.location.href = card.dataset.go;
    });
});

async function initializeDashboard() {
    await loadDashboardData();
    refreshHeatmaps();
}

initializeDashboard();
