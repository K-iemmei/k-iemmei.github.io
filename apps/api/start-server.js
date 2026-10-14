const { createDevelopmentApp } = require('./development-server');
const host = process.env.HOST || '127.0.0.1';
if (!['127.0.0.1', 'localhost', '::1'].includes(host))
    throw new Error('Development server must bind to loopback');
const port = process.env.PORT || 8000;
const server = createDevelopmentApp().listen(port, host, () =>
    console.log(`My Note: http://${host}:${port} (local PostgreSQL)`),
);
for (const signal of ['SIGTERM', 'SIGINT'])
    process.on(signal, () =>
        server.close(async () => {
            const loaded = require.cache[require.resolve('./database-pool')];
            if (loaded) await loaded.exports.pool.end();
            process.exit(0);
        }),
    );
