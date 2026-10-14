const { Router } = require('express');
const { createReadingRepository } = require('./reading-repository');
const { gradeTest } = require('./reading-grader');
function createReadingRouter(db) {
    const router = Router();
    const repository = createReadingRepository(db);
    router.get('/', async (req, res, next) => {
        try {
            res.json(await repository.list(req.userId));
        } catch (error) {
            next(error);
        }
    });
    router.get('/:slug/attempts', async (req, res, next) => {
        try {
            res.json(await repository.attempts(req.params.slug, req.userId));
        } catch (error) {
            next(error);
        }
    });
    router.post('/:slug/attempts', async (req, res, next) => {
        try {
            const test = await repository.findBySlug(req.params.slug, req.userId);
            if (!test) return res.status(404).json({ error: 'Test not found' });
            if (req.body.version !== test.version)
                return res.status(409).json({ error: 'Test changed. Reload before submitting.' });
            const result = gradeTest(test, req.body.responses);
            res.status(201).json(await repository.saveAttempt(test, req.userId, result));
        } catch (error) {
            next(error);
        }
    });
    // Only pages attached to an accessible test can be served; never expose the source book/key.
    router.get('/:slug/source-pages/:filename', async (req, res, next) => {
        try {
            const test = await repository.findBySlug(req.params.slug, req.userId);
            const filename = req.params.filename;
            const pages =
                test?.passages.flatMap((p) =>
                    p.groups.flatMap((g) => [
                        ...(g.metadata.source_pages || []),
                        ...(g.metadata.figures || []),
                    ]),
                ) || [];
            if (
                !/^cambridge-(?:[1-9]|1[0-9]|2[01])-p\d{3}(?:-[lr])?(?:-figure)?\.png$/.test(
                    filename,
                ) ||
                !pages.some((page) => page.file === filename)
            )
                return res.status(404).json({ error: 'Source page not found' });
            const path = require('node:path');
            const { root } = require('../../config/environment');
            res.sendFile(path.join(root, 'data/imports/reading-assets', filename), (error) => {
                if (error) next(error);
            });
        } catch (error) {
            next(error);
        }
    });
    router.get('/:slug', async (req, res, next) => {
        try {
            const test = await repository.findBySlug(req.params.slug, req.userId);
            if (!test) return res.status(404).json({ error: 'Test not found' });
            test.ungraded_count = test.passages
                .flatMap((p) => p.groups.flatMap((g) => g.questions))
                .filter((q) => !q.answer_key.answers.length).length;
            for (const p of test.passages)
                for (const g of p.groups)
                    for (const q of g.questions) {
                        delete q.answer_key;
                        delete q.metadata.explanation;
                    }
            res.json(test);
        } catch (error) {
            next(error);
        }
    });
    return router;
}
module.exports = { createReadingRouter };
