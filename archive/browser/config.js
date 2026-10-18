(function () {
    // Application configuration for environment-specific endpoints and keys.
    // Usage in browser JS: window.APP_CONFIG.get() returns the selected environment config.
    // Selection order: URL param ?env=local|prod -> localStorage 'appEnv' -> hostname heuristic (localhost => local) -> default 'prod'

    const defaultConfig = {
        env: 'prod', // default to cloud Supabase backend
        local: {
            restBase: 'http://localhost:3000',
            apiKey: '',
        },
        prod: {
            supabaseUrl: 'https://lmqukgeyfmxprgkrujff.supabase.co',
            supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtcXVrZ2V5Zm14cHJna3J1amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMzQ5NTMsImV4cCI6MjA5ODgxMDk1M30.mz7NTaWXqcokWnuYb2k65dWmgvywpFpemnJcsO3UFk0',
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