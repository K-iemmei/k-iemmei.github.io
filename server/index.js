const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// GET /api/tests - list tests
app.get('/api/tests', async (req, res) => {
  try {
    const r = await db.query('SELECT id, slug, title, source_name, source_url, status FROM reading_tests ORDER BY created_at DESC');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db' });
  }
});

// GET /api/tests/:slug - return test with passages, groups, questions
app.get('/api/tests/:slug', async (req, res) => {
  const slug = req.params.slug;
  try {
    const testR = await db.query('SELECT id, slug, title, source_name, source_url, status FROM reading_tests WHERE slug = $1', [slug]);
    if (testR.rowCount === 0) return res.status(404).json({ error: 'not_found' });
    const test = testR.rows[0];

    const passagesR = await db.query('SELECT id, passage_order, title, content, word_count FROM reading_passages WHERE test_id = $1 ORDER BY passage_order', [test.id]);
    const passages = [];
    for (const p of passagesR.rows) {
      const groupsR = await db.query('SELECT id, group_order, question_type, instruction, options, settings FROM reading_question_groups WHERE passage_id = $1 ORDER BY group_order', [p.id]);
      const groups = [];
      for (const g of groupsR.rows) {
        const qsR = await db.query('SELECT id, question_number, prompt, answer_key, explanation, points, metadata FROM reading_questions WHERE group_id = $1 ORDER BY question_number', [g.id]);
        groups.push({ ...g, questions: qsR.rows });
      }
      passages.push({ ...p, groups });
    }

    test.passages = passages;
    res.json(test);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db' });
  }
});

// Simple health
app.get('/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
