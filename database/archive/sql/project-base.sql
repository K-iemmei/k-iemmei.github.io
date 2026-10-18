-- Project base tables to satisfy references from various migrations and admin scripts
-- Creates minimal user and lesson-related tables so other migration files can run idempotently.

-- Enable pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Minimal users table used across the project
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  full_name TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- English lessons and structure (minimal)
CREATE TABLE IF NOT EXISTS public.english_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_date DATE UNIQUE,
  type TEXT,
  title TEXT,
  subtitle TEXT,
  lesson_level TEXT,
  duration_minutes SMALLINT,
  skill_focus TEXT,
  passage TEXT,
  summary TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.english_lesson_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.english_lessons(id) ON DELETE CASCADE,
  section_order SMALLINT NOT NULL,
  section_title TEXT,
  section_instruction TEXT
);

CREATE TABLE IF NOT EXISTS public.english_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.english_lessons(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.english_lesson_sections(id) ON DELETE CASCADE,
  order_index SMALLINT,
  question_text TEXT,
  question_type TEXT,
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer JSONB,
  answer_hint TEXT,
  points SMALLINT DEFAULT 1
);

-- Chinese lessons (minimal)
CREATE TABLE IF NOT EXISTS public.chinese_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_date DATE UNIQUE,
  title TEXT,
  hsk_level TEXT,
  passage TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chinese_lesson_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.chinese_lessons(id) ON DELETE CASCADE,
  part_order SMALLINT NOT NULL,
  part_title TEXT,
  question_instruction TEXT,
  passage TEXT
);

CREATE TABLE IF NOT EXISTS public.chinese_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.chinese_lessons(id) ON DELETE CASCADE,
  part_id UUID REFERENCES public.chinese_lesson_parts(id) ON DELETE CASCADE,
  order_index SMALLINT,
  question_text TEXT,
  question_type TEXT,
  options JSONB DEFAULT '[]'::jsonb,
  answer JSONB
);

-- User answers and listening answers
CREATE TABLE IF NOT EXISTS public.english_user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id UUID,
  question_id UUID,
  is_correct BOOLEAN,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.english_listening_user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id UUID,
  question_id UUID,
  is_correct BOOLEAN,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chinese_user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id UUID,
  question_id UUID,
  is_correct BOOLEAN,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Daily results / aggregates used by admin scripts
CREATE TABLE IF NOT EXISTS public.english_daily_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  lesson_date DATE,
  correct_count INTEGER DEFAULT 0,
  total_count INTEGER DEFAULT 0,
  score_percent NUMERIC(5,2) DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chinese_daily_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  lesson_date DATE,
  correct_count INTEGER DEFAULT 0,
  total_count INTEGER DEFAULT 0,
  score_percent NUMERIC(5,2) DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- Lightweight per-day aggregate tables (admin script expects these)
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

-- Ensure minimal privileges for anon/authenticated are left to deployment configuration; no grants here.

-- End of project-base.sql
