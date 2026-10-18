function createReadingRepository(db) {
    async function detail(field, value, userId, author = false) {
        const client = await db.connect();
        try {
            await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
            const rows = await client.query(
                `SELECT * FROM public.reading_tests WHERE ${field}=$1 AND ${author ? 'created_by=$2' : "(status='published' OR created_by=$2)"}`,
                [value, userId],
            );
            const test = rows.rows[0];
            if (test) {
                const passages = await client.query(
                    'SELECT * FROM public.reading_passages WHERE test_id=$1 ORDER BY passage_order',
                    [test.id],
                );
                const groups = await client.query(
                    'SELECT * FROM public.reading_question_groups WHERE passage_id=ANY($1::uuid[]) ORDER BY group_order',
                    [passages.rows.map((p) => p.id)],
                );
                const questions = await client.query(
                    'SELECT * FROM public.reading_questions WHERE group_id=ANY($1::uuid[]) ORDER BY question_order',
                    [groups.rows.map((g) => g.id)],
                );
                test.passages = passages.rows.map((p) => ({
                    ...p,
                    groups: groups.rows
                        .filter((g) => g.passage_id === p.id)
                        .map((g) => ({
                            ...g,
                            questions: questions.rows.filter((q) => q.group_id === g.id),
                        })),
                }));
            }
            await client.query('COMMIT');
            return test || null;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    return {
        async list(userId, author = false) {
            const result = await db.query(
                `SELECT id,category,title,slug,description,status,version,updated_at,
                    COALESCE((SELECT MAX(100.0 * a.correct_count / a.total_count)
                        FROM public.reading_attempts a
                        WHERE a.test_id=reading_tests.id AND a.user_id=$1 AND a.total_count>0), 0) AS best_score_percent
                    FROM public.reading_tests WHERE ${author ? 'created_by=$1' : "status='published' OR (created_by=$1 AND status <> 'archived')"} ORDER BY updated_at DESC`,
                [userId],
            );
            return result.rows;
        },
        findBySlug: (slug, userId) => detail('slug', slug, userId),
        findForAuthor: (id, userId) => detail('id', id, userId, true),
        async save(data, userId, id, version) {
            const client = await db.connect();
            try {
                await client.query('BEGIN');
                let test;
                if (id) {
                    const updated = await client.query(
                        'UPDATE public.reading_tests SET title=$1,slug=$2,category=$3,description=$4,status=$5,version=version+1,updated_at=now() WHERE id=$6 AND created_by=$7 AND version=$8 RETURNING *',
                        [
                            data.title,
                            data.slug,
                            data.category,
                            data.description,
                            data.status,
                            id,
                            userId,
                            version,
                        ],
                    );
                    test = updated.rows[0];
                    if (!test)
                        throw Object.assign(
                            new Error(
                                'Test missing, not owned, or changed in another tab. Reload before saving.',
                            ),
                            { status: 409 },
                        );
                    await client.query('DELETE FROM public.reading_passages WHERE test_id=$1', [
                        id,
                    ]);
                } else {
                    const inserted = await client.query(
                        'INSERT INTO public.reading_tests(title,slug,category,description,status,created_by) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
                        [
                            data.title,
                            data.slug,
                            data.category,
                            data.description,
                            data.status,
                            userId,
                        ],
                    );
                    test = inserted.rows[0];
                }
                for (const [pi, passage] of data.passages.entries()) {
                    const p = await client.query(
                        'INSERT INTO public.reading_passages(test_id,passage_order,title,content,content_html) VALUES($1,$2,$3,$4,$5) RETURNING id',
                        [
                            test.id,
                            pi + 1,
                            passage.title,
                            passage.content,
                            passage.content_html || '',
                        ],
                    );
                    for (const [gi, group] of passage.groups.entries()) {
                        const g = await client.query(
                            'INSERT INTO public.reading_question_groups(passage_id,group_order,group_type,title,instructions,options,metadata) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',
                            [
                                p.rows[0].id,
                                gi + 1,
                                group.group_type,
                                group.title,
                                group.instructions,
                                JSON.stringify(group.options),
                                JSON.stringify(group.metadata),
                            ],
                        );
                        for (const [qi, q] of group.questions.entries())
                            await client.query(
                                'INSERT INTO public.reading_questions(group_id,question_order,question_type,prompt,options,answer_key,metadata) VALUES($1,$2,$3,$4,$5,$6,$7)',
                                [
                                    g.rows[0].id,
                                    qi + 1,
                                    q.question_type,
                                    q.prompt,
                                    JSON.stringify(q.options),
                                    JSON.stringify(q.answer_key),
                                    JSON.stringify(q.metadata),
                                ],
                            );
                    }
                }
                await client.query('COMMIT');
                return test;
            } catch (error) {
                await client.query('ROLLBACK');
                if (error.code === '23505')
                    throw Object.assign(
                        new Error('This slug already exists. Choose another slug.'),
                        { status: 409 },
                    );
                throw error;
            } finally {
                client.release();
            }
        },
        async saveAttempt(test, userId, result) {
            const row = await db.query(
                'INSERT INTO public.reading_attempts(test_id,user_id,test_version,test_title,responses,review,correct_count,total_count,graded_count,score_percent) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
                [
                    test.id,
                    userId,
                    test.version,
                    test.title,
                    JSON.stringify(result.responses),
                    JSON.stringify(result.review),
                    result.correct_count,
                    result.total_count,
                    result.graded_count,
                    result.score_percent,
                ],
            );
            return row.rows[0];
        },
        async attempts(slug, userId) {
            return (
                await db.query(
                    'SELECT a.* FROM public.reading_attempts a JOIN public.reading_tests t ON t.id=a.test_id WHERE t.slug=$1 AND a.user_id=$2 ORDER BY a.completed_at DESC',
                    [slug, userId],
                )
            ).rows;
        },
    };
}
module.exports = { createReadingRepository };
