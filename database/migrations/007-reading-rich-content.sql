ALTER TABLE public.reading_passages
    ADD COLUMN IF NOT EXISTS content_html TEXT NOT NULL DEFAULT '';
