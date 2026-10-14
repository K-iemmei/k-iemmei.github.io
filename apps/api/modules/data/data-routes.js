const { Router } = require('express');
const { authenticate } = require('../auth/local-auth');
const { readable, writable, privateTables, identifier } = require('./table-policy');
function createDataRouter(db) {
    const router = Router();
    router.all('/:table', async (req, res, next) => {
        try {
            const table = req.params.table;
            if (!readable.has(table)) return res.status(404).json({ error: 'unknown_table' });
            if (!['GET', 'POST', 'DELETE'].includes(req.method))
                return res.status(405).json({ error: 'method_not_allowed' });
            if (req.method !== 'GET' && !writable.has(table))
                return res.status(403).json({ error: 'read_only_table' });
            const userId = await authenticate(req, db);
            if ((privateTables.has(table) || req.method !== 'GET') && !userId)
                return res.status(401).json({ error: 'sign_in_required' });
            const schema = await db.query(
                'SELECT column_name,data_type FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2',
                ['public', table],
            );
            const columns = new Map(schema.rows.map((row) => [row.column_name, row.data_type]));
            const column = (name) => {
                if (
                    !columns.has(name) ||
                    (table === 'users' && !['id', 'username', 'name'].includes(name))
                )
                    throw Object.assign(new Error('Unknown or private column: ' + name), {
                        status: 400,
                    });
                return identifier(name);
            };
            const parameters = [];
            const where = [];
            for (const [name, filter] of Object.entries(req.query)) {
                if (['select', 'order', 'on_conflict'].includes(name)) continue;
                if (typeof filter !== 'string' || !filter.startsWith('eq.'))
                    throw Object.assign(new Error('Only eq filters are supported locally'), {
                        status: 400,
                    });
                parameters.push(filter.slice(3));
                where.push(column(name) + '=$' + parameters.length);
            }
            if (privateTables.has(table)) {
                parameters.push(userId);
                where.push('user_id=$' + parameters.length);
            }
            const condition = where.length ? ' WHERE ' + where.join(' AND ') : '';
            const target = 'public.' + identifier(table);
            if (req.method === 'GET') {
                const fields =
                    req.query.select && req.query.select !== '*'
                        ? String(req.query.select)
                              .split(',')
                              .map((name) => column(name.trim()))
                              .join(',')
                        : table === 'users'
                          ? 'id,username,name'
                          : '*';
                let order = '';
                if (req.query.order) {
                    const [name, direction] = String(req.query.order).split('.');
                    if (!['asc', 'desc'].includes(direction))
                        throw Object.assign(new Error('Invalid order'), { status: 400 });
                    order = ' ORDER BY ' + column(name) + ' ' + direction;
                }
                const result = await db.query(
                    'SELECT ' + fields + ' FROM ' + target + condition + order + ' LIMIT 5000',
                    parameters,
                );
                return res.json(result.rows);
            }
            if (req.method === 'DELETE') {
                if (!Object.keys(req.query).some((key) => !['select', 'order'].includes(key)))
                    return res.status(400).json({ error: 'filter_required' });
                await db.query('DELETE FROM ' + target + condition, parameters);
                return res.status(204).end();
            }
            const rows = Array.isArray(req.body) ? req.body : [req.body];
            if (rows.length > 500) return res.status(400).json({ error: 'too_many_rows' });
            if (!rows.length) return res.json([]);
            if (rows.some((row) => !row || row.user_id !== userId))
                return res.status(403).json({ error: 'user_mismatch' });
            const connection = await db.connect();
            try {
                await connection.query('BEGIN');
                const result = [];
                for (const row of rows) {
                    const keys = Object.keys(row);
                    keys.forEach(column);
                    const values = keys.map((key) =>
                        ['json', 'jsonb'].includes(columns.get(key))
                            ? JSON.stringify(row[key])
                            : row[key],
                    );
                    const inserted = await connection.query(
                        'INSERT INTO ' +
                            target +
                            ' (' +
                            keys.map(column).join(',') +
                            ') VALUES (' +
                            keys.map((_, i) => '$' + (i + 1)).join(',') +
                            ') RETURNING *',
                        values,
                    );
                    result.push(...inserted.rows);
                }
                await connection.query('COMMIT');
                return res.status(201).json(result);
            } catch (error) {
                await connection.query('ROLLBACK');
                throw error;
            } finally {
                connection.release();
            }
        } catch (error) {
            next(error);
        }
    });
    return router;
}
module.exports = { createDataRouter };
