import { ENGLISH_SCRIPT, CHINESE_SCRIPT } from './sql-templates.js';
const functionUrl = '/api/admin/sql';

const tokenInput = document.getElementById('adminToken');
const sqlEditor = document.getElementById('sqlEditor');
const runButton = document.getElementById('runSqlButton');
const clearButton = document.getElementById('clearSqlButton');
const messageHost = document.getElementById('adminMessage');
const resultHost = document.getElementById('sqlResult');

// Recommended script templates
// Wire recommended script UI
const engPre = document.getElementById('engPre');
const chiPre = document.getElementById('chiPre');
const engInsert = document.getElementById('engInsert');
const chiInsert = document.getElementById('chiInsert');
const engCopy = document.getElementById('engCopy');
const chiCopy = document.getElementById('chiCopy');

// Populate pre blocks
if (engPre) engPre.textContent = ENGLISH_SCRIPT;
if (chiPre) chiPre.textContent = CHINESE_SCRIPT;

function copyText(text) {
    if (!navigator.clipboard) {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        return;
    }
    navigator.clipboard.writeText(text).catch(() => {});
}

if (engInsert)
    engInsert.addEventListener('click', () => {
        sqlEditor.value = ENGLISH_SCRIPT;
        sqlEditor.focus();
    });
if (chiInsert)
    chiInsert.addEventListener('click', () => {
        sqlEditor.value = CHINESE_SCRIPT;
        sqlEditor.focus();
    });
if (engCopy)
    engCopy.addEventListener('click', () => {
        copyText(ENGLISH_SCRIPT);
        showMessage('English script copied to clipboard.', 'success');
    });
if (chiCopy)
    chiCopy.addEventListener('click', () => {
        copyText(CHINESE_SCRIPT);
        showMessage('Chinese script copied to clipboard.', 'success');
    });

function showMessage(message, type = 'info') {
    messageHost.textContent = message;
    messageHost.className = `admin-message ${type}`;
}

runButton.addEventListener('click', async () => {
    const token = tokenInput.value.trim();
    const sql = sqlEditor.value.trim();

    if (!token || !sql) {
        showMessage('Enter the admin token and SQL script first.', 'error');
        return;
    }

    runButton.disabled = true;
    resultHost.hidden = true;
    showMessage('Running SQL...', 'info');

    try {
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-token': token,
            },
            body: JSON.stringify({ sql }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || `Request failed with status ${response.status}`);
        }

        resultHost.textContent = JSON.stringify(data.result ?? data, null, 2);
        resultHost.hidden = false;
        showMessage('SQL executed successfully.', 'success');
    } catch (error) {
        const message =
            error instanceof TypeError && error.message === 'Failed to fetch'
                ? 'Cannot reach the Edge Function. Deploy admin-sql and check CORS/function URL.'
                : error.message || 'Unable to execute SQL.';
        showMessage(message, 'error');
    } finally {
        runButton.disabled = false;
    }
});

clearButton.addEventListener('click', () => {
    sqlEditor.value = '';
    resultHost.textContent = '';
    resultHost.hidden = true;
    showMessage('', 'info');
});
