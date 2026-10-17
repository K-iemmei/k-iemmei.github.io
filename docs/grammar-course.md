# English Grammar

Open **English → Grammar** (`english-grammar.html`). The course contains 72 original bilingual lessons in 12 groups, progressing from sentence foundations to advanced structures and grammar in context. A1–C1 labels indicate the suggested course sequence, not an accredited level assessment.

Each lesson includes a Vietnamese explanation, three theory sections with patterns, two English examples with Vietnamese translations and practical contexts, a contextual mistake/correction, and one short multiple-choice check with feedback. References link to British Council and Cambridge for further reading. The course content is written for this app rather than copied from those sites.

Search supports English, Vietnamese and Vietnamese without diacritics. Users can filter by level or completion, save lessons, continue the last opened lesson, and navigate directly with `?lesson=<id>`. Completion is a manual reading marker; answering one question correctly does not automatically mark a topic as learned.

Progress and saved lessons are stored per app user in this browser under `grammar-progress:<userId>`. They do not sync to Supabase or another browser. Lessons remain available if a progress write fails; a visible message explains that saving failed.

## Editing lessons

The curriculum lives in `apps/web/src/features/grammar/content/`, grouped into six files. `lesson.js` maps authored arrays into the reader's data model. Keep IDs stable to preserve existing completion markers and links. `grammar-course.js` assembles groups, search metadata and references. `grammar-page.js` renders the library, reader and quiz; `grammar.css` uses the shared pale-blue design tokens and supports both themes.

The existing local route map and Pages build include Grammar automatically. No database migration or Edge Function change is needed for this feature. Restart a running local server after adding the route; publish a fresh Pages build to update the hosted site.

## Validation

```powershell
npm.cmd test
npm.cmd run test:browser:grammar
npm.cmd run check
npm.cmd run format:check
```

The browser workflow renders every lesson and checks searching, filtering, direct links, quiz feedback, progress persistence, bookmarks, history navigation, invalid links, theme persistence and mobile width. Screenshots are written to the gitignored `.local/grammar-preview/` directory. The build test packages Grammar in an isolated temporary directory without replacing a developer's `dist/` or requiring hosted credentials.
