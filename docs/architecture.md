# Architecture

Express serves the HTML, assets and API on one local origin, default `http://localhost:8000`. PostgreSQL is the source of truth. The hosted build runs on GitHub Pages with Supabase Auth and an Edge Function API; see [Supabase deployment](supabase-deployment.md).

## Login and routing

`apps/web/routes.json` preserves the existing page URLs. `/` and `/index.html` serve login; other HTML routes authenticate before sending page content. `apps/web/src/app.js` checks the server session before initializing a protected feature. Login redirects to `home.html`, the daily overview. `dashboard.html` remains the Learning page.

Passwords are verified against salted scrypt hashes in `app_private.credentials`. A random session token travels in an HttpOnly, SameSite=Strict cookie; PostgreSQL stores only its SHA-256 digest with a seven-day expiry. Logout revokes that session. Browser storage contains display profile data only and grants no access. Cookies are HTTP-compatible for loopback development; hosted use requires a separate security/deployment configuration.

Hosted pages re-read the shared Auth session before requests and pin the page to the user verified at startup. Changing accounts or signing out in another tab reloads protected pages; a request detects an account change even before the storage event is handled. Refreshing a token for the same account preserves the page. Delayed Auth responses cannot restore an old session or clear a new account. `node tests/browser/account-switch.cjs` covers Dashboard isolation across hosted account changes with mocked Auth/API responses.

Hosted profile IDs always match Auth user IDs. Imported profiles bearing the development-only name `Local Developer` are relabelled using the same Auth user's display name or email prefix; attempt ownership is never changed. Apply `supabase/hosted-profile-identity-migration.sql` for existing profiles. New imports use the Auth identity for the display name. English heatmap loading remains independent of failures in the subject catalog.

The server binds to loopback by default. Authenticated API middleware protects Reading and data routes. The generic data API excludes Reading tables so answer keys cannot bypass the practice endpoint. Same-origin mutation checks apply. The optional SQL console is disabled unless `ADMIN_TOKEN` is configured and remains at `sql-console.html`; `admin.html` is the Reading authoring UI.

## Reading model

```text
reading_tests
  -> reading_passages (ordered)
    -> reading_question_groups (ordered, type, instructions, options, metadata)
      -> reading_questions (ordered, type, prompt, options, answer_key, metadata)
  -> reading_attempts (user, version, responses, graded review snapshot)
```

Options are JSONB arrays of `{id,text}`. Answer keys are JSONB `{answers,match,case_sensitive}`. Metadata is JSONB for type-dependent summary text, paragraph labels, question labels and explanations. A question can inherit shared group options or use its own. Supported types are declared in `apps/api/modules/reading/question-types.js` and consumed by authoring and practice.

`POST /api/reading/author/tests` validates and writes the whole hierarchy transactionally. `PUT /api/reading/author/tests/:id` requires ownership and the current version, replacing the content while retaining attempt review snapshots. Author listing/detail endpoints expose only owned tests. Published tests are available for practice; drafts remain visible to their owner. Archived tests are omitted from the normal library but remain accessible to their author by direct link and through authoring.

`GET /api/tests/:slug` removes answer keys and explanations. `POST /api/tests/:slug/attempts` verifies the content version and grades on the server. Text questions support alternative accepted answers and optional case sensitivity; list selections require the exact set. Each saved attempt contains its original review snapshot, so edits do not rewrite historical results.

## Code ownership

- `apps/api/modules/auth`: login, session verification and logout.
- `apps/api/modules/reading`: type catalog, validation, persistence, grading and routes.
- `apps/web/src/features/english/reading`: authoring, library and practice page behavior.
- `apps/web/src/core`: authenticated HTTP and session infrastructure.
- `database/migrations`: immutable ordered schema changes.
- `tests`: pure unit tests, real PostgreSQL integration and browser workflows.

Use kebab-case descriptive filenames. Keep page events in page modules, persistence in repositories and display transformation in adapters/renderers. Add a new numbered migration rather than changing a migration already applied. Archived crawler/Supabase prototypes are historical references, not active dependencies.

Imported single-passage exercises can retain book numbering with `metadata.source_number`. Linked letter-answer slots use `answer_key.distinct_group`: each distinct accepted answer earns one point within that group, regardless of slot order. Practice never receives this key; the server grades it and returns the saved review after submission. Test descriptions are shown before practice so inferred-answer provenance is visible.

## Daily Home

Home loads account-scoped todos and city/news preferences through `/api/home` and the shared `app_home_api` database gateway. Task changes require their saved version, preventing stale tabs from overwriting edits. New tasks are pinned; completion and pin state persist across devices. Direct browser access to these tables and RPC is revoked on Supabase.

The default weather location is Hà Nội; users can search for another city. Open-Meteo supplies a forecast for the next three days, starting tomorrow, with GeoNames search attribution. News uses allowlisted VnExpress RSS categories, displaying four linked headlines with short RSS summaries and publication dates. The API caches headlines for five minutes; a failed refresh can show a labelled cache up to 24 hours old. Todo writes, weather and news have separate error states.

The shared UI uses parchment, sage and terracotta through `tokens.css` and `vintage.css`, with matching dark-mode tones. Home keeps task items above the add form so the checklist remains the focal point.

Peer cards share a common surface, border and heading treatment; colour identifies interaction/state rather than subject. Typography uses a local system sans stack (Segoe UI on Windows) for both UI and reading, without external font downloads.

## Loading and latency

Home starts public news and weather independently of its account-scoped database request. Public responses use a best-effort tab cache (news: five minutes, weather: ten minutes) with in-flight request deduplication. Refresh bypasses the browser cache. Task data is fetched live on every visit; only city/category preferences are cached under the authenticated account ID, updated after successful saves and cleared on logout.

Page features load in parallel with the optional vocabulary capture menu. The hosted build preconnects to Supabase (and Open-Meteo on Home) and preloads common session/API modules while retaining the sign-in guard. Concurrent token renewals share one refresh request; temporary Auth server errors retain the session. The Edge Function still validates every token and member, but reads membership/profile in parallel and lets browsers reuse CORS preflight permission for one hour. Dashboard subjects, Chinese history and Listening-flush/English-history run concurrently; English totals are fetched after playback flush completes.

A controlled Chrome comparison with a 1.5-second Home DB delay and 0.4-second provider delays measured public panels at roughly 2.35 seconds before, 0.75 seconds after, and 0.10 seconds on a warm tab revisit. These figures are a repeatable test scenario, not production latency guarantees. The remaining first-load costs include Auth, Supabase round trips and provider response time.

## Formatted Reading editor and tables

Authoring has one directly editable formatted passage, with synchronized plain text generated on save. The same visual editor supports instructions, completion summaries/tables and question prompts. Native table insertion, pasted tables, row/column additions and safe cell spans are supported. Both API runtimes use the shared Reading HTML allowlist; script, event attributes, arbitrary styles and embedded form controls are removed or rejected. The existing `content_html` column and group/question JSON metadata store formatting, so no new schema is required.

Practice renders safe table structure before inserting answer controls into text nodes. One question receives one answer control even if a numbered marker repeats in another cell. Structured legacy table summaries (`label: details`) can render as two-column tables while preserving all text; missing original columns are not guessed. Edited passage HTML takes priority over source-page images, which remain available under Original pages. Test with `npm run test:browser:reading` for a real DB save/reload and table rendering workflow.

## Blog reading list

Blog shows published snapshots in descending publication date, with a stable ID tie-breaker. The interface contains a reading list and debounced search by all fields, title, tag or author; pagination appears only when needed. Search state is retained in the URL and changing a search resets its page. Private Notes keep their existing authoring and status controls.

Both API runtimes route Blog listing to `app_blog_list`, passing the authenticated reader and validated search fields. Apply `database/migrations/018-blog-search.sql` and `supabase/hosted-blog-search-migration.sql` before deploying the API. The RPC reads only `blog_posts`, never unposted edits from private Notes, and direct browser execution is revoked. Other Notes and post-detail actions still use `app_notes_api`. Integration tests cover search scopes, literal wildcard characters, publication ordering, pagination and private draft isolation.

Notes use a compact nested list backed by `personal_notes.parent_id` (migration 019).
The authenticated `app_note_tree` gateway lists owner metadata, creates a note in a branch,
and moves an existing note with version checks. Moves reject self/descendant parents and
other owners; owner-row locking serializes tree writes. Deleting a parent promotes its
children to the top level instead of deleting their content. Publication remains per note.
Apply `supabase/hosted-note-tree-migration.sql` after migration 019 for service-role-only RPC access.

Home Highlights mixes up to ten deduplicated RSS stories across topics, reserving three
football slots when available. Football stories are filtered from the active VnExpress
Sports RSS (the dedicated football RSS currently returns an empty channel). Topic views
show up to eight stories with publisher summaries. Feeds cache for five minutes and can
serve a clearly marked prior update for up to one day if the publisher is unavailable.

`GET /api/home/football?league=eng.1` uses the authenticated API in both runtimes to fetch
ESPN standings for an allowlisted league: Premier League, La Liga, Serie A, Bundesliga,
Ligue 1 or Champions League. It preserves source ranks and season labels, rejects incomplete
or ambiguous group data, caches for ten minutes and coalesces concurrent requests.
The UI shows top five with a full-table toggle; league switching ignores late responses.
Both panels load independently of personal Home data. Migration 020 expands saved news topics.
