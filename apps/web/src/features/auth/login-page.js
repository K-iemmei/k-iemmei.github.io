import { database } from '../../core/database-client.js';
import { saveSession } from '../../core/session-storage.js';
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    loginMessage.textContent = '';

    if (!username || !password) {
        loginMessage.textContent = 'Please enter your username and password.';
        return;
    }

    try {
        if (!database || typeof database.loginUser !== 'function') {
            throw new Error('Database client is not initialized.');
        }

        const user = await database.loginUser(username, password);

        if (!user) {
            loginMessage.textContent = 'Invalid username or password.';
            return;
        }

        saveSession(user);

        window.location.href = 'home.html';
    } catch (error) {
        console.error('Login error:', error);
        loginMessage.textContent =
            error.message || 'Unable to connect to the authentication service.';
    }
});
