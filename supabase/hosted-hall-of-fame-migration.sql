-- Apply after database/migrations/013-daily-hall-of-fame.sql, then deploy app-api.
GRANT EXECUTE ON FUNCTION public.daily_hall_of_fame(DATE) TO service_role;
