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

    const container =
        document.getElementById(elementId);

    if (!container) return;

    // 52 weeks × 7 days
    const totalDays = 52 * 7;

    let random = seed;

    function pseudoRandom() {

        random =
            (random * 9301 + 49297) % 233280;

        return random / 233280;
    }

    for (let i = 0; i < totalDays; i++) {

        const cell =
            document.createElement("div");

        cell.classList.add("heat-cell");

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

        const daysAgo =
            totalDays - i - 1;

        const date =
            new Date();

        date.setDate(
            date.getDate() - daysAgo
        );

        const formattedDate =
            date.toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                }
            );

        const exercises =
            level * 2;

        cell.title =
            `${formattedDate} · ${exercises} exercises`;

        container.appendChild(cell);
    }
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

generateHeatmap(
    "heatmap-dsa",
    17
);

generateHeatmap(
    "heatmap-networking",
    41
);

generateHeatmap(
    "heatmap-english",
    83
);
