# Local PostgreSQL workflow

Configure `.env.local` from `.env.example`. `DATABASE_URL` must target localhost, 127.0.0.1 or ::1. The tools reject remote database hosts. Never commit `.env.local`, `.local` or generated exports. Create the local `my_note` database through psql/pgAdmin if needed.

```powershell
npm.cmd run db:backup
npm.cmd run db:setup
npm.cmd run dev
```

Open http://localhost:8000 and sign in with the existing `.local/developer-login.txt` account. `db:user` does not reset existing passwords. Local password hashes and token digests are stored in `app_private`; public `users` contains profile data.

## Migrations and content

`database/migrations` holds application schema, `database/local` holds local authentication tables, and `database/seeds` holds subjects and a Chinese example. There is no Reading seed. Add Reading content manually through `/admin.html`.

Migration `006-manual-reading.sql` deletes the legacy Reading tables and their attempts, then creates tests, passages, groups, questions and attempts for manual authoring. This is intentional and irreversible without a backup. The development database was backed up to `.local/backups/my-note-2026-10-04T12-43-51-882Z.dump` before applying it. Other subject content is preserved.

`app_private.migrations` records filenames and SHA-256 checksums. Migrations use an advisory lock and a transaction per file. Applied files are skipped on subsequent runs, including the Reading reset. Seeds do not replace authored Reading content. Never modify an applied migration; add `007-...sql` for the next schema change.

Question options, answer keys and metadata use JSONB. Correct answers stay on the server until submission; practice requests never include keys. Reading attempts store versioned response/review snapshots. The old crawler files, generated import SQL and legacy Reading seed have been removed from the active workflow.

## Backup and verification

`npm.cmd run db:backup` uses `pg_dump` to create a full recovery backup in `.local/backups`, including local accounts and progress. `npm.cmd run db:export` creates a different, portable content-only bundle; see [future database export](supabase-deployment.md).

```powershell
npm.cmd test
npm.cmd run test:integration
npm.cmd run test:browser
```

Integration and browser tests create isolated `my_note_test_<pid>_<timestamp>` databases, apply real migrations/seeds and remove those databases afterward. They require create-database privileges. If forcibly interrupted, check the exact leftover test database name and active connections before removing it. Normal tests do not change `my_note`.
