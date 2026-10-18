const fs = require('fs');
const { Client } = require('pg');

const { databaseOptions } = require('../../apps/api/config/environment');
const client = new Client(databaseOptions());

async function run() {
    try {
        await client.connect();
        const res = await client.query(`
      SELECT t.id, t.slug, t.title, t.status, COUNT(p.*) AS passage_count
      FROM reading_tests t
      LEFT JOIN reading_passages p ON p.test_id = t.id
      GROUP BY t.id, t.slug, t.title, t.status
      ORDER BY t.title NULLS LAST
    `);
        if (!res.rows.length) {
            console.log('No reading_tests rows found.');
        } else {
            console.log('reading_tests found:', res.rows.length);
            for (const r of res.rows) {
                console.log(
                    `- ${r.title || r.slug} (slug=${r.slug}, status=${r.status}, passages=${r.passage_count})`,
                );
            }
        }
        await client.end();
    } catch (e) {
        console.error('Error querying DB:', e.message || e);
        process.exit(1);
    }
}

run();
