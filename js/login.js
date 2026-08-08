const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const themeToggle = document.getElementById("themeToggle");


// =========================
// Theme
// =========================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.dataset.theme = "dark";
}

themeToggle.addEventListener("click", () => {
    const isDark =
        document.documentElement.dataset.theme === "dark";

    if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
    } else {
        document.documentElement.dataset.theme = "dark";
        localStorage.setItem("theme", "dark");
    }
});


// =========================
// Login
// =========================

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    loginMessage.textContent = "";

    console.log("Username:", username);
    console.log("Password:", password);

    loginMessage.textContent =
        "Login system is not connected yet.";
});
