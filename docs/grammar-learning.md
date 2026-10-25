# Book-aligned Grammar

## Source audit

The supplied `data/imports/EngInUse.pdf` is **English Grammar in Use, Fifth Edition**,
Raymond Murphy, Cambridge University Press, 2019, ISBN 9781108457651, 392 PDF pages.
PyMuPDF extracted every page into ignored `.local/grammar-source/` artifacts. The source
hash and textless-page audit are recorded in `content/book-curriculum.json`.
Contents on PDF pages 5–8 yielded 145 consecutive unit numbers in 16 subject groups.
All 145 theory pages were checked for the corresponding unit marker, not inferred
from a few opening pages. Theory page = 2 × unit + 12 in the PDF, followed by its
exercise page; printed theory page = 2 × unit. Units 132–136 have wrapped TOC titles.
Appendices, supplementary exercises, study guide, answer keys and index have explicit
printed/PDF page references. The blank page and illustration-only content are not
invented or converted into text exercises. Original page-level extraction stays private.

## What is available

The complete 145-unit roadmap follows the book's order. The first release provides
interactive Units 1–6 (Present and past): 36 original bilingual examples plus 36 variants,
114 original scored questions (8 quick + 6 deep + 5 assessment per unit) and 18 writing/
conversation scenarios. Original teaching notes explain meaning, context, common
confusions, and exceptions. The book supplies the sequence/reference; teaching notes,
examples and exercises are application-authored additions, visibly labelled in the UI.
No scanned pages, copied book exercises or answer keys are included in Pages assets.

Units 7–145 are visible **reference-only** entries, with exact page references; they do
not expose empty quizzes or claim completion. The previous 72 original lessons remain
available under supplementary material and old lesson URLs. Their browser progress is
left intact and is not equated with completion of new book units. CEFR labels from that
old course are not presented as publisher-assigned difficulty levels for the new units.

## Learning contract

`/api/grammar` loads account progress/reviews. PUT `/api/grammar/giu-001` saves reading
acknowledgement and merges writing drafts; POST `/api/grammar/giu-001/attempts` validates
answers, grades on the server and records an idempotent attempt UUID. Both API runtimes
share `domain/grammar.js` and the original question data. Client scores/owners are ignored.
Only the verified user identity reaches the service-role-only `app_grammar_api` RPC.
Migration 021 enables RLS on all three tables; hosted grants revoke direct browser access.

A unit completes only after reading acknowledgement **and** a best assessment score of
at least 80%. Opening a unit cannot complete it. Scores, completion, drafts and review
schedules persist by user in PostgreSQL. Device drafts/answer inputs are backed up under
an account-specific browser key; unsent inputs remain local until submission/save.

Controlled answers accept listed alternatives, common full/contracted forms, case,
whitespace and terminal punctuation variations. Arbitrary translations/free writing
are not falsely marked against a single exact answer. Practical tasks show a model and
self-review rubric; no AI scoring or conversational backend is claimed. Current scenarios
use a response/model workflow. Learners can retry objective exercises and see accepted
answers, explanations, their input, and rule hints (hints hidden during assessment).

Wrong answers are available for immediate practice and scheduled for tomorrow. Correct
reviews advance through 1, 3, 7, 14, 30 days; errors reset the streak. Repeated submission
of an existing attempt ID does not advance its schedule twice. The review filter locates
units with mistakes/due items; review mode drills those questions. Dashboard English
points/Reading/Listening tracking remain separate; Grammar does not invent point credit.

## Adding the next batch

Add original unit content in `content/book-lessons.js` using stable giu-NNN/question IDs.
Update readiness in the canonical curriculum JSON and its matching generated JS module;
keep book number/title/page references unchanged. Add a migration widening the interactive
unit allowlist in `grammar_unit_progress` and `app_grammar_api`, then extend content and
API tests. The UI and grading engine do not need a redesign. Include direct contrasts,
meaningful contexts, accepted alternatives, and actual explanations; do not duplicate
questions merely to increase counts.

For hosted deployment apply migration 021, then `supabase/hosted-grammar-migration.sql`,
and deploy `app-api` and Pages. Run unit/integration Grammar checks and
`npm run test:browser:grammar`. Browser coverage includes account persistence, saved
writing after clearing device drafts, reference-only units, both themes and 320–1440px.
