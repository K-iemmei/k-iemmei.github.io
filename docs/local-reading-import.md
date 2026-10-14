# Importing a local reading book

The importer accepts a JSON array using the same test/passages/groups/questions contract as the authoring API. It validates all tests before writing, creates each test in a transaction and skips existing slugs without overwriting authored content. It is safe to rerun after an interrupted import. Set `LOCAL_USERNAME` to choose the author; by default the username is read from the gitignored `.local/developer-login.txt` file. No password is needed by this local database command.

```powershell
node tools/database/import-reading.cjs data/imports/extracted/cambridge-20/reading-tests.json --dry-run
npm.cmd run db:backup
node tools/database/import-reading.cjs data/imports/extracted/cambridge-20/reading-tests.json
```

## Cambridge IELTS 20 import, 2026-10-05

Source: the user-provided `data/imports/Cambridge IELTS 20 Academic.pdf` (184 scanned pages). Windows OCR was run locally; no book content was sent to an external service. The private `data/imports/extracted/cambridge-20/manifest.json` records the source SHA-256, page ranges and transcription notes. The same folder contains per-page OCR with word coordinates and normalized `reading-tests.json`.

Reading ranges are PDF pages 13-28, 49-64, 88-103 and 124-138. The extraction contains four tests, twelve passages and 160 original numbered answer slots. Listening, Writing, Speaking and audioscripts were excluded. Option-based summary completion and matching statements use shared choices; paragraph headings preserve section labels. Choose-TWO tasks keep two numbered letter-answer slots.

The supplied PDF does not include the Reading answer-key section even though the original contents page lists one. Its final pages contain listening audioscripts. No answer keys were invented or fetched elsewhere. All four tests are drafts with empty answer arrays, visible to their author in the library and authoring page. Read and answer them normally; submissions are saved as ungraded, not 0%. Add verified keys and proofread OCR before publishing. The validator blocks publication until every answer is present.

There are source-layout defects recorded in the private manifest. In particular, Test 3 questions 22-23 have choices labelled B-F after a prompt mistakenly labelled A, although the directions say A-E; the five answer options were normalized to A-E. Missing coral-passage section labels were restored by section order. OCR is not a guarantee of verbatim accuracy; these remain reviewable drafts.

The source PDF, extracted content, local OCR/build scripts and database backups are private/gitignored. They are not fixtures or seeds and are not uploaded by this import. Previously authored tests are preserved.

## Single-passage practice and inferred answers, 2026-10-06

At the user's request, the four full tests were split into twelve published single-passage tests. Each has 13 or 14 questions, and original book question numbers are preserved through `metadata.source_number`. The four original records are archived and hidden from the normal library; their IDs, content and attempt history are retained. An author can still open them directly or from authoring.

All 160 answer slots now have AI-inferred answers and explanations based on the supplied text. These are not official Cambridge keys. Provenance is visible before practice and in answer reviews. Test 4 Passage 1 question 13 is marked for review: the inferred answer is Not Given because the passage supplies no comparison of how many works were produced in each period.

Choose-TWO tasks keep two separately scored slots. Their `answer_key.distinct_group` values link the slots within one question group; both slots share the same accepted answers. The grader accepts either order, counts each distinct correct answer once, and can award one of two marks. Validation rejects inconsistent linked keys. This linkage is preserved when editing an imported test.

Private artifacts in `data/imports/extracted/cambridge-20/`:

- `source-before-split.json`: original records before splitting.
- `reading-passages-with-answers.json`: twelve normalized test definitions with keys.
- `inferred-answer-review.json`: all inferred answers, reasoning and review priorities.
- `split-import-report.json`: created IDs, archived IDs and provenance.

A full database backup was made before this change. Browser verification covers all twelve passages, original question numbering, server grading including reversed linked answers, explanation review and author reload. Temporary verification attempts are removed; learner history is preserved.

## Cambridge 1-4 Academic import, 2026-10-07

Imported the user-supplied PDFs from `data/imports/` as 48 single-passage practice tests. Original question numbering is retained: Cambridge 1 has 158 questions (the four original tests contain 40, 41, 38 and 39), Cambridge 2 and 3 each have 160. These 36 passages are published with 478 answer slots transcribed from the answer keys in the supplied files. Linked multi-answer slots accept either order without duplicate credit; Cambridge 3 Test 4 question 16 requires both selected options for its one mark.

Cambridge 4 contributes 12 drafts / 160 questions. This particular 102-page scan contains Academic papers and listening keys, but no Reading keys or General Training papers. Its submissions are saved as ungraded. No answer keys have been inferred or downloaded for this import. General Training sections in books 1-3 have not been imported in this Academic batch.

These imports use original source-page images plus a numbered answer sheet, rather than a full transcription into native question-group forms. This preserves diagrams, tables, layout and text affected by broken PDF font encodings. Click a source page to enlarge it. Letter and heading answers use the original labels; text responses follow the limits printed in the original question. Existing manually authored content, including inline completion, is unchanged.

Images live in the private `data/imports/reading-assets/` directory. Group JSONB metadata stores validated `source_pages` references, retained when an author edits the test. `/api/tests/:slug/source-pages/:filename` requires authentication and checks that the image belongs to an accessible test. Source PDFs and answer-key pages are not served. Both the database and these image assets must be retained when backing up or migrating these tests; the SQL export alone does not include image files.

Private import artifacts in `data/imports/extracted/cambridge-1-4/` include `reading-tests.json`, `manifest.json` (source hashes and exact page ranges), `import-report.json`, and `verification-report.json`. The pre-import database backup is `.local/backups/my-note-2026-10-07T11-52-04-226Z.dump`. The importer skips existing slugs on reruns and preserves existing tests and learner attempts.
