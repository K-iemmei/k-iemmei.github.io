# My Note

A learning app for English, Chinese and Data / AI / ML. Local development uses Express and PostgreSQL; the hosted build is static HTML/CSS/JS on GitHub Pages with Supabase Auth, an Edge Function API and PostgreSQL.

## GitHub Pages build

`npm.cmd run build:pages` writes `dist/` when `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set. The Pages workflow publishes that folder at **https://k-iemmei.github.io/**. The static bundle contains no database password, service-role key, original book files, private images or SQL console. Hosted setup and the local-to-Supabase data transfer are documented in [Supabase deployment](docs/supabase-deployment.md).

Run `npm.cmd run preview:pages` after building to preview the same project path at **http://localhost:4173/my-note/** without starting Express API or local PostgreSQL.

## Run locally

Requirements: Node.js 24+, PostgreSQL 17+ and an existing local `my_note` database. Configure `DATABASE_URL` in `.env.local` using `.env.example`; keep credentials out of source control.

```powershell
npm.cmd ci
npm.cmd run db:setup
npm.cmd run dev
```

Open **http://localhost:8000/**. The root opens login. The local app continues to use its Express session and same-origin API; the GitHub Pages build uses Supabase Auth.

The existing developer credentials are in `.local/developer-login.txt`. `db:user` preserves existing passwords. For a new account, set `LOCAL_USERNAME` and `LOCAL_PASSWORD` in the shell before running `npm.cmd run db:user`; otherwise it generates a password. PostgreSQL stores salted scrypt hashes, not plaintext passwords. The private login file is only a local convenience and is gitignored.

## Author Reading content

From **English > Reading Library > Create reading test**, or `/admin.html` after login:

1. Enter category, title, lowercase slug, description and draft/published status.
2. Add passages, question groups and questions. Choose a group type to display its form.
3. Enter headings/options and correct answers. Option lines use `A | Option text`. Text answers accept alternatives on separate lines; list selection accepts comma-separated option IDs.
4. Save, then open the practice link. Submit answers to receive a server-graded result and saved attempt history.

Supported types: matching headings, choose heading, classification, summary completion, sentence completion, True/False/Not Given, Yes/No/Not Given, multiple choice, short answer and list selection. Drafts may leave answer keys empty; unkeyed questions are saved as ungraded. Publishing requires all answer keys. Published tests appear in the library; drafts are visible to their author. Authors can reload and edit their own tests. Version checks prevent stale edits/submissions.

Listening has a per-part library, IELTS question mode, dictation, a protected MP3 player and saved attempts. See [Listening workflow](docs/listening-workflow.md) for PDF OCR coverage, local/hosted migrations and audio file naming.

Migration `006-manual-reading.sql` deliberately resets the old Reading tables and attempts once. Old crawled Reading content and its seed/import workflow have been removed. Re-running migrations or seeds preserves newly authored tests. Back up an existing database before first applying this migration.

## Layout

```text
apps/api/                 Express server, auth, Reading and database API
apps/web/pages/           HTML grouped by feature
apps/web/src/core/        HTTP client, session and shared browser infrastructure
apps/web/src/features/    Feature pages, repositories, adapters and renderers
apps/web/styles/          Shared and feature styles
apps/web/routes.json      Existing URL-to-page mapping
database/                See directories below
```

`database/migrations` holds ordered schema migrations, `database/local` local auth, and `database/seeds` subject/Chinese seed data. `tools/database` contains database commands. `tests` contains unit, PostgreSQL integration and real-browser tests. `archive` holds retired tools/prototypes and is not part of the runtime. `.local` holds private login details/backups; `database/exports` holds generated content exports. Both are gitignored.

## Verification and database commands

```powershell
npm.cmd run check
npm.cmd test
npm.cmd run test:integration
npm.cmd run test:browser
npm.cmd run format:check
npm.cmd run db:backup
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run db:export
```

Integration/browser tests create and remove isolated `my_note_test_*` databases and require PostgreSQL create-database privileges. Browser tests use Puppeteer's Chrome and the real Express server. The optional `node tests/browser/smoke.cjs --live` uses the existing developer account on port 8000 and deliberately creates a demonstration Reading test and attempt in the development database; run it only once with that port free.

`db:export` writes a database-only bundle for a future empty PostgreSQL/Supabase database. It does not upload, deploy a website or configure hosted authentication. See [database workflow](docs/database-workflow.md), [architecture](docs/architecture.md) and [future database export](docs/supabase-deployment.md).
