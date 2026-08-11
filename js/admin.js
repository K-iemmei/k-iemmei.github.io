const functionUrl = 'https://lmqukgeyfmxprgkrujff.supabase.co/functions/v1/admin-sql';

const tokenInput = document.getElementById('adminToken');
const sqlEditor = document.getElementById('sqlEditor');
const runButton = document.getElementById('runSqlButton');
const clearButton = document.getElementById('clearSqlButton');
const messageHost = document.getElementById('adminMessage');
const resultHost = document.getElementById('sqlResult');

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
                'x-admin-token': token
            },
            body: JSON.stringify({ sql })
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error || `Request failed with status ${response.status}`);
        }

        resultHost.textContent = JSON.stringify(data.result ?? data, null, 2);
        resultHost.hidden = false;
        showMessage('SQL executed successfully.', 'success');
    } catch (error) {
        showMessage(error.message || 'Unable to execute SQL.', 'error');
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
