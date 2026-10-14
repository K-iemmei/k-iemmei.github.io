-- Additive repair for the old minimal local schema; never drops existing data.
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS users_username_key ON public.users(username);
UPDATE public.users SET name = COALESCE(name, full_name, username, 'Learner') WHERE name IS NULL;
CREATE TABLE IF NOT EXISTS public.subjects (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT NOT NULL UNIQUE,
 name TEXT NOT NULL, color TEXT, description TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.topics (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), subject_id UUID NOT NULL REFERENCES public.subjects(id),
 slug TEXT NOT NULL, title TEXT NOT NULL, description TEXT, tags JSONB NOT NULL DEFAULT '[]',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(subject_id,slug)
);
CREATE TABLE IF NOT EXISTS public.subject_daily_activity (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES public.users(id),
 subject_id UUID NOT NULL REFERENCES public.subjects(id), activity_date DATE NOT NULL,
 correct_count INTEGER NOT NULL DEFAULT 0, total_count INTEGER NOT NULL DEFAULT 0,
 UNIQUE(user_id,subject_id,activity_date)
);
ALTER TABLE public.english_lesson_sections ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.english_questions ADD COLUMN IF NOT EXISTS answer TEXT;
ALTER TABLE public.english_questions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.chinese_questions ADD COLUMN IF NOT EXISTS points SMALLINT DEFAULT 1;
ALTER TABLE public.english_user_answers ADD COLUMN IF NOT EXISTS submitted_answer TEXT DEFAULT '';
ALTER TABLE public.english_listening_user_answers ADD COLUMN IF NOT EXISTS submitted_answer TEXT DEFAULT '';
ALTER TABLE public.chinese_user_answers ADD COLUMN IF NOT EXISTS submitted_answer TEXT DEFAULT '';
ALTER TABLE public.english_daily_results ADD COLUMN IF NOT EXISTS lesson_id UUID REFERENCES public.english_lessons(id);
ALTER TABLE public.english_daily_results ADD COLUMN IF NOT EXISTS activity_date DATE;
ALTER TABLE public.chinese_daily_results ADD COLUMN IF NOT EXISTS lesson_id UUID REFERENCES public.chinese_lessons(id);
ALTER TABLE public.chinese_daily_results ADD COLUMN IF NOT EXISTS activity_date DATE;
UPDATE public.english_daily_results SET activity_date=lesson_date WHERE activity_date IS NULL;
UPDATE public.chinese_daily_results SET activity_date=lesson_date WHERE activity_date IS NULL;
CREATE INDEX IF NOT EXISTS chinese_answers_user_lesson_idx ON public.chinese_user_answers(user_id,lesson_id);
CREATE INDEX IF NOT EXISTS chinese_results_user_date_idx ON public.chinese_daily_results(user_id,activity_date);
CREATE INDEX IF NOT EXISTS english_results_user_date_idx ON public.english_daily_results(user_id,activity_date);
