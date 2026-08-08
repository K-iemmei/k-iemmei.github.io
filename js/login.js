```javascript
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const themeToggle = document.getElementById("themeToggle");


// =========================
// Theme
// =========================

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
// Login
// =========================

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    loginMessage.textContent = "";

    // Temporary mock authentication
    // --------------------------------
    // Sau này đoạn này sẽ được thay bằng
    // request tới Supabase Edge Function.

    if (!username || !password) {
        loginMessage.textContent =
            "Please enter your username and password.";

        return;
    }

    // Mock login thành công
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);

    // Chuyển sang Dashboard
    window.location.href = "dashboard.html";
});
```
