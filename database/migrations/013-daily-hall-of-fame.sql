-- Share only daily aggregate scores and display names, never other users' attempts.
CREATE OR REPLACE FUNCTION public.daily_hall_of_fame(log_date DATE)
RETURNS TABLE(user_id UUID, name TEXT, reading_submissions BIGINT,
    listening_seconds NUMERIC, points NUMERIC, rank BIGINT)
LANGUAGE SQL STABLE AS $$
    WITH reading AS (
        SELECT user_id, count(*) AS submissions
        FROM public.reading_attempts
        WHERE completed_at >= (log_date::timestamp AT TIME ZONE 'Asia/Bangkok')
          AND completed_at < ((log_date + 1)::timestamp AT TIME ZONE 'Asia/Bangkok')
        GROUP BY user_id
    ), listening AS (
        SELECT user_id, sum(seconds) AS seconds
        FROM public.listening_activity WHERE activity_date = log_date GROUP BY user_id
    ), scores AS (
        SELECT u.id, coalesce(nullif(trim(u.name), ''), 'Learner') AS display_name,
            coalesce(r.submissions, 0)::bigint AS submissions,
            coalesce(l.seconds, 0)::numeric AS seconds,
            coalesce(r.submissions, 0) + coalesce(l.seconds, 0) / 600.0 AS points
        FROM public.users u
        LEFT JOIN reading r ON r.user_id = u.id
        LEFT JOIN listening l ON l.user_id = u.id
    )
    SELECT id, display_name, submissions, seconds, points,
        dense_rank() OVER (ORDER BY points DESC)
    FROM scores ORDER BY points DESC, lower(display_name), id;
$$;
REVOKE ALL ON FUNCTION public.daily_hall_of_fame(DATE) FROM PUBLIC;
