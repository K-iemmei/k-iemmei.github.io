# Reading PDF conversion

The Cambridge 1–4 local import contains 48 single-passage exercises and 638 questions.
Passage bodies and question prompts are text. Completion groups use numbered `{{n}}`
markers in `metadata.summary`, so answers appear inside the text. Original book
question numbers remain in `question.metadata.source_number`.

Diagrams that are required to answer questions use `group.metadata.figures`:

```json
{
    "figures": [{ "file": "cambridge-1-p053-figure.png", "label": "A beehive: labels 20–23" }]
}
```

Figure files live in the private `data/imports/reading-assets/` directory. The API
serves only filenames referenced by a test accessible to the logged-in user.
Do not attach full-page scans as `source_pages` to text-based exercises: that older
field selects the image-based passage view.

Private conversion artifacts are under `data/imports/extracted/cambridge-1-4/native/`:

- `reading-tests.json`: editable, validated native content.
- `before-conversion.json`: the previous image-based records.
- `conversion-report.json`: preserved test IDs, versions and reference-check scope.
- `verification-report.json`: browser, question-control and grading checks.

The conversion updated existing test IDs through the reading repository. Existing
attempt snapshots were preserved. Cambridge 1–3 retain 478 answers transcribed from
the supplied answer keys. The supplied Cambridge 4 PDF lacks its Reading answer key;
its 160 questions remain ungraded drafts, accessible to their author.

Engnovate was used to cross-check selected OCR ambiguities in Cambridge 1 Test 1
and Cambridge 2 Test 4. This is not a claim that every passage was verified against
the website; Cambridge 4 Test 4 returned HTTP 429 during checking. The supplied PDFs
remain the primary source.

Run the database-backed app with `npm run dev`, then open `http://localhost:8000/`.
The root route opens login. Private PDF/OCR artifacts are not application dependencies
and must not be added to a public content seed.

## Cambridge 5-10: native text import

The six locally supplied books were converted into 72 single-passage exercises
(24 original tests, 960 questions). Answer keys were transcribed from the supplied
books. Completion groups contain 191 inline blanks; six necessary diagrams remain
private images. Passage bodies and question text are editable text, not page scans.
Selected faded OCR fragments were cross-checked online; this was not a complete
word-by-word web verification. Minor OCR errors may still require author edits.

Private artifacts are in `data/imports/extracted/cambridge-5-10/`:

- `reading-tests.json`: normalized import content.
- `validation-report.json`: question, placeholder, figure and answer checks.
- `pre-import-records.json`: original record identifiers and versions.
- `import-report.json`: 72 created records; the previous 66 records were preserved.
- `verification-report.json`: browser checks, generated after successful verification.

The database was backed up before import under `.local/backups/`.
The private build, audit, import and browser scripts remain under `.local/`.
Do not commit the PDFs, OCR text, credentials or generated book content.

Linked text answers may include `answer_key.aliases`, containing `{ value, answer }`
objects. Each alias maps to an existing canonical answer. The grader resolves aliases
before enforcing distinct-answer credit, so equivalent spellings cannot score twice.
The private diagram filename validator accepts Cambridge books 1 through 21, while
requiring authentication and a matching figure reference on the requested test.

Run `npm.cmd run dev` and open `http://localhost:8000/`, log in, then open
`http://localhost:8000/english-reading-library.html`. The library keeps 15 cards per page.
If port 8000 is already occupied by this app, use the running instance.
If the app was started before these code changes, stop it with Ctrl+C in its
terminal and run `npm.cmd run dev` again to load the updated grader and asset routes.
Do not start a second server on an occupied port.

Verification completed: all 72 exercises rendered in the browser with 960 answer
controls and all reference submissions scored 100%. Login, library pagination,
private figure access, answer-key redaction, mobile answer preservation and overflow
checks passed with no browser errors. Synthetic attempts were removed after testing.
`npm.cmd test` passed 13 tests; `npm.cmd run check` checked 61 JavaScript files.
