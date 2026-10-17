# Private Notes and shared Blog

Open **Note** or **Blog** from the workspace sidebar. `notes.html` lists the signed-in user's notes; `note.html?id=<uuid>` opens the editor. `blog.html` lists posted articles from all signed-in users, and `post.html?id=<uuid>` opens a published article. Blog is shared within the authenticated app, not an anonymous public site.

## Editing and posting

Notes autosave to PostgreSQL/Supabase. **Save privately** saves immediately; **Post to Blog** saves the note and publishes a separate snapshot, then opens its Blog article. Later edits remain private until **Update post**. **Unpublish** removes the shared snapshot while keeping the note. Deleting a note also removes its published article and attachments after an explicit dialog in the app.

Updates include the note version. A stale tab gets a conflict instead of overwriting a newer revision. Unsaved input is backed up per user and note in local browser storage. When a backup is available, the editor offers Restore draft or Keep saved version. Backups are not a substitute for a successful server save.

## Rich content

The editor supports Write, Split and Preview views. On narrow screens it uses Write/Preview. The toolbar inserts examples for headings, emphasis, lists, quotes, fenced code, LaTeX, tables, charts, Mermaid diagrams and uploaded images.

- Inline LaTeX: `$E=mc^2$`. Display LaTeX: put `$$` on separate lines around the formula.
- Code: fenced blocks such as `python`, `javascript`, `typescript`, `sql`, `json`, `html`, `css`, `bash`, `java`, `cpp` or `yaml`. Unknown languages remain escaped plain text. Code is never executed.
- Charts: a `chart` fence containing JSON with `type`, `title`, `labels`, and `datasets` (`label` and finite numeric `data`). Supported types: bar, line, pie, doughnut and radar. Each chart exposes its data in a table. User callbacks and chart options are not executed.
- Diagrams: a `mermaid` fence. Rendering runs in strict mode without HTML labels or clickable links; input configuration directives are rejected.
- Images: upload PNG, JPEG, GIF or WebP up to 2 MB. The app checks MIME and magic bytes. Uploaded images are stored as base64 records in `note_assets`, referenced by `![alt](note-asset:<uuid>)`. HTTPS image URLs also work, but externally hosted images remain under that external host's control.

Raw HTML is displayed as text. Rendered Markdown, mathematical HTML and diagram SVG are sanitized. Bundled local assets provide Marked, DOMPurify, KaTeX, Highlight.js, Chart.js and Mermaid; the renderer does not require a third-party script CDN. Chart and diagram libraries load only when needed.

## Access control

Both runtimes use `app_notes_api`, passing the authenticated user ID from the server. Personal list/get/save/delete/upload/publish/unpublish operations enforce ownership. Other users see only `blog_posts` snapshots. Uploaded images are readable by their owner, or by signed-in readers when that exact image is referenced by the current published snapshot of its parent note. A new private attachment cannot be read simply because an older version of the note is posted. Unpublishing revokes future reads; already downloaded copies cannot be recalled.

Tables use RLS with direct browser access revoked in the hosted migration. The gateway is not executable by `anon` or `authenticated`; only the Edge Function service role can call it. Public API responses do not expose other users' private note content or attachments.

## Setup and deployment

Local:

```powershell
npm.cmd ci
npm.cmd run db:migrate
npm.cmd run dev
```

The development server lazily bundles rich rendering assets into a gitignored `.local/rich-assets-*` directory when the first editor or article requests them, without blocking other API routes. The Pages build bundles the same files into `dist/vendor/rich/`, including KaTeX fonts and library license notices.

On the existing hosted project, apply only these additive files, deploy `app-api`, then publish a fresh Pages build:

```powershell
psql -w "$env:HOSTED_DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/014-notes-and-blog.sql
psql -w "$env:HOSTED_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/hosted-notes-migration.sql
supabase.cmd functions deploy app-api --project-ref skqtgplnejbujyejqilu
```

## Checks

`npm.cmd test` covers request validation, image checks, chart schemas and hosted user binding. `npm.cmd run test:integration` checks two-account isolation, publication snapshots, optimistic versions, attachment privacy, unpublishing and deletion against a real temporary database. `npm.cmd run test:browser:publishing` checks the complete UI and all rich formats in Chrome, including script injection attempts, dark mode and mobile width. Preview screenshots are saved under the gitignored `.local/publishing-preview/` directory.
