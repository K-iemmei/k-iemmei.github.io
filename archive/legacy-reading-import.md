> Historical import notes. For current paths and setup use [database workflow](database-workflow.md). Commands below refer to the pre-refactor layout.

# Adding an IELTS Reading test

1. Add the test to `reading_tests` with a stable, URL-safe `slug`, its original source URL, and `status = 'draft'`.
2. Add its one to three passages to `reading_passages` in display order.
3. Add a `reading_question_groups` row for every instruction block, then add its questions. Set `options` to a JSON array for matching and multiple-choice sets.
4. Put accepted answers in `reading_questions.answer_key` as JSON: `"True"` for one answer or `["a", "the a"]` for acceptable variants. Review every answer before publishing.
5. Change the test status to `published`; it then appears in the library automatically.

Supported `question_type` values are defined by the `CHECK` constraint in [reading-db.sql](reading-db.sql). The UI renders radio choices for True/False/Not Given and Yes/No/Not Given, dropdowns for matching and multiple-choice sets, and text fields for completion, labels, and short-answer questions.

Keep `source_name` and `source_url` for attribution. Only import material that you are entitled to reproduce and serve; the Engnovate/Cambridge files currently in `data/` should be treated as a review source, not an automatically publishable seed.

Local import helper (Windows PowerShell):

1. Ensure you have `psql` (Postgres client) installed and accessible in PATH.
2. From the repo root run (fill in your connection details):

   ```powershell
   .\scripts\import-local-postgres.ps1 -PgConnection "host=localhost port=5432 user=postgres password=secret dbname=mydb"
   ```

3. The script runs `data/sql/reading-db.sql` then `data/sql/reading-cambridge-seed.sql`. After import, verify rows in `reading_tests` and then run the publish update when ready:

   ```sql
   UPDATE reading_tests SET status = 'published' WHERE slug LIKE 'cambridge-ielts-%';
   ```

Import to Supabase (recommended flow):

- Option A (direct): Use Supabase SQL editor or `psql` against your Supabase DB and run the same files in `data/sql/` (note: remove or adapt any RLS/extension statements if your Supabase project differs).
- Option B (safer): Import locally first, then export the rows you want (e.g., `reading_tests`, `reading_passages`, `reading_question_groups`, `reading_questions`) as INSERTs or use `pg_dump --data-only --table=reading_tests ...` and apply them to the Supabase instance.

Notes:
- `reading-db.sql` contains RLS policies and Postgres-specific functions (e.g. `gen_random_uuid()`). When copying to Supabase, run the schema first, then the seed. If your Supabase project does not allow `pgcrypto` extension, enable it first: `CREATE EXTENSION IF NOT EXISTS pgcrypto;`.
- Always review copyright and content licensing before publishing any Cambridge content to a public site.
