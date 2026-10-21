const { Router } = require('express');
function createHomeRouter(db) {
    const router = Router();
    router.use(async (req, res, next) => {
        try {
            if (req.path === '/football' && req.method === 'GET') {
                const { loadStandings } = await import('../../../web/src/domain/home-football.js');
                return res.json(
                    await loadStandings(
                        new URL(req.originalUrl, 'http://localhost').searchParams.get('league'),
                    ),
                );
            }
            if (req.path === '/news' && req.method === 'GET') {
                const { loadNews } = await import('../../../web/src/domain/home-news.js');
                return res.json(
                    await loadNews(
                        new URL(req.originalUrl, 'http://localhost').searchParams.get('category'),
                    ),
                );
            }
            const { homeRequest, homeError } = await import('../../../web/src/domain/home.js');
            const request = homeRequest(
                new URL(req.originalUrl, 'http://localhost').pathname,
                req.method,
                req.body,
            );
            if (!request) return next();
            try {
                const result = await db.query(
                    'SELECT public.app_home_api($1,$2,$3,$4::jsonb) AS result',
                    [
                        req.userId,
                        request.action,
                        request.id || null,
                        JSON.stringify(request.payload),
                    ],
                );
                res.status(req.method === 'POST' ? 201 : 200).json(result.rows[0].result);
            } catch (error) {
                throw homeError(error);
            }
        } catch (error) {
            next(error);
        }
    });
    return router;
}
module.exports = { createHomeRouter };
