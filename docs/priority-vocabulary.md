# Priority vocabulary

The Vocabulary page defaults to a separate **Từ vựng ưu tiên** tab. Flashcards,
Anki import, daily limits, and their existing review history remain in the adjacent
**Flashcards / Anki** tab.

## Content

- 2,000 cards from the learner's `data/imports/vocab_list.txt`.
- 24 populated A–Z groups (the source has no X or Z entries).
- 3,696 Vietnamese senses and 2,500 contextual English examples.
- Senses follow the requested parts of speech. Homographs such as `counter`,
  `grave`, and `strip` retain separate cards with explanatory qualifiers.
- Wrapped source lines are joined before parsing; homograph numbers such as
  `console2` are removed from display. Clear input errors are corrected:
  `diplomatic` is an adjective and `versus` is a preposition.
- Input CEFR values are retained, including the B1 label for `specialize`.

Dictionary-derived senses and pronunciation come from
[thichhoc-dict](https://github.com/thichhoc-org/thichhoc-dict), with editorial
corrections and additional common senses. Contextual examples combine 991
original sentences with 1,509 selected WordNet 3.0 examples. WordNet examples may
include phrases as well as complete sentences. The count is not a claim that
every possible sense or usage is included.

The data is distributed under CC BY-SA 4.0. Full source and license notices are
accessible from **Nguồn nội dung** in the page and are packaged in
`apps/web/src/features/vocabulary/content/priority-attribution.txt`.

The raw learner file and downloaded source dictionaries stay in ignored local
directories. The reviewed application content lives in `content/priority/`.
`tools/content/priority-vocabulary-list.cjs` parses future input lists and derives
stable IDs from the headword and qualifier, independent of list order.

## Five manual study marks

Users mark the next box after each study pass. They can undo the most recent
mark. There is no daily cap and no quiz prerequisite for this list. All five
marks produce a green border and completion check on the card.

Progress is stored per authenticated user in `vocabulary_priority_progress`,
including timestamps and a revision. Server-side row locking and revision checks
reject duplicate or stale writes; the browser reloads progress on conflict.
Direct client access to the table and RPC is not granted on Supabase.

Filters combine a headword search, exact pass count (0–5), initial letter, and
CEFR level. Only 36 cards render initially; **Xem thêm từ** adds another 36.
Content modules load on demand by letter, in parallel with account progress.
Network failure leaves study controls disabled until progress can be loaded.

## Deployment and verification

Apply `database/migrations/024-priority-vocabulary.sql`, then
`supabase/hosted-priority-vocabulary-migration.sql` on hosted Supabase before
deploying `app-api` and publishing the frontend.

- `node --test tests/unit/priority-vocabulary.test.cjs`
- `node --test tests/integration/priority-vocabulary.test.cjs`
- `npm run test:browser:vocabulary`

Coverage includes list parsing, all 2,000 entries, exact filters, account isolation,
five passes and undo, concurrent writes, persistence after reload, A–Z selection,
pagination, Anki tab access, and light/dark layouts at 320–1440 pixels.
