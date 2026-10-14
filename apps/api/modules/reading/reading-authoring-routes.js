const { Router } = require('express');
const { createReadingRepository } = require('./reading-repository');
const { validateTest } = require('./reading-validation');
const { questionTypes } = require('./question-types');
function createAuthoringRouter(db) {
    const router = Router();
    const repository = createReadingRepository(db);
    router.get('/question-types', (req, res) => res.json(questionTypes));
    router.get('/tests', async (req, res, next) => {
        try {
            res.json(await repository.list(req.userId, true));
        } catch (error) {
            next(error);
        }
    });
    router.post('/tests', async (req, res, next) => {
        try {
            res.status(201).json(await repository.save(validateTest(req.body), req.userId));
        } catch (error) {
            next(error);
        }
    });
    router.get('/tests/:id', async (req, res, next) => {
        try {
            const test = await repository.findForAuthor(req.params.id, req.userId);
            if (!test) return res.status(404).json({ error: 'Test not found' });
            res.json(test);
        } catch (error) {
            next(error);
        }
    });
    router.put('/tests/:id', async (req, res, next) => {
        try {
            if (!Number.isInteger(req.body.version))
                return res.status(400).json({ error: 'Missing version' });
            res.json(
                await repository.save(
                    validateTest(req.body),
                    req.userId,
                    req.params.id,
                    req.body.version,
                ),
            );
        } catch (error) {
            next(error);
        }
    });
    return router;
}
module.exports = { createAuthoringRouter };
