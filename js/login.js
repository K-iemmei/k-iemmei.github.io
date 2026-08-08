const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const themeToggle = document.getElementById("themeToggle");


// =========================
// Theme
// =========================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.dataset.theme = "dark";
    if (themeToggle) {
        themeToggle.textContent = "☾";
    }
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isDark = document.documentElement.dataset.theme === "dark";

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
// Login
// =========================

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    loginMessage.textContent = "";

    if (!username || !password) {
        loginMessage.textContent = "Please enter your username and password.";
        return;
    }

    try {
        if (!window.supabase || typeof window.supabase.loginUser !== "function") {
            throw new Error("Supabase client is not initialized.");
        }

        const user = await window.supabase.loginUser(username, password);

        if (!user) {
            loginMessage.textContent = "Invalid username or password.";
            return;
        }

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", user.name || user.username);
        localStorage.setItem("userId", String(user.id));
        localStorage.setItem("user", JSON.stringify(user));

        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("Login error:", error);
        loginMessage.textContent = "Unable to connect to the database. Please check Supabase config.";
    }
});
