-- Reading counts come from saved submissions. Listening records actual playback time.
CREATE TABLE IF NOT EXISTS public.listening_activity (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    id UUID NOT NULL,
    activity_date DATE NOT NULL,
    seconds NUMERIC(10,3) NOT NULL CHECK (seconds > 0 AND seconds <= 300),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, id)
);
CREATE INDEX IF NOT EXISTS listening_activity_user_date_idx
    ON public.listening_activity(user_id, activity_date);
ALTER TABLE public.listening_activity ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.english_tracking(learner UUID)
RETURNS TABLE(activity_date TEXT, reading_submissions BIGINT, listening_seconds NUMERIC)
LANGUAGE SQL STABLE AS $$
    SELECT day::text, sum(reading_count)::bigint, sum(seconds)
    FROM (
        SELECT (completed_at AT TIME ZONE 'Asia/Bangkok')::date AS day,
            count(*) AS reading_count, 0::numeric AS seconds
        FROM public.reading_attempts
        WHERE user_id = learner
        GROUP BY day
        UNION ALL
        SELECT activity_date, 0::bigint, sum(seconds)
        FROM public.listening_activity WHERE user_id = learner GROUP BY activity_date
    ) activity
    GROUP BY day ORDER BY day;
$$;
REVOKE ALL ON FUNCTION public.english_tracking(UUID) FROM PUBLIC;
