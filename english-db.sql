-- English practice schema redesign.
-- This schema is optimized for daily reading lessons (one reading lesson/day),
-- each lesson has one passage and a few exercise sections (2-3 Part blocks).
-- Questions are mostly IELTS-style short-answer inputs.

DROP TABLE IF EXISTS english_user_answers CASCADE;
DROP TABLE IF EXISTS english_listening_user_answers CASCADE;
DROP TABLE IF EXISTS english_listening_questions CASCADE;
DROP TABLE IF EXISTS english_listening_lessons CASCADE;
DROP TABLE IF EXISTS english_daily_results CASCADE;
DROP TABLE IF EXISTS english_questions CASCADE;
DROP TABLE IF EXISTS english_lesson_sections CASCADE;
DROP TABLE IF EXISTS english_lessons CASCADE;

CREATE TABLE english_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_date DATE NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'reading' CHECK (type IN ('reading')),
    title TEXT NOT NULL,
    subtitle TEXT,
    lesson_level TEXT NOT NULL DEFAULT 'IELTS Reading',
    duration_minutes INTEGER NOT NULL DEFAULT 25,
    skill_focus TEXT NOT NULL DEFAULT 'Reading for main idea',
    passage TEXT NOT NULL,
    summary TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE english_lesson_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES english_lessons(id) ON DELETE CASCADE,
    section_order INTEGER NOT NULL CHECK (section_order >= 1),
    section_title TEXT NOT NULL,
    section_instruction TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (lesson_id, section_order)
);

CREATE TABLE english_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES english_lessons(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES english_lesson_sections(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 1,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'short_answer' CHECK (question_type IN ('short_answer', 'multiple_choice', 'true_false')),
    options JSONB DEFAULT '[]'::jsonb,
    answer TEXT,
    correct_answer TEXT,
    answer_hint TEXT,
    points INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (lesson_id, section_id, order_index)
);

CREATE TABLE english_user_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES english_lessons(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES english_questions(id) ON DELETE CASCADE,
    submitted_answer TEXT,
    is_correct BOOLEAN,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, lesson_id, question_id)
);

CREATE TABLE english_listening_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL UNIQUE REFERENCES english_lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Daily listening',
    audio_path TEXT,
    transcript TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE english_listening_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES english_lessons(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL CHECK (order_index >= 1),
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'short_answer' CHECK (question_type IN ('short_answer', 'multiple_choice', 'true_false')),
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    answer TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 1,
    UNIQUE (lesson_id, order_index)
);

CREATE TABLE english_listening_user_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES english_lessons(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES english_listening_questions(id) ON DELETE CASCADE,
    submitted_answer TEXT,
    is_correct BOOLEAN,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, lesson_id, question_id)
);


CREATE TABLE english_daily_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES english_lessons(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    correct_count INTEGER NOT NULL DEFAULT 0 CHECK (correct_count >= 0),
    total_count INTEGER NOT NULL DEFAULT 0 CHECK (total_count >= 0),
    score_percent NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (score_percent >= 0 AND score_percent <= 100),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, lesson_id)
);

-- Example lesson: day 1 / today-like reading lesson.
INSERT INTO english_lessons (
    lesson_date,
    type,
    title,
    subtitle,
    lesson_level,
    duration_minutes,
    skill_focus,
    passage,
    summary,
    is_active
)
VALUES (
    CURRENT_DATE,
    'reading',
    'AI and the Future of Work',
    'IELTS Reading · Day 01',
    'IELTS Reading',
    30,
    'Reading for main idea and detail',
    'Artificial intelligence is increasingly shaping the workplace, but its effect on employment is still a matter of debate.

Some analysts argue that AI will replace many routine tasks, particularly in administration, data processing and basic customer service. These roles often involve repetitive work that can be automated with software. As a result, workers in these fields may need to retrain or focus on more complex responsibilities that require judgment, empathy and creativity.

However, the impact of AI is not simply negative. In many industries, it can improve productivity by handling large amounts of information quickly and accurately. For example, doctors may use AI tools to review scans, while teachers can use language programs to personalize learning. In these situations, technology acts as a support system rather than a total replacement for human professionals.

The real challenge is therefore not whether AI will change the labor market, but how societies adapt to that change. Governments, companies and education providers need to invest in training programs that help workers develop new skills. The most successful employees are likely to be those who can combine technical knowledge with strong communication and problem-solving abilities.',
    'Focus on main idea and inference.',
    TRUE
);

WITH lesson AS (
    SELECT id FROM english_lessons WHERE lesson_date = CURRENT_DATE LIMIT 1
)
INSERT INTO english_lesson_sections (lesson_id, section_order, section_title, section_instruction)
SELECT l.id, 1, 'Part 1', 'Identify the main cause of workplace change.'
FROM lesson l
UNION ALL
SELECT l.id, 2, 'Part 2', 'Explain how automation affects different job functions.'
FROM lesson l
UNION ALL
SELECT l.id, 3, 'Part 3', 'Summarize the future skills and adaptation required.'
FROM lesson l;

WITH lesson AS (
    SELECT id FROM english_lessons WHERE lesson_date = CURRENT_DATE LIMIT 1
),
section_map AS (
    SELECT id AS section_id, section_order
    FROM english_lesson_sections
    WHERE lesson_id = (SELECT id FROM lesson)
)
INSERT INTO english_questions (
    lesson_id,
    section_id,
    order_index,
    question_text,
    question_type,
    options,
    correct_answer,
    answer_hint,
    points
)
SELECT
    l.id,
    sm.section_id,
    1,
    'According to the passage, what is the main challenge created by AI in the workplace?',
    'short_answer',
    '[]'::jsonb,
    'How society adapts to the changes brought by AI',
    'Look for the sentence about the real challenge in the final paragraph.',
    1
FROM lesson l
JOIN section_map sm ON sm.section_order = 1
UNION ALL
SELECT l.id, sm.section_id, 2, 'What roles are mentioned as being affected by automation?', 'short_answer', '[]'::jsonb, 'Administration, data processing and basic customer service', 'Look for routine tasks that can be automated.', 1
FROM lesson l JOIN section_map sm ON sm.section_order = 1
UNION ALL
SELECT l.id, sm.section_id, 3, 'What does the passage say workers may need to do?', 'short_answer', '[]'::jsonb, 'Retrain and focus on more complex responsibilities', 'The passage talks about retraining and new responsibilities.', 1
FROM lesson l JOIN section_map sm ON sm.section_order = 1
UNION ALL
SELECT l.id, sm.section_id, 4, 'Which professional roles are used as examples of AI support?', 'short_answer', '[]'::jsonb, 'Doctors and teachers', 'The passage mentions doctors and teachers.', 1
FROM lesson l JOIN section_map sm ON sm.section_order = 1
UNION ALL
SELECT l.id, sm.section_id, 5, 'What two qualities are needed for future employees, according to the passage?', 'short_answer', '[]'::jsonb, 'Communication and problem-solving abilities', 'The final paragraph mentions these abilities.', 1
FROM lesson l JOIN section_map sm ON sm.section_order = 1
UNION ALL
SELECT l.id, sm.section_id, 6, 'What are the major fields mentioned in the first paragraph?', 'short_answer', '[]'::jsonb, 'Administration, data processing and basic customer service', 'They are routine fields that are discussed at the start.', 1
FROM lesson l JOIN section_map sm ON sm.section_order = 2
UNION ALL
SELECT l.id, sm.section_id, 7, 'According to the author, what can AI improve in many industries?', 'short_answer', '[]'::jsonb, 'Productivity', 'The author says AI can increase speed and accuracy.', 1
FROM lesson l JOIN section_map sm ON sm.section_order = 2
UNION ALL
SELECT l.id, sm.section_id, 8, 'What kind of work is often repetitive?', 'short_answer', '[]'::jsonb, 'Routine tasks', 'The phrase appears in the opening paragraph.', 1
FROM lesson l JOIN section_map sm ON sm.section_order = 2
UNION ALL
SELECT l.id, sm.section_id, 9, 'What is the direct help that AI can offer in professional sectors?', 'short_answer', '[]'::jsonb, 'Handle large amounts of information quickly and accurately', 'Think about its impact on productivity.', 1
FROM lesson l JOIN section_map sm ON sm.section_order = 2
UNION ALL
SELECT l.id, sm.section_id, 10, 'What must governments, companies and education providers invest in?', 'short_answer', '[]'::jsonb, 'Training programs', 'The passage says these institutions need to support workers.', 1
FROM lesson l JOIN section_map sm ON sm.section_order = 2
UNION ALL
SELECT l.id, sm.section_id, 11, 'Which word describes the most successful employees in the final paragraph?', 'short_answer', '[]'::jsonb, 'Those who combine technical knowledge with strong communication and problem-solving abilities', 'The conclusion explains this.', 1
FROM lesson l JOIN section_map sm ON sm.section_order = 3
UNION ALL
SELECT l.id, sm.section_id, 12, 'What role does technology play according to the passage?', 'short_answer', '[]'::jsonb, 'A support system rather than a total replacement for human professionals', 'The author describes the relationship as supportive.', 1
FROM lesson l JOIN section_map sm ON sm.section_order = 3
UNION ALL
SELECT l.id, sm.section_id, 13, 'What is the author’s attitude to AI?', 'short_answer', '[]'::jsonb, 'Balanced and practical', 'The author sees both benefits and risks.', 1
FROM lesson l JOIN section_map sm ON sm.section_order = 3
UNION ALL
SELECT l.id, sm.section_id, 14, 'What is the final idea of the passage?', 'short_answer', '[]'::jsonb, 'Societies must adapt to AI-driven change', 'The last sentence expresses the core message.', 1
FROM lesson l JOIN section_map sm ON sm.section_order = 3;

UPDATE english_questions
SET answer = correct_answer
WHERE answer IS NULL;

-- Optional Listening sample for the seeded lesson.
-- Upload an audio file first, then replace NULL with its Storage path.
WITH lesson AS (
    SELECT id FROM english_lessons WHERE lesson_date = CURRENT_DATE LIMIT 1
)
INSERT INTO english_listening_lessons (lesson_id, title, audio_path, transcript)
SELECT id, 'A short conversation about work', NULL,
    'The speaker works in an office and usually starts at 8 a.m. Before work, the speaker drinks coffee. The speaker travels to work by car and has lunch with a colleague.'
FROM lesson;

WITH lesson AS (
    SELECT id FROM english_lessons WHERE lesson_date = CURRENT_DATE LIMIT 1
)
INSERT INTO english_listening_questions (lesson_id, order_index, question_text, options, answer)
SELECT id, 1, 'What is the conversation mainly about?', '["A new job","A daily work routine","A holiday plan","A university course"]'::jsonb, 'B'
FROM lesson
UNION ALL
SELECT id, 2, 'Where does the speaker work?', '["At a hospital","At a school","In an office","At a shop"]'::jsonb, 'C'
FROM lesson
UNION ALL
SELECT id, 3, 'What time does the speaker usually start work?', '[]'::jsonb, '8 a.m.'
FROM lesson;

WITH lesson AS (
    SELECT id FROM english_lessons WHERE lesson_date = CURRENT_DATE LIMIT 1
)
INSERT INTO english_listening_questions (lesson_id, order_index, question_text, options, answer)
SELECT id, 4, 'How does the speaker travel to work?', '["By bus","By train","By car","On foot"]'::jsonb, 'C' FROM lesson
UNION ALL SELECT id, 5, 'What does the speaker usually do before work?', '[]'::jsonb, 'Drink coffee' FROM lesson
UNION ALL SELECT id, 6, 'Who does the speaker meet in the morning?', '["A manager","A colleague","A customer","A teacher"]'::jsonb, 'B' FROM lesson
UNION ALL SELECT id, 7, 'How long is the speaker’s lunch break?', '["Thirty minutes","One hour","Two hours","Fifteen minutes"]'::jsonb, 'A' FROM lesson
UNION ALL SELECT id, 8, 'What does the speaker do after lunch?', '[]'::jsonb, 'Return to work' FROM lesson
UNION ALL SELECT id, 9, 'What is the speaker’s main responsibility?', '["Teaching students","Helping customers","Writing reports","Designing buildings"]'::jsonb, 'B' FROM lesson
UNION ALL SELECT id, 10, 'How does the speaker feel about the job?', '["Bored","Worried","Positive","Angry"]'::jsonb, 'C' FROM lesson;

-- Future authoring pattern:
-- INSERT INTO english_lessons (lesson_date, type, title, subtitle, lesson_level, duration_minutes, skill_focus, passage, summary, is_active)
-- VALUES (DATE '2026-08-10', 'reading', 'New topic', 'IELTS Reading · Day 02', 'IELTS Reading', 30, 'Reading for detail', 'Passage text...', 'Summary', TRUE);
--
-- INSERT INTO english_lesson_sections (lesson_id, section_order, section_title, section_instruction)
-- VALUES ('LESSON_ID', 1, 'Section A', 'Part 1');
--
-- INSERT INTO english_questions (lesson_id, section_id, order_index, question_text, question_type, options, correct_answer, answer_hint, points)
-- VALUES ('LESSON_ID', 'SECTION_ID', 1, 'Question text...', 'short_answer', '[]'::jsonb, 'Model answer', 'Hint text', 1);

-- Query examples:
-- SELECT * FROM english_lessons WHERE is_active = TRUE ORDER BY lesson_date DESC;
-- SELECT * FROM english_lesson_sections WHERE lesson_id = 'LESSON_ID' ORDER BY section_order;
-- SELECT * FROM english_questions WHERE lesson_id = 'LESSON_ID' ORDER BY section_id, order_index;
