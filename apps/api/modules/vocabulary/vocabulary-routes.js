const { Router } = require('express');
const express = require('express');
const { parseApkg, MAX_UPLOAD_BYTES } = require('./apkg-import');
const invalid = (error) => Object.assign(new Error(error), { status: 400 });
const text = (value, max, required = false) => {
    if (typeof value !== 'string') throw invalid('invalid_input');
    const result = value.trim();
    if (result.length > max || (required && !result)) throw invalid('invalid_input');
    return result;
};
function createVocabularyRouter(db) {
    const router = Router();
    const todayCountSql = `SELECT count(DISTINCT card_id)::int AS count FROM vocabulary_reviews
        WHERE user_id=$1 AND (reviewed_at AT TIME ZONE $2)::date=(now() AT TIME ZONE $2)::date`;
    async function studySettings(userId, query = db) {
        const settings = await query.query(
            'SELECT daily_limit,timezone FROM vocabulary_settings WHERE user_id=$1',
            [userId],
        );
        const dailyLimit = settings.rows[0]?.daily_limit ?? null;
        const timezone = settings.rows[0]?.timezone || 'Asia/Bangkok';
        const count = await query.query(todayCountSql, [userId, timezone]);
        return {
            daily_limit: dailyLimit,
            timezone,
            studied_today: count.rows[0].count,
            remaining: dailyLimit === null ? null : Math.max(0, dailyLimit - count.rows[0].count),
        };
    }
    router.get('/settings', async (req, res, next) => {
        try {
            res.json(await studySettings(req.userId));
        } catch (error) {
            next(error);
        }
    });
    router.put('/settings', async (req, res, next) => {
        try {
            const limit = req.body?.daily_limit;
            if (limit !== null && (!Number.isInteger(limit) || limit < 1 || limit > 1000))
                throw invalid('Daily limit must be between 1 and 1000, or unlimited');
            const timezone = req.body?.timezone || 'Asia/Bangkok';
            if (typeof timezone !== 'string' || timezone.length > 100)
                throw invalid('Invalid timezone');
            try {
                new Intl.DateTimeFormat('en', { timeZone: timezone });
            } catch {
                throw invalid('Invalid timezone');
            }
            await db.query(
                `INSERT INTO vocabulary_settings(user_id,daily_limit,timezone) VALUES($1,$2,$3)
                ON CONFLICT(user_id) DO UPDATE SET daily_limit=EXCLUDED.daily_limit,timezone=EXCLUDED.timezone`,
                [req.userId, limit, timezone],
            );
            res.json(await studySettings(req.userId));
        } catch (error) {
            next(error);
        }
    });
    router.get('/activity', async (req, res, next) => {
        try {
            const settings = await studySettings(req.userId);
            const result = await db.query(
                `SELECT to_char((r.reviewed_at AT TIME ZONE $2)::date,'YYYY-MM-DD') AS day,
                count(*)::int AS reviews, count(DISTINCT r.card_id)::int AS cards
                FROM vocabulary_reviews r WHERE r.user_id=$1
                AND r.reviewed_at >= now()-interval '90 days'
                GROUP BY day ORDER BY day`,
                [req.userId, settings.timezone],
            );
            res.json({ ...settings, days: result.rows });
        } catch (error) {
            next(error);
        }
    });
    router.get('/decks', async (req, res, next) => {
        try {
            const r = await db.query(
                `SELECT d.*,count(c.id)::int card_count,count(c.id) FILTER(WHERE c.due_at<=now())::int due_count FROM vocabulary_decks d LEFT JOIN vocabulary_cards c ON c.deck_id=d.id WHERE d.user_id=$1 GROUP BY d.id ORDER BY d.updated_at DESC`,
                [req.userId],
            );
            res.json(r.rows);
        } catch (e) {
            next(e);
        }
    });
    router.post('/decks', async (req, res, next) => {
        try {
            const r = await db.query(
                'INSERT INTO vocabulary_decks(user_id,name,description) VALUES($1,$2,$3) RETURNING *',
                [
                    req.userId,
                    text(req.body?.name, 120, true),
                    text(req.body?.description || '', 1000),
                ],
            );
            res.status(201).json(r.rows[0]);
        } catch (e) {
            next(e);
        }
    });
    router.get('/decks/:id', async (req, res, next) => {
        try {
            const result = await db.query(
                `SELECT d.*, count(c.id)::int AS card_count,
                count(c.id) FILTER (WHERE c.due_at <= now())::int AS due_count
                FROM vocabulary_decks d LEFT JOIN vocabulary_cards c ON c.deck_id=d.id
                WHERE d.id=$1 AND d.user_id=$2 GROUP BY d.id`,
                [req.params.id, req.userId],
            );
            if (!result.rows[0]) return res.status(404).json({ error: 'deck_not_found' });
            res.json(result.rows[0]);
        } catch (error) {
            next(error);
        }
    });
    router.get('/decks/:id/cards', async (req, res, next) => {
        try {
            const offset = Number(req.query.offset || 0);
            if (!Number.isInteger(offset) || offset < 0) throw invalid('Invalid card offset');
            const deck = await db.query(
                'SELECT id FROM vocabulary_decks WHERE id=$1 AND user_id=$2',
                [req.params.id, req.userId],
            );
            if (!deck.rows[0]) return res.status(404).json({ error: 'deck_not_found' });
            const result = await db.query(
                'SELECT * FROM vocabulary_cards WHERE deck_id=$1 ORDER BY term,id LIMIT 100 OFFSET $2',
                [req.params.id, offset],
            );
            res.json(result.rows);
        } catch (error) {
            next(error);
        }
    });
    router.post(
        '/import-apkg',
        express.raw({ type: 'application/octet-stream', limit: MAX_UPLOAD_BYTES }),
        async (req, res, next) => {
            let client;
            try {
                const decks = parseApkg(req.body);
                client = await db.connect();
                await client.query('BEGIN');
                let count = 0;
                for (const [name, cards] of decks) {
                    const inserted = await client.query(
                        'INSERT INTO vocabulary_decks(user_id,name,source_type) VALUES($1,$2,$3) RETURNING id',
                        [req.userId, name, 'apkg'],
                    );
                    for (let index = 0; index < cards.length; index += 250) {
                        const batch = cards.slice(index, index + 250);
                        await client.query(
                            `INSERT INTO vocabulary_cards(deck_id,term,meaning,example,tags)
                             SELECT $1::uuid, x.term, x.meaning, x.example, x.tags
                             FROM jsonb_to_recordset($2::jsonb)
                             AS x(term text, meaning text, example text, tags jsonb)`,
                            [inserted.rows[0].id, JSON.stringify(batch)],
                        );
                        count += batch.length;
                    }
                }
                await client.query('COMMIT');
                res.status(201).json({ deck_count: decks.size, card_count: count });
            } catch (error) {
                if (client) await client.query('ROLLBACK');
                next(error);
            } finally {
                client?.release();
            }
        },
    );
    router.post('/decks/:id/cards', async (req, res, next) => {
        try {
            const d = await db.query('SELECT id FROM vocabulary_decks WHERE id=$1 AND user_id=$2', [
                req.params.id,
                req.userId,
            ]);
            if (!d.rows[0]) return res.status(404).json({ error: 'deck_not_found' });
            const r = await db.query(
                'INSERT INTO vocabulary_cards(deck_id,term,meaning,example,audio_path) VALUES($1,$2,$3,$4,$5) RETURNING *',
                [
                    req.params.id,
                    text(req.body?.term, 500, true),
                    text(req.body?.meaning, 4000, true),
                    text(req.body?.example || '', 4000),
                    text(req.body?.audio_path || '', 1000),
                ],
            );
            await db.query('UPDATE vocabulary_decks SET updated_at=now() WHERE id=$1', [
                req.params.id,
            ]);
            res.status(201).json(r.rows[0]);
        } catch (e) {
            next(e);
        }
    });
    router.get('/study', async (req, res, next) => {
        try {
            const settings = await studySettings(req.userId);
            const r = await db.query(
                `SELECT c.* FROM vocabulary_cards c JOIN vocabulary_decks d ON d.id=c.deck_id
                 WHERE d.user_id=$1 AND c.due_at<=now() AND ($2::uuid IS NULL OR c.deck_id=$2)
                 AND ($3::boolean OR EXISTS(SELECT 1 FROM vocabulary_reviews r WHERE r.user_id=$1 AND r.card_id=c.id
                   AND (r.reviewed_at AT TIME ZONE $4)::date=(now() AT TIME ZONE $4)::date))
                 ORDER BY c.due_at LIMIT 1`,
                [
                    req.userId,
                    req.query.deck_id || null,
                    settings.remaining === null || settings.remaining > 0,
                    settings.timezone,
                ],
            );
            res.json(r.rows[0] || null);
        } catch (e) {
            next(e);
        }
    });
    router.post('/cards/:id/review', async (req, res, next) => {
        let client;
        try {
            const minutes = Number(req.body?.interval_minutes);
            if (![3, 10, 15, 1440, 4320].includes(minutes)) throw invalid('invalid_interval');
            client = await db.connect();
            await client.query('BEGIN');
            await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [req.userId]);
            const settings = await studySettings(req.userId, client);
            const q = await client.query(
                `SELECT c.* FROM vocabulary_cards c JOIN vocabulary_decks d ON d.id=c.deck_id WHERE c.id=$1 AND d.user_id=$2 FOR UPDATE OF c`,
                [req.params.id, req.userId],
            );
            const c = q.rows[0];
            if (!c) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: 'card_not_found' });
            }
            const reviewed = await client.query(
                `SELECT 1 FROM vocabulary_reviews WHERE user_id=$1 AND card_id=$2
                AND (reviewed_at AT TIME ZONE $3)::date=(now() AT TIME ZONE $3)::date LIMIT 1`,
                [req.userId, c.id, settings.timezone],
            );
            if (settings.remaining === 0 && !reviewed.rows.length) {
                await client.query('ROLLBACK');
                return res.status(409).json({ error: 'Daily card limit reached' });
            }
            if (new Date(c.due_at).getTime() > Date.now()) {
                await client.query('ROLLBACK');
                return res.status(409).json({ error: 'Card is not due yet' });
            }
            const rating = minutes === 3 ? 'again' : minutes >= 1440 ? 'easy' : 'good';
            const r = await client.query(
                `UPDATE vocabulary_cards SET state=$1,due_at=now()+($2::int * interval '1 minute'),interval_days=$3,
                repetitions=repetitions+1,lapses=lapses+$4,last_reviewed_at=now() WHERE id=$5 RETURNING *`,
                [
                    minutes < 1440 ? 'learning' : 'review',
                    minutes,
                    Math.floor(minutes / 1440),
                    minutes === 3 ? 1 : 0,
                    c.id,
                ],
            );
            await client.query(
                'INSERT INTO vocabulary_reviews(card_id,user_id,rating,previous_state,interval_minutes) VALUES($1,$2,$3,$4,$5)',
                [c.id, req.userId, rating, c.state, minutes],
            );
            await client.query('COMMIT');
            res.json(r.rows[0]);
        } catch (e) {
            if (client) await client.query('ROLLBACK');
            next(e);
        } finally {
            client?.release();
        }
    });
    return router;
}
module.exports = { createVocabularyRouter };
