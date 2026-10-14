# Tools

- `database`: supported local database lifecycle and portable Supabase export.
- `project`: static build and source checks.
- `content`: optional parsers/importers using the shared local DATABASE_URL. Not part of app startup.
- `content/legacy`: historical manifest/text adapters retained for import compatibility.
- `audio`: standalone Python text-to-speech utility; its environment is ignored by Git.

Run tools from the repository root, preferably through package.json scripts. Generated SQL belongs in database/exports, never mixed with immutable migrations. Old destructive/import helpers live in archive and are not active entrypoints.
