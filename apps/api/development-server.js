const express = require('express');
const path = require('node:path');
const { root } = require('./config/environment');
const { createApp } = require('./app');
const { authenticate } = require('./modules/auth/local-auth');
function createDevelopmentApp(options) {
    const app = createApp(options);
    const web = path.join(root, 'apps/web');
    app.use('/src', express.static(path.join(web, 'src')));
    app.use('/styles', express.static(path.join(web, 'styles')));
    app.use(express.static(path.join(web, 'public')));
    app.get('/', (req, res) => res.sendFile(path.join(web, 'pages/auth/login.html')));
    app.get('/index.html', (req, res) => res.sendFile(path.join(web, 'pages/auth/login.html')));
    for (const [url, page] of Object.entries(require('../web/routes.json'))) {
        if (url === 'index.html') continue;
        app.get('/' + url, async (req, res, next) => {
            try {
                if (!(await authenticate(req, app.locals.database)))
                    return res.redirect('/index.html');
                res.set('Cache-Control', 'no-store').sendFile(path.join(web, 'pages', page));
            } catch (error) {
                next(error);
            }
        });
    }
    return app;
}
module.exports = { createDevelopmentApp };
