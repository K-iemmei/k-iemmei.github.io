const { Router } = require('express');
function createPublishingRouter(db) {
    const router = Router();
    router.use(async (req, res, next) => {
        try {
            const { publishingRequest, publishingError } =
                await import('../../../web/src/domain/publishing.js');
            const url = new URL(req.originalUrl, 'http://localhost');
            const request = publishingRequest(url.pathname, req.method, req.body, url);
            if (!request) return next();
            try {
                const result =
                    request.action === 'blog-list'
                        ? await db.query('SELECT public.app_blog_list($1,$2::jsonb) AS result', [
                              req.userId,
                              JSON.stringify(request.payload),
                          ])
                        : await db.query(
                              `SELECT public.${request.action.startsWith('tree-') ? 'app_note_tree' : 'app_notes_api'}($1,$2,$3,$4::jsonb) AS result`,
                              [
                                  req.userId,
                                  request.action,
                                  request.id,
                                  JSON.stringify(request.payload),
                              ],
                          );
                res.status(req.method === 'POST' ? 201 : 200).json(result.rows[0].result);
            } catch (error) {
                throw publishingError(error);
            }
        } catch (error) {
            next(error);
        }
    });
    return router;
}
module.exports = { createPublishingRouter };
