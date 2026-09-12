const functionUrl = 'https://lmqukgeyfmxprgkrujff.supabase.co/functions/v1/admin-sql';

const tokenInput = document.getElementById('adminToken');
const sqlEditor = document.getElementById('sqlEditor');
const runButton = document.getElementById('runSqlButton');
const clearButton = document.getElementById('clearSqlButton');
const messageHost = document.getElementById('adminMessage');
const resultHost = document.getElementById('sqlResult');

// Recommended script templates
const ENGLISH_SCRIPT = `-- SAFE daily-update script for English + Chinese
-- Purpose: upsert daily lessons while preserving historical daily submissions for heatmap.

-- 1) Backups (non-destructive)
CREATE TABLE IF NOT EXISTS english_daily_results_backup AS TABLE public.english_daily_results WITH NO DATA;
INSERT INTO english_daily_results_backup SELECT * FROM public.english_daily_results WHERE NOT EXISTS (SELECT 1 FROM english_daily_results_backup b WHERE b.id = public.english_daily_results.id);

CREATE TABLE IF NOT EXISTS chinese_daily_results_backup AS TABLE public.chinese_daily_results WITH NO DATA;
INSERT INTO chinese_daily_results_backup SELECT * FROM public.chinese_daily_results WHERE NOT EXISTS (SELECT 1 FROM chinese_daily_results_backup b WHERE b.id = public.chinese_daily_results.id);

-- 2) Ensure per-day aggregate tables exist
CREATE TABLE IF NOT EXISTS public.english_daily_results_per_day (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  activity_date DATE NOT NULL,
  correct_count INTEGER NOT NULL DEFAULT 0,
  total_count INTEGER NOT NULL DEFAULT 0,
  score_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, activity_date)
);

CREATE TABLE IF NOT EXISTS public.chinese_daily_results_per_day (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  activity_date DATE NOT NULL,
  correct_count INTEGER NOT NULL DEFAULT 0,
  total_count INTEGER NOT NULL DEFAULT 0,
  score_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, activity_date)
);

-- 3) Populate / refresh historical aggregates (idempotent)
INSERT INTO public.english_daily_results_per_day (user_id, activity_date, correct_count, total_count, score_percent, submitted_at)
SELECT ua.user_id, DATE(ua.submitted_at) AS activity_date,
       SUM((ua.is_correct::int)) AS correct_count,
       COUNT(*) AS total_count,
       ROUND(100.0 * SUM((ua.is_correct::int)) / NULLIF(COUNT(*),0), 2) AS score_percent,
       NOW()
FROM (
  SELECT user_id, submitted_at, is_correct FROM public.english_user_answers
  UNION ALL
  SELECT user_id, submitted_at, is_correct FROM public.english_listening_user_answers
) ua
GROUP BY ua.user_id, DATE(ua.submitted_at)
ON CONFLICT (user_id, activity_date) DO UPDATE
  SET correct_count = EXCLUDED.correct_count,
      total_count = EXCLUDED.total_count,
      score_percent = EXCLUDED.score_percent,
      submitted_at = NOW();

INSERT INTO public.chinese_daily_results_per_day (user_id, activity_date, correct_count, total_count, score_percent, submitted_at)
SELECT ua.user_id, DATE(ua.submitted_at) AS activity_date,
       SUM((ua.is_correct::int)) AS correct_count,
       COUNT(*) AS total_count,
       ROUND(100.0 * SUM((ua.is_correct::int)) / NULLIF(COUNT(*),0), 2) AS score_percent,
       NOW()
FROM (
  SELECT user_id, submitted_at, is_correct FROM public.chinese_user_answers
) ua
GROUP BY ua.user_id, DATE(ua.submitted_at)
ON CONFLICT (user_id, activity_date) DO UPDATE
  SET correct_count = EXCLUDED.correct_count,
      total_count = EXCLUDED.total_count,
      score_percent = EXCLUDED.score_percent,
      submitted_at = NOW();

-- 4) Upsert English lesson for a specific date and replace its sections/questions
-- Replace DATE and PASTE_FULL_PASSAGE_HERE before running

-- upsert lesson row (by lesson_date)
INSERT INTO public.english_lessons (
  lesson_date, type, title, subtitle, lesson_level, duration_minutes, skill_focus, passage, summary, is_active
) VALUES (
  DATE '2026-08-13', 'reading', 'AI and the Future of Work (Admin)', 'IELTS Reading · Example',
  'IELTS Reading', 30, 'Main idea & detail', 'PASTE_FULL_PASSAGE_HERE', 'Short summary here', TRUE
)
ON CONFLICT (lesson_date) DO UPDATE
SET title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    passage = EXCLUDED.passage,
    summary = EXCLUDED.summary,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- delete existing sections/questions for this lesson_date
DELETE FROM public.english_questions WHERE lesson_id = (SELECT id FROM public.english_lessons WHERE lesson_date = DATE '2026-08-13');
DELETE FROM public.english_lesson_sections WHERE lesson_id = (SELECT id FROM public.english_lessons WHERE lesson_date = DATE '2026-08-13');

-- insert sections selecting lesson id by date
INSERT INTO public.english_lesson_sections (lesson_id, section_order, section_title, section_instruction)
SELECT id, 1, 'Part 1', 'Identify the main idea.' FROM public.english_lessons WHERE lesson_date = DATE '2026-08-13'
UNION ALL SELECT id, 2, 'Part 2', 'Detail questions.' FROM public.english_lessons WHERE lesson_date = DATE '2026-08-13'
UNION ALL SELECT id, 3, 'Part 3', 'Inference and summary.' FROM public.english_lessons WHERE lesson_date = DATE '2026-08-13';

WITH lesson AS (SELECT id FROM upsert),
 sections AS (SELECT id, section_order FROM public.english_lesson_sections WHERE lesson_id = (SELECT id FROM lesson))
INSERT INTO public.english_questions (lesson_id, section_id, order_index, question_text, question_type, options, correct_answer, answer_hint, points)
SELECT l.id, s.id, 1, 'According to the passage, what is the main challenge created by AI?', 'short_answer', '[]'::jsonb,
       'How society adapts to the changes brought by AI', 'See final paragraph.', 1
FROM lesson l JOIN sections s ON s.section_order = 1
UNION ALL
SELECT l.id, s.id, 2, 'What roles are mentioned as being affected by automation?', 'short_answer', '[]'::jsonb,
       'Administration, data processing and basic customer service', 'Look for routine tasks.', 1
FROM lesson l JOIN sections s ON s.section_order = 1
-- ADD more UNION ALL SELECT rows here up to your desired count (e.g., 14)
;`;

const CHINESE_SCRIPT = `-- Safe Chinese upsert (no drop of daily results)

-- upsert chinese lesson row by date
INSERT INTO public.chinese_lessons (lesson_date, title, hsk_level, passage, is_active)
VALUES (DATE '2026-08-13', '每日中文（管理员）', 'HSK 2', 'PASTE_CHINESE_PASSAGE_HERE', TRUE)
ON CONFLICT (lesson_date) DO UPDATE
SET title = EXCLUDED.title, passage = EXCLUDED.passage, updated_at = NOW();

DELETE FROM public.chinese_questions WHERE lesson_id = (SELECT id FROM public.chinese_lessons WHERE lesson_date = DATE '2026-08-13');
DELETE FROM public.chinese_lesson_parts WHERE lesson_id = (SELECT id FROM public.chinese_lessons WHERE lesson_date = DATE '2026-08-13');

INSERT INTO public.chinese_lesson_parts (lesson_id, part_order, part_title, question_instruction, passage)
SELECT id, 1, '第一部分', '阅读短文并回答。', 'PART1_TEXT' FROM public.chinese_lessons WHERE lesson_date = DATE '2026-08-13'
UNION ALL SELECT id, 2, '第二部分', '阅读短文并选择答案。', 'PART2_TEXT' FROM public.chinese_lessons WHERE lesson_date = DATE '2026-08-13';

WITH lesson AS (SELECT id FROM public.chinese_lessons WHERE lesson_date = DATE '2026-08-13'), parts AS (SELECT id, part_order FROM public.chinese_lesson_parts WHERE lesson_id = (SELECT id FROM lesson))
INSERT INTO public.chinese_questions (lesson_id, part_id, order_index, question_text, question_type, options, answer)
SELECT l.id, p.id, 1, '购书满 100 元能获得什么礼物？', 'multiple_choice', '["词典","日记本","故事书","汉语书"]'::jsonb, 'B' FROM lesson l JOIN parts p ON p.part_order = 1
UNION ALL SELECT l.id, p.id, 2, '根据这段话，可以知道：', 'multiple_choice', '["小说半价","放寒假了","有些书打折","书店生意很好"]'::jsonb, 'C' FROM lesson l JOIN parts p ON p.part_order = 1
-- ADD more UNION ALL SELECT rows up to ~10 questions
;

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

if (engInsert) engInsert.addEventListener('click', () => { sqlEditor.value = ENGLISH_SCRIPT; sqlEditor.focus(); });
if (chiInsert) chiInsert.addEventListener('click', () => { sqlEditor.value = CHINESE_SCRIPT; sqlEditor.focus(); });
if (engCopy) engCopy.addEventListener('click', () => { copyText(ENGLISH_SCRIPT); showMessage('English script copied to clipboard.', 'success'); });
if (chiCopy) chiCopy.addEventListener('click', () => { copyText(CHINESE_SCRIPT); showMessage('Chinese script copied to clipboard.', 'success'); });

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
        const message = error instanceof TypeError && error.message === 'Failed to fetch'
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
