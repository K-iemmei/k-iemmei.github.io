# Product review — 2026-10-18

The existing product is a language-learning workspace: Reading authoring and grading, Listening exams and dictation, Grammar, vocabulary decks, study tracking, private Notes and shared Blog posts. Local Express/PostgreSQL and hosted Pages/Supabase share browser API contracts. This review covered source, configuration, Git history and the existing automated checks; it is not an exhaustive visual audit of every page.

## Findings and changes

| Category         | Priority | User impact                                                                                                                                             | Resolution                                                                                                                                                                      |
| ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Data reliability | P1       | Ctrl+S after a failed note load could create an unrelated empty note. Formatting shortcuts could change the body while publishing or uploading.         | Guard saves until initialization succeeds; block editing shortcuts and toolbar insertion during busy/conflicted states. Add a browser regression for failed-load Ctrl+S.        |
| Functional bug   | P2       | Repeated vocabulary form submissions could create duplicate decks/cards.                                                                                | Disable submit buttons while requests and subsequent refreshes run; restore them on failure.                                                                                    |
| Functional bug   | P2       | Repeated pagination clicks could append the same cards, network errors escaped without feedback, and stale responses could overwrite refreshed content. | Disable pagination while loading, show errors with retry available, preserve offsets on failure, ignore superseded responses. Add behavior tests for retry and stale responses. |
| Documentation    | P3       | Architecture documentation incorrectly denied the existing hosted deployment.                                                                           | Link the Pages/Supabase deployment guide.                                                                                                                                       |

## Remaining work and proposals

These are proposals, not implemented features. No production deployment or development-data migration was performed.

| Priority | Proposal                                                                                                                                                         | Benefit                                                                                | Effort and dependencies                                                                                |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| P2       | Make hosted APKG imports resumable or transactional. The current browser creates a deck and uploads batches; a later failure can leave a partial import.         | Clear recovery after interrupted imports; avoid accidental duplicate imports.          | Medium/high; coordinate browser and Edge Function persistence, batch identifiers and failure feedback. |
| P2       | Use the configured vocabulary study timezone for the activity chart calendar. It currently uses the browser date while the API aggregates in the saved timezone. | Correct day labels when traveling or crossing midnight.                                | Low; shared timezone date helper and boundary tests.                                                   |
| P2       | Add real-browser vocabulary coverage for create, add, pagination, reveal and review.                                                                             | Exercise frontend/backend interactions beyond unit coverage.                           | Medium; existing isolated PostgreSQL fixture and working Chrome runtime.                               |
| P3       | Provide an accessible audio player for vocabulary cards that already accept an audio path.                                                                       | Make the stored pronunciation reference useful during study.                           | Medium; define permitted local/hosted sources and protected asset loading first.                       |
| P3       | Add hosted end-to-end parity checks for authentication and the main learning flows.                                                                              | Catch differences between Express routes and the separately implemented Edge Function. | Medium/high; isolated Supabase test project and CI credentials.                                        |

## Verification

- `npm.cmd run check`: passed for the original 112 JavaScript files and browser imports; changed browser modules also passed formatting and were included in the successful unit build.
- `npm.cmd test`: 28/28 existing tests passed after running outside the filesystem sandbox. The sandbox run failed only in esbuild directory resolution. The build test packaged 17 static pages in an isolated temporary directory.
- `npm.cmd run test:integration`: 4/4 passed against isolated test databases, including publication privacy, image authorization, version conflicts, Reading and Listening.
- `node --test tests/unit/vocabulary-page.test.cjs`: both new pagination regression tests passed.
- `npm.cmd run format:check`: passed. A subsequent targeted Prettier check also passed for all changed and new files.
- `npm.cmd run test:browser:publishing`: passed outside the sandbox, including failed-load Ctrl+S, autosave, image upload, publication privacy, unpublish, XSS protection, dark mode and mobile layout. An initial regression in busy-state image insertion was corrected before the successful rerun.
- Browser smoke initially could not launch Chrome in the sandbox (20-second launch timeout and temporary-profile lock); that complete Reading browser workflow remains unverified in this run. The Reading integration suite passed.
- Final syntax checks passed for both changed browser modules and the publishing browser test.

There are no dedicated lint or TypeScript-check scripts in package.json. The `check` script performs JavaScript syntax and browser-import checks. Existing changes to node_modules and untracked archive directories were preserved.
