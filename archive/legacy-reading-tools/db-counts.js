const fs = require('fs');
const { Client } = require('pg');

const { databaseOptions } = require('../../apps/api/config/environment');
const client = new Client(databaseOptions());

async function run() {
    try {
        await client.connect();
        const g = await client.query('SELECT COUNT(*)::int AS cnt FROM reading_question_groups');
        const q = await client.query('SELECT COUNT(*)::int AS cnt FROM reading_questions');
        console.log('reading_question_groups:', g.rows[0].cnt);
        console.log('reading_questions:', q.rows[0].cnt);
        await client.end();
    } catch (e) {
        console.error('Error:', e.message || e);
        process.exit(1);
    }
}
run();
