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

All 145 units are interactive and retain the verified book order and page references.
The complete course has 870 bilingual examples with 870 related variants, 2,755 controlled
practice/test questions, and 435 writing/conversation scenarios. Each unit has 8 quick,
6 deep and 5 assessment questions, with 3 application tasks and explicit self-review criteria.

Units 7–145 use six separately authored bilingual patterns per topic. The authoring modules
cover all book groups, including names/articles, non-defining clauses, verb/preposition
combinations and each phrasal-verb group. Context substitutions vary people, documents,
cities and devices without changing agreement. Questions vary the response task (gap,
controlled correction, ordering and discrimination), not just the question ID. The builder
expands these authored patterns; this is deterministic content, not live AI generation.
Each pattern includes its own explanation and explicit contrast. Models, translations,
contrasts, and teaching notes are application-authored additions, not copied book exercises.

No unit is left reference-only. The previous 72 lessons remain supplementary and old
browser progress is retained rather than converted into completion of the new course.
No PDF, extracted page text or book answer keys are included in Pages assets.

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

## Maintaining content

Update original unit content in `content/book-lessons.js` using stable giu-NNN/question IDs.
Update readiness in the canonical curriculum JSON and its matching generated JS module;
keep book number/title/page references unchanged. Migration 022 expands the existing allowlist to exactly giu-001 through giu-145 without
rewriting user data. Extend content and API tests when modifying a unit. The UI and grading engine do not need a redesign. Include direct contrasts,
meaningful contexts, accepted alternatives, and actual explanations; do not duplicate
questions merely to increase counts.

For hosted deployment apply migration 021, then `supabase/hosted-grammar-migration.sql`,
and deploy `app-api` and Pages. Run unit/integration Grammar checks and
`npm run test:browser:grammar`. Browser coverage includes account persistence, saved
writing after clearing device drafts, interactive Unit 145, both themes and 320–1440px.

For an existing six-unit deployment, apply migration 022 and redeploy app-api and Pages.
Comma placement is graded explicitly in Units 95–96; case, whitespace and terminal
punctuation remain tolerant. Zero-article gaps accept an em dash, hyphen, none or no article.
