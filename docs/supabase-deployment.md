# GitHub Pages + Supabase deployment

The repository has two runtimes. `npm run dev` keeps the local Express/PostgreSQL app. `npm run build:pages` creates static files in `dist/` for a GitHub Pages project site. The hosted browser authenticates with Supabase Auth and calls the `app-api` Edge Function; only the Edge Function uses its service-role key. Authenticated users must also be listed in `public.hosted_members`.

The local PostgreSQL database is still the source of truth until the hosted project is initialized. Do **not** push `database/exports`, `.local`, source PDFs or `data/imports/reading-assets` to GitHub. Purchased Cambridge content belongs in the private Supabase database/storage, accessible only to approved accounts.

## Initialize a new, empty Supabase project

1. Back up the local database with `npm run db:backup`. Run `npm run db:export` and `npm run db:export-personal`. The current export includes Reading/subject content and a separate private file for local vocab/progress. Neither export contains local passwords.
2. In the Supabase dashboard, create an email/password Auth user. Copy its Auth UUID. Disable open signups if this will be a personal site.
3. Set a **private** `HOSTED_DATABASE_URL` on your machine from the Supabase Connect panel. Apply `database/exports/schema.sql`, then `database/exports/content.sql`, then `supabase/hosted-schema.sql` using `psql -v ON_ERROR_STOP=1 -f <file>`. The exported schema contains historical destructive migrations and must be applied only to a new empty project. `hosted-schema.sql` enables RLS, revokes direct browser table access, creates the Edge Function RPCs and a private Reading image bucket.
4. Set `HOSTED_USER_ID` to the Auth UUID and run `npm run db:import-hosted-personal`. This inserts the allowlisted member/profile, assigns the imported Reading tests to that author, and maps the local account's decks, cards and existing practice history to that Auth UUID. The script uses `database/exports/personal-data.json` and does not upload local passwords. For a different account, export with `LOCAL_USER_ID` first.
5. Run `supabase login` on your own machine, then `supabase functions deploy app-api --project-ref <NEW_PROJECT_REF>` using the ref of the project that received the SQL import. The function configuration keeps JWT verification enabled. The project-provided `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` must remain Edge Function secrets. Never use the service-role key in `dist/`, GitHub Pages variables, or browser code.
6. If imported tests reference image figures, set `SUPABASE_URL` and the **private local** `SUPABASE_SERVICE_ROLE_KEY`, then run `npm run db:upload-reading-assets`. This uploads only referenced PNGs into the private bucket. Passage text and questions work without this step; image-dependent questions need their figures.

The generated content files are about 2.7 MB. A direct `psql` connection is more reliable than pasting this into the SQL Editor. The Supabase project URL and anon/publishable key are safe to expose in a browser build **only after** the hosted RLS/allowlist is in place. All account and progress writes still go through the Edge Function.

## Publish Pages

In GitHub repository **Settings → Secrets and variables → Actions**, add variable `SUPABASE_URL` and secret `SUPABASE_ANON_KEY`. In **Settings → Pages**, select **GitHub Actions** as the source. Push the repository to `main` or run the `Publish GitHub Pages` workflow manually. The workflow builds `dist/` and publishes it; it does not include the PostgreSQL server or private exports. This repository is now the account's user site at **https://k-iemmei.github.io/**. Internal links are relative and also work when previewed under `/my-note/` locally.

For a local static preview, set the public URL and anon key in the shell, run `npm run build:pages`, then `npm run preview:pages` and open `http://localhost:4173/my-note/`. `file://` is insufficient for ES modules and Auth requests.

## Current limits

There is no automatic migration of local password hashes into Supabase Auth; create a hosted Auth account separately. The Edge Function and hosted project cannot be exercised end-to-end until the project schema, member, function and files are deployed. Browser APKG import reads the package locally and posts batches of cards; it imports word/meaning/example/tags, while media attachments remain outside the database, matching the existing local importer. If an upload is interrupted, the partially created deck remains and can be removed manually.

## Home hub update

For an existing project, apply `database/migrations/015-home-hub.sql` and `database/migrations/016-home-gateway-permissions.sql` in a transaction before redeploying `app-api` and Pages. It only adds Home tasks/preferences and their account-scoped RPC; it does not modify study data. A fresh schema export includes this migration automatically. Home fetches headline RSS through the authenticated API and weather directly from Open-Meteo. Neither source requires a private API key for this personal site.
