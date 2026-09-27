(function () {
    // Application configuration for environment-specific endpoints and keys.
    // Usage in browser JS: window.APP_CONFIG.get() returns the selected environment config.
    // Selection order: URL param ?env=local|prod -> localStorage 'appEnv' -> hostname heuristic (localhost => local) -> default 'prod'

    const defaultConfig = {
        env: 'local', // default when developing locally
        local: {
            // For local development, provide a REST proxy or API server that talks to your local Postgres.
            // Example: run a small Express server at http://localhost:3000 that proxies DB calls or exposes endpoints.
            restBase: 'http://localhost:3000',
            // If your local proxy requires an API key for dev, add it here (optional)
            apiKey: '',
            // If using a local supabase emulator or REST endpoint, you can point restBase to it.
        },
        prod: {
            // Replace the placeholder values with your Supabase project values before deploying.
            supabaseUrl: 'https://lmqukgeyfmxprgkrujff.supabase.co',
            supabaseKey: 'REPLACE_WITH_ANON_KEY',
            restBase: 'https://lmqukgeyfmxprgkrujff.supabase.co/rest/v1'
        }
    };

    function resolveEnv() {
        const urlParams = new URLSearchParams(window.location.search);
        const param = urlParams.get('env');
        if (param && (param === 'local' || param === 'prod')) return param;

        const stored = localStorage.getItem('appEnv');
        if (stored && (stored === 'local' || stored === 'prod')) return stored;

        if (/localhost|127\.0\.0\.1/.test(window.location.hostname)) return 'local';

        return defaultConfig.env || 'prod';
    }

    function getConfig() {
        const env = resolveEnv();
        const merged = JSON.parse(JSON.stringify(defaultConfig));
        merged.env = env;
        return merged;
    }

    function setEnv(env) {
        if (env !== 'local' && env !== 'prod') throw new Error('Invalid env');
        localStorage.setItem('appEnv', env);
        window.location.reload();
    }

    window.APP_CONFIG = {
        get: getConfig,
        setEnv,
        // convenience accessors
        isLocal() { return getConfig().env === 'local'; },
        isProd() { return getConfig().env === 'prod'; }
    };
})();