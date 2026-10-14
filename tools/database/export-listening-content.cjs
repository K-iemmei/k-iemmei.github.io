const fs = require('node:fs');
const path = require('node:path');
const { pool } = require('../../apps/api/database-pool');
const root = path.resolve(__dirname, '../..');
(async () => {
    const result =
        await pool.query(`SELECT id,slug,book_number,test_number,part_number,title,question_text,
        first_question,last_question,transcript,answer_key,audio_filename,source_pages,status,created_at,updated_at
        FROM public.listening_sessions ORDER BY book_number,test_number,part_number`);
    const rows = JSON.stringify(result.rows);
    const sql = `BEGIN;
INSERT INTO public.listening_sessions
    (id,slug,book_number,test_number,part_number,title,question_text,first_question,last_question,transcript,answer_key,audio_filename,source_pages,status,created_at,updated_at)
SELECT id,slug,book_number,test_number,part_number,title,question_text,first_question,last_question,transcript,answer_key,audio_filename,source_pages,status,created_at,updated_at
FROM jsonb_populate_recordset(NULL::public.listening_sessions, '${rows.replace(/'/g, "''")}'::jsonb)
ON CONFLICT(slug) DO UPDATE SET question_text=EXCLUDED.question_text,source_pages=EXCLUDED.source_pages,
    transcript=COALESCE(public.listening_sessions.transcript,EXCLUDED.transcript),updated_at=now();
COMMIT;
`;
    const target = path.join(root, '.local/listening-content.sql');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, sql);
    console.log(
        `Exported ${result.rows.length} Listening sessions to .local/listening-content.sql`,
    );
})()
    .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
