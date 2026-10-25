const { Router } = require('express');
function createGrammarRouter(db) {
    const router = Router();
    router.use(async (req, res, next) => {
        try {
            const { grammarRequest } = await import('../../../web/src/domain/grammar.js');
            const request = grammarRequest(
                new URL(req.originalUrl, 'http://localhost').pathname,
                req.method,
                req.body,
            );
            if (!request) return next();
            const result = await db.query(
                'SELECT public.app_grammar_api($1,$2,$3,$4::jsonb) AS result',
                [req.userId, request.action, request.id, JSON.stringify(request.payload)],
            );
            res.json(result.rows[0].result);
        } catch (error) {
            next(error);
        }
    });
    return router;
}
module.exports = { createGrammarRouter };
