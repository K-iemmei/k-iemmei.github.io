# English tracking log

The dashboard records saved Reading submissions and actual Listening audio playback per day in UTC+7 (Asia/Bangkok). Reading uses existing `reading_attempts`, including historical submissions and repeated submissions of the same test. Listening starts recording after this feature is installed; old attempts have no duration to backfill.

Daily points are `Reading submissions + Listening minutes / 10`. Intensity is empty at zero, then four shades for `0 < points < 1`, `1 <= points < 2`, `2 <= points < 3`, and `points >= 3`. For example, one Reading submission plus 20 Listening minutes reaches the darkest shade. Answer accuracy does not affect activity intensity. The tooltip, year totals, and expandable daily table show the underlying counts separately.

Listening measures elapsed playback time, including replay and background playback. Pauses, buffering, and seek jumps do not count. Playback speed does not multiply minutes. The browser saves small batches every 15 seconds, on pause, when hidden, and when leaving. Pending batches retry from browser storage; event IDs prevent retries from counting twice. Playback spanning midnight is split into the corresponding UTC+7 dates.

For local development, run `npm.cmd run db:migrate` and restart the server.

For the existing hosted project, apply these additive migrations in order, deploy the updated Edge Function, then publish the Pages build:

```powershell
psql -w "$env:HOSTED_DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/012-english-tracking.sql
psql -w "$env:HOSTED_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/hosted-tracking-migration.sql
supabase.cmd functions deploy app-api --project-ref skqtgplnejbujyejqilu
```

Hall of Fame ranks every user by the same uncapped English points for a selected UTC+7 day, including users with zero activity. Equal totals share a rank. The date picker defaults to today; earlier dates are calculated from the saved submissions and playback records. The list refreshes every minute while visible and has a manual Refresh button. Only display names and daily aggregate totals are shared, without individual answers or attempts.

For Hall of Fame on an existing hosted project, also apply these files before deploying the Edge Function:

```powershell
psql -w "$env:HOSTED_DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/013-daily-hall-of-fame.sql
psql -w "$env:HOSTED_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/hosted-hall-of-fame-migration.sql
```

The tracking API uses the signed-in user for all reads and writes. Direct browser access to the aggregate function and playback table is disabled on Supabase. The dashboard shows an error if tracking cannot load instead of substituting legacy accuracy records.
