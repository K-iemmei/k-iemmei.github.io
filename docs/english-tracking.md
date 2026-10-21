# English tracking log

The dashboard records saved Reading and Listening submissions plus actual Listening audio playback per day in UTC+7 (Asia/Bangkok). Submissions come directly from `reading_attempts` and `listening_attempts`, including historical submissions, exam/dictation modes and repeated submissions. Old Listening attempts are counted even when their playback duration is unknown; duration is never invented.

Daily points are `Reading submissions + Listening submissions + Listening minutes / 10`. Intensity is empty at zero, then four shades for `0 < points < 1`, `1 <= points < 2`, `2 <= points < 3`, and `points >= 3`. Answer accuracy does not affect activity intensity. Tracking displays only the yearly heatmaps; their tooltips show daily submission counts, Listening minutes and points. Dashboard refreshes its heatmaps and ranking on focus, visibility, restored back navigation and every minute while visible. A successful submission also signals other open Dashboard tabs to refresh; failed saves never signal an update.

Listening measures elapsed playback time, including replay and background playback. Pauses, buffering, and seek jumps do not count. Playback speed does not multiply minutes. The browser saves small batches every 15 seconds, on pause, when hidden, and when leaving. Pending batches retry from browser storage; event IDs prevent retries from counting twice. Playback spanning midnight is split into the corresponding UTC+7 dates.

For local development, run `npm.cmd run db:migrate` and restart the server.

For the existing hosted project, apply these additive migrations in order, deploy the updated Edge Function, then publish the Pages build:

```powershell
psql -w "$env:HOSTED_DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/012-english-tracking.sql
psql -w "$env:HOSTED_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/hosted-tracking-migration.sql
supabase.cmd functions deploy app-api --project-ref skqtgplnejbujyejqilu
```

Hall of Fame shows at most five users by all-time English points. Ties are ordered by display name then user ID, giving five stable positions. Only English contributes for now. The API still accepts an optional validated UTC+7 date for clients requesting daily top-five aggregates. Only display names and aggregate totals are shared, without individual answers or attempts.

For Hall of Fame on an existing hosted project, also apply these files before deploying the Edge Function:

```powershell
psql -w "$env:HOSTED_DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/013-daily-hall-of-fame.sql
psql -w "$env:HOSTED_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/hosted-hall-of-fame-migration.sql
```

The tracking API uses the signed-in user for all reads and writes. Direct browser access to the aggregate function and playback table is disabled on Supabase. The dashboard shows an error if tracking cannot load instead of substituting legacy accuracy records.

The current API uses `english_tracking_v2` and `english_hall_of_fame`; the original functions are retained for compatibility. Apply `database/migrations/017-tracking-submissions-and-top-five.sql` and `supabase/hosted-tracking-v2-migration.sql` before deploying the updated Edge Function. These functions calculate totals from saved attempts, so no personal records need to be rewritten.
