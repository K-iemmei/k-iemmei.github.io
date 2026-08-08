// =========================
// Theme
// =========================
const isLoggedIn = localStorage.getItem("isLoggedIn"); if (isLoggedIn !== "true") { window.location.href = "index.html"; }
const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.dataset.theme = "dark";
    themeToggle.textContent = "☾";
}

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


// =========================
// Generate heatmap
// =========================

function generateHeatmap(elementId, seed) {

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
    let random = seed;

    function pseudoRandom() {
        random = (random * 9301 + 49297) % 233280;
        return random / 233280;
    }

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
                const cell = document.createElement("div");
                cell.classList.add("heat-cell");
                cell.style.gridColumn = String(currentColumn + week);
                cell.style.gridRow = String(day + 1);

                const isCurrentMonth = date.getFullYear() === year && date.getMonth() === month.monthIndex;

                if (!isCurrentMonth) {
                    cell.classList.add("heat-empty");
                    grid.appendChild(cell);
                    continue;
                }

                const value = pseudoRandom();
                let level = 0;

                if (value > 0.80) {
                    level = 4;
                } else if (value > 0.62) {
                    level = 3;
                } else if (value > 0.40) {
                    level = 2;
                } else if (value > 0.20) {
                    level = 1;
                }

                if (level > 0) {
                    cell.classList.add(`level-${level}`);
                }

                const formattedDate = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                });

                const exercises = level * 2;
                cell.title = `${formattedDate} · ${exercises} exercises`;
                grid.appendChild(cell);
            }
        }

        currentColumn += month.weeksInMonth + 1;
    });

    container.appendChild(labelsRow);
    container.appendChild(grid);
}
// =========================
// User
// =========================

const username =
    localStorage.getItem("username");

const usernameDisplay =
    document.getElementById("usernameDisplay");

if (username) {
    usernameDisplay.textContent = username;
}


// =========================
// Logout
// =========================

const logoutButton =
    document.getElementById("logoutButton");

logoutButton.addEventListener("click", () => {

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");

    window.location.href = "index.html";
});



// =========================
// Create heatmaps
// =========================

function refreshHeatmaps() {
    generateHeatmap("heatmap-dsa", 17);
    generateHeatmap("heatmap-networking", 41);
    generateHeatmap("heatmap-english", 83);
}

const yearSelector = document.getElementById("yearSelector");

if (yearSelector) {
    yearSelector.addEventListener("change", refreshHeatmaps);
}

refreshHeatmaps();
