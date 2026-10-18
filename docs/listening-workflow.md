# Listening practice workflow

Listening is split into one independently playable session per Cambridge test part. The English Listening library opens `english-listening.html?session=cambridge-20-test-1-part-1`, where learners can submit IELTS answers or a dictation. Attempts are stored per user. The API never sends answer keys or audioscripts before submission.

## Source material and current coverage

`npm run db:import-listening-pdf` OCRs **Cambridge 20, Test 1, Parts 1–4** from the user-provided `data/imports/Cambridge IELTS 20 Academic.pdf`. Question sheets come from PDF pages 5–11 and audioscripts from pages 150–160. The import is repeatable: it refreshes page references and fills empty question/transcript fields, while preserving existing non-empty text and answer keys so reruns cannot overwrite editorial corrections. Initial OCR text is a draft and must be proofread against the PDF before adding answer keys or publishing a session. The supplied PDF pages checked so far do not provide a verified answer key for these parts, so exam attempts are saved without a score until keys are entered. Dictation shows an approximate word-match score against the stored audioscript after submission.

The 2026-10-18 review corrected all four worksheets and transcripts, including source-document mistakes and broken inline blanks. These corrections were subsequently synchronized to the existing Supabase project on the same date. Missing audio, uncertain names and incomplete source dialogue still prevent claiming an exact audio transcription. See [Reading and Listening content review](reading-listening-review.md) for scope, remaining uncertainties and deployment verification. Future local edits still require an explicit hosted update.

The OCR model is kept outside Git in `.local/eng.traineddata.gz`. If it is absent, download `https://tessdata.projectnaptha.com/4.0.0/eng.traineddata.gz` into that path before running the importer. OCR page cache is in `.local/listening-ocr/` and is also ignored. The source PDF and extracted question/audioscript text are never included in the Pages build or Git commit.

## Local setup

1. Run `npm run db:migrate` to create `listening_sessions` and `listening_attempts` locally.
2. Run `npm run db:import-listening-pdf` to import the four Cambridge 20 Test 1 parts.
3. Run `npm run dev` and open **English → Listening**.

MP3 files can be added later with names such as `0-cam20-test-1-part-1.mp3`. Place them in `data/imports/listening-audio/` (preferred), `data/imports/`, or `data/`. These paths are gitignored. The local API serves only the filename recorded for an accessible Listening session.

## Hosted Supabase setup

On the existing hosted project, apply only the new incremental migration; **do not rerun the initial `database/exports/schema.sql`**:

```powershell
psql -w "$env:HOSTED_DATABASE_URL" -v ON_ERROR_STOP=1 -f database/migrations/011-listening-practice.sql
psql -w "$env:HOSTED_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/hosted-listening-migration.sql
npm run db:export-listening
psql -w "$env:HOSTED_DATABASE_URL" -v ON_ERROR_STOP=1 -f .local/listening-content.sql
supabase.cmd functions deploy app-api --project-ref skqtgplnejbujyejqilu
```

After adding MP3 files, set `SUPABASE_URL` and the **private local** `SUPABASE_SERVICE_ROLE_KEY`, then run `npm run db:upload-listening-audio`. The upload goes to a private `listening-audio` bucket. The Edge Function issues a short-lived signed URL to a signed-in app member. Never put the service key or MP3 files into GitHub Pages or Git.
