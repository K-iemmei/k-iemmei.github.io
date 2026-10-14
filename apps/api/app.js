const express = require('express');
const { createReadingRouter } = require('./modules/reading/reading-routes');
const { createAuthoringRouter } = require('./modules/reading/reading-authoring-routes');
const { createDataRouter } = require('./modules/data/data-routes');
const { createVocabularyRouter } = require('./modules/vocabulary/vocabulary-routes');
const { createListeningRouter } = require('./modules/listening/listening-routes');
const { registerAuth, requireAuthentication } = require('./modules/auth/local-auth');
function createApp({ database } = {}) {
    const app = express();
    app.use(express.json({ limit: '1mb' }));
    // Local dev server only: reject foreign hosts/origins even if reached through DNS rebinding.
    app.use((req, res, next) => {
        const hostname = req.hostname;
        if (!['localhost', '127.0.0.1', '[::1]'].includes(hostname))
            return res.status(403).json({ error: 'local_only' });
        if (req.get('origin') && req.get('origin') !== req.protocol + '://' + req.get('host'))
            return res.status(403).json({ error: 'foreign_origin' });
        next();
    });
    const db = database || {
        query: (...args) => require('./database-pool').query(...args),
        connect: () => require('./database-pool').pool.connect(),
    };
    app.locals.database = db;
    registerAuth(app, db);
    app.use('/api', (req, res, next) => {
        res.set('Cache-Control', 'no-store');
        next();
    });
    app.use('/api/reading/author', requireAuthentication(db), createAuthoringRouter(db));
    app.use('/api/tests', requireAuthentication(db), createReadingRouter(db));
    app.use('/api/data', requireAuthentication(db), createDataRouter(db));
    app.use('/api/vocabulary', requireAuthentication(db), createVocabularyRouter(db));
    app.use('/api/listening', requireAuthentication(db), createListeningRouter(db));
    app.get('/health', (req, res) => res.json({ ok: true }));
    app.post('/api/admin/sql', async (req, res, next) => {
        if (!process.env.ADMIN_TOKEN || req.get('x-admin-token') !== process.env.ADMIN_TOKEN)
            return res.status(403).json({ error: 'SQL console disabled or invalid token' });
        if (typeof req.body.sql !== 'string' || req.body.sql.length > 100000)
            return res.status(400).json({ error: 'invalid_sql' });
        try {
            const result = await db.query(req.body.sql);
            res.json({ result: Array.isArray(result) ? result.map((r) => r.rows) : result.rows });
        } catch (error) {
            next(error);
        }
    });
    app.use('/api', (req, res) => res.status(404).json({ error: 'api_route_not_found' }));
    app.use((error, req, res, next) => {
        const status = error.status || 500;
        if (status === 500) console.error(error.message);
        res.status(status).json({ error: status === 500 ? 'database_error' : error.message });
    });
    return app;
}
module.exports = { createApp };
