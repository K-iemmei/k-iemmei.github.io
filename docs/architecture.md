# Architecture

Express serves the HTML, assets and API on one local origin, default `http://localhost:8000`. PostgreSQL is the source of truth. The hosted build runs on GitHub Pages with Supabase Auth and an Edge Function API; see [Supabase deployment](supabase-deployment.md).

## Login and routing

`apps/web/routes.json` preserves the existing page URLs. `/` and `/index.html` serve login; other HTML routes authenticate before sending page content. `apps/web/src/app.js` checks the server session before initializing a protected feature. Login redirects to `dashboard.html`.

Passwords are verified against salted scrypt hashes in `app_private.credentials`. A random session token travels in an HttpOnly, SameSite=Strict cookie; PostgreSQL stores only its SHA-256 digest with a seven-day expiry. Logout revokes that session. Browser storage contains display profile data only and grants no access. Cookies are HTTP-compatible for loopback development; hosted use requires a separate security/deployment configuration.

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
