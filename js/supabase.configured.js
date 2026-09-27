(function () {
    // Supabase client wrapper that reads configuration from window.APP_CONFIG
    const cfg = (window.APP_CONFIG && typeof window.APP_CONFIG.get === 'function') ? window.APP_CONFIG.get() : (window.APP_CONFIG || {});
    const isLocal = cfg && cfg.env === 'local';

    const supabaseUrl = isLocal ? (cfg.local && cfg.local.restBase ? cfg.local.restBase : 'http://localhost:3000') : (cfg.prod && cfg.prod.supabaseUrl ? cfg.prod.supabaseUrl : 'https://lmqukgeyfmxprgkrujff.supabase.co');
    const supabaseKey = isLocal ? (cfg.local && cfg.local.apiKey ? cfg.local.apiKey : '') : (cfg.prod && cfg.prod.supabaseKey ? cfg.prod.supabaseKey : '');

    async function supabaseRequest(table, options = {}) {
        const {
            select = "*",
            filters = {},
            order = null,
            method = "GET",
            body = null,
            onConflict = null,
            returnRepresentation = false
        } = options;

        const params = new URLSearchParams();

        if (method === 'GET' || method === 'DELETE') {
            params.append('select', select);
        }

        if (onConflict && typeof onConflict === 'string') {
            params.append('on_conflict', onConflict);
        }

        if (order && order.column) {
            const direction = order.direction || "asc";
            params.append("order", `${order.column}.${direction}`);
        }

        Object.entries(filters).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
                return;
            }

            if (typeof value === "string" && /^(eq|neq|gt|gte|lt|lte|like|ilike|in|is|not\.|contains|contained\.|overlaps|adjacent|cs|cd|ov|fts|plfts|phfts|wfts)\./.test(value)) {
                params.append(key, value);
                return;
            }

            params.append(key, `eq.${String(value)}`);
        });

        // Support both full rest base URLs (local) and supabase rest endpoints
        const base = supabaseUrl.replace(/\/$/, '');
        const url = `${base}/rest/v1/${table}${params.toString() ? `?${params.toString()}` : ""}`;

        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json"
        };

        if (supabaseKey) {
            // Use Bearer token convention for Authorization when available
            headers['apikey'] = supabaseKey;
            headers['Authorization'] = `Bearer ${supabaseKey}`;
        }

        const preferHeaders = [];

        if (method === 'POST' && onConflict && typeof onConflict === 'string') {
            preferHeaders.push('resolution=merge-duplicates');
        }

        if (method === 'POST' && returnRepresentation) {
            preferHeaders.push('return=representation');
        }

        if (preferHeaders.length > 0) {
            headers['Prefer'] = preferHeaders.join(',');
        }

        const response = await fetch(url, {
            method,
            headers,
            ...(body ? { body: JSON.stringify(body) } : {})
        });

        if (method === 'DELETE' && response.status === 204) {
            return [];
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : [];

        if (!response.ok) {
            throw new Error(data?.message || `Supabase request failed for ${table}`);
        }

        return data;
    }

    window.supabase = {
        url: supabaseUrl,
        key: supabaseKey,
        request: supabaseRequest,

        async get(table, options = {}) {
            return supabaseRequest(table, { ...options, method: "GET" });
        },

        async create(table, payload) {
            return supabaseRequest(table, {
                method: "POST",
                body: payload,
                returnRepresentation: true
            });
        },

        async delete(table, options = {}) {
            return supabaseRequest(table, {
                ...options,
                method: 'DELETE',
                select: '*'
            });
        },

        async upsert(table, payload, options = {}) {
            const rows = Array.isArray(payload) ? payload : [payload];
            return supabaseRequest(table, {
                method: "POST",
                body: rows,
                onConflict: options.onConflict || null
            });
        },

        async loginUser(username, password) {
            const rows = await this.get("users", {
                select: "id, username, password, name",
                filters: {
                    username: username
                }
            });

            if (!Array.isArray(rows) || rows.length === 0) {
                return null;
            }

            const user = rows.find((row) => String(row.password) === String(password));
            return user || null;
        },

        async getSubjectDailyActivity(userId, year) {
            const startDate = `${year}-01-01`;
            const endDate = `${year}-12-31`;

            const rows = await this.get("subject_daily_activity", {
                select: "*",
                filters: {
                    user_id: `eq.${userId}`
                }
            });

            if (!Array.isArray(rows)) {
                return [];
            }

            return rows.filter((entry) => {
                const date = entry.activity_date || "";
                return date >= startDate && date <= endDate;
            });
        }
    };
})();