const { Router } = require('express');
function createTrackingRouter(db) {
    const router = Router();
    router.get('/leaderboard', async (req, res, next) => {
        try {
            const { leaderboardDate } = await import('../../../web/src/domain/english-tracking.js');
            const date = req.query.date === undefined ? null : leaderboardDate(req.query.date);
            const result = await db.query('SELECT * FROM public.english_hall_of_fame($1)', [date]);
            res.json({ date, users: result.rows });
        } catch (error) {
            next(error);
        }
    });
    router.get('/english', async (req, res, next) => {
        try {
            res.json(
                (await db.query('SELECT * FROM public.english_tracking_v2($1)', [req.userId])).rows,
            );
        } catch (error) {
            next(error);
        }
    });
    router.post('/listening', async (req, res, next) => {
        try {
            const { validateListeningBatch } =
                await import('../../../web/src/domain/english-tracking.js');
            const rows = validateListeningBatch(req.body);
            await db.query(
                `INSERT INTO public.listening_activity(user_id,id,activity_date,seconds)
                 SELECT $1, id, activity_date, seconds FROM jsonb_to_recordset($2::jsonb)
                 AS batch(id uuid, activity_date date, seconds numeric)
                 ON CONFLICT (user_id,id) DO NOTHING`,
                [req.userId, JSON.stringify(rows)],
            );
            res.status(201).json({ saved: true });
        } catch (error) {
            next(error);
        }
    });
    return router;
}
module.exports = { createTrackingRouter };
