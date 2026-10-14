# Reading content review (2026-10-11)

The local PostgreSQL database was backed up to `.local/backups/my-note-2026-10-11T14-51-22-067Z.dump` before this review. The audit covered the 132 published Cambridge single-passage tests from books 1–10 and 20. It left the three other Reading passages unchanged.

The review regenerated `content_html` from the stored passage text, preserving paragraph breaks and formatting identifiable section headings, paragraph labels, introductory blurbs, source notes and bullets. It corrected clear OCR defects in 15 passages, including major reconstruction of Cambridge 2 Test 3 Passage 1 (nursing), Cambridge 3 Test 4 Passage 1 (air pollution), and Cambridge 10 Test 1 Passage 1 (stepwells). The Cambridge 10 Test 1 Passage 2 dates, chemical notation and misspelled words were also corrected. The practice stylesheet now renders those semantic blocks without forcing OCR whitespace into the layout.

This was a broad structural audit plus targeted source comparison, **not** a page-by-page proofread of every word in all 132 passages. The user's local PDFs are the primary reference. Online copies were used to cross-check selected passages, but some mirror sites reproduce the same OCR errors. Do not infer that a passage is authoritative solely because another website has the same text. Cambridge 2 Test 2 Passage 1 still contains an incomplete sentence present in the available source scan and needs a better source to resolve it confidently.

Private one-time audit and correction scripts, the before/after report, and the backup are under `.local/` and are intentionally excluded from version control. To verify the current database, run `node .local/audit-reading-content.cjs`, `npm run check`, and `npm test`.
