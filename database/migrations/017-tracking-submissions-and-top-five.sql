-- Read saved attempts directly so historical submits are included without backfills.
CREATE OR REPLACE FUNCTION public.english_tracking_v2(learner UUID)
RETURNS TABLE(activity_date TEXT, reading_submissions BIGINT,
    listening_submissions BIGINT, listening_seconds NUMERIC)
LANGUAGE SQL STABLE AS $$
    SELECT day::text, sum(reading_count)::bigint, sum(listening_count)::bigint, sum(seconds)
    FROM (
        SELECT (completed_at AT TIME ZONE 'Asia/Bangkok')::date AS day,
            count(*) AS reading_count, 0::bigint AS listening_count, 0::numeric AS seconds
        FROM public.reading_attempts WHERE user_id = learner GROUP BY day
        UNION ALL
        SELECT (completed_at AT TIME ZONE 'Asia/Bangkok')::date,
            0::bigint, count(*), 0::numeric
        FROM public.listening_attempts WHERE user_id = learner GROUP BY 1
        UNION ALL
        SELECT activity_date, 0::bigint, 0::bigint, sum(seconds)
        FROM public.listening_activity WHERE user_id = learner GROUP BY activity_date
    ) activity
    GROUP BY day ORDER BY day;
$$;
REVOKE ALL ON FUNCTION public.english_tracking_v2(UUID) FROM PUBLIC;

-- NULL means all time. A date is retained for API clients requesting a daily view.
CREATE OR REPLACE FUNCTION public.english_hall_of_fame(log_date DATE DEFAULT NULL)
RETURNS TABLE(user_id UUID, name TEXT, reading_submissions BIGINT,
    listening_submissions BIGINT, listening_seconds NUMERIC, points NUMERIC, rank BIGINT)
LANGUAGE SQL STABLE AS $$
    WITH reading AS (
        SELECT user_id, count(*) AS submissions FROM public.reading_attempts
        WHERE log_date IS NULL OR (
            completed_at >= (log_date::timestamp AT TIME ZONE 'Asia/Bangkok') AND
            completed_at < ((log_date + 1)::timestamp AT TIME ZONE 'Asia/Bangkok'))
        GROUP BY user_id
    ), submitted_listening AS (
        SELECT user_id, count(*) AS submissions FROM public.listening_attempts
        WHERE log_date IS NULL OR (
            completed_at >= (log_date::timestamp AT TIME ZONE 'Asia/Bangkok') AND
            completed_at < ((log_date + 1)::timestamp AT TIME ZONE 'Asia/Bangkok'))
        GROUP BY user_id
    ), listening AS (
        SELECT user_id, sum(seconds) AS seconds FROM public.listening_activity
        WHERE log_date IS NULL OR activity_date = log_date GROUP BY user_id
    ), scores AS (
        SELECT u.id, coalesce(nullif(trim(u.name), ''), 'Learner') AS display_name,
            coalesce(r.submissions, 0)::bigint AS reading_count,
            coalesce(s.submissions, 0)::bigint AS listening_count,
            coalesce(l.seconds, 0)::numeric AS seconds,
            coalesce(r.submissions, 0) + coalesce(s.submissions, 0) +
                coalesce(l.seconds, 0) / 600.0 AS points
        FROM public.users u
        LEFT JOIN reading r ON r.user_id = u.id
        LEFT JOIN submitted_listening s ON s.user_id = u.id
        LEFT JOIN listening l ON l.user_id = u.id
    )
    SELECT id, display_name, reading_count, listening_count, seconds, points,
        row_number() OVER (ORDER BY points DESC, lower(display_name), id)
    FROM scores ORDER BY points DESC, lower(display_name), id LIMIT 5;
$$;
REVOKE ALL ON FUNCTION public.english_hall_of_fame(DATE) FROM PUBLIC;
