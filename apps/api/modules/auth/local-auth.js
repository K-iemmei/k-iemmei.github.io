const { randomBytes, scryptSync, timingSafeEqual, createHash } = require('node:crypto');
function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    return salt + ':' + scryptSync(password, salt, 64).toString('hex');
}
function verifyPassword(password, stored) {
    if (typeof password !== 'string' || password.length > 1024 || !stored) return false;
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    const expected = Buffer.from(hash, 'hex');
    const actual = scryptSync(password, salt, 64);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
}
const tokenHash = (token) => createHash('sha256').update(token).digest('hex');
function registerAuth(app, db) {
    app.get('/api/auth/session', async (req, res, next) => {
        try {
            const userId = await authenticate(req, db);
            if (!userId) return res.status(401).json({ error: 'sign_in_required' });
            const result = await db.query('SELECT id,username,name FROM public.users WHERE id=$1', [
                userId,
            ]);
            res.set('Cache-Control', 'no-store').json(result.rows[0]);
        } catch (error) {
            next(error);
        }
    });
    app.post('/api/auth/logout', async (req, res, next) => {
        try {
            const token = sessionToken(req);
            if (token)
                await db.query('DELETE FROM app_private.sessions WHERE token_hash=$1', [
                    tokenHash(token),
                ]);
            res.clearCookie('my_note_session', { path: '/', httpOnly: true, sameSite: 'strict' });
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    });
    app.post('/api/auth/login', async (req, res, next) => {
        try {
            const { username, password } = req.body || {};
            if (typeof username !== 'string' || typeof password !== 'string')
                return res.status(400).json({ error: 'invalid_credentials' });
            const result = await db.query(
                'SELECT u.id,u.username,u.name,c.password_hash FROM public.users u JOIN app_private.credentials c ON c.user_id=u.id WHERE u.username=$1',
                [username],
            );
            const user = result.rows[0];
            if (!user || !verifyPassword(password, user.password_hash))
                return res.status(401).json({ error: 'invalid_credentials' });
            const token = randomBytes(32).toString('hex');
            await db.query('INSERT INTO app_private.sessions(token_hash,user_id) VALUES($1,$2)', [
                tokenHash(token),
                user.id,
            ]);
            delete user.password_hash;
            res.cookie('my_note_session', token, {
                httpOnly: true,
                sameSite: 'strict',
                secure: false,
                maxAge: 7 * 86400000,
                path: '/',
            });
            res.set('Cache-Control', 'no-store').json(user);
        } catch (error) {
            next(error);
        }
    });
}
function sessionToken(req) {
    const bearer = (req.get('authorization') || '').replace(/^Bearer /, '');
    const cookie = (req.get('cookie') || '')
        .split(';')
        .map((item) => item.trim())
        .find((item) => item.startsWith('my_note_session='));
    const token = bearer || cookie?.slice('my_note_session='.length) || '';
    return /^[a-f0-9]{64}$/.test(token) ? token : '';
}
function requireAuthentication(db) {
    return async (req, res, next) => {
        try {
            req.userId = await authenticate(req, db);
            if (!req.userId) return res.status(401).json({ error: 'sign_in_required' });
            next();
        } catch (error) {
            next(error);
        }
    };
}
async function authenticate(req, db) {
    const token = sessionToken(req);
    if (!token) return null;
    const result = await db.query(
        'SELECT user_id FROM app_private.sessions WHERE token_hash=$1 AND expires_at>now()',
        [tokenHash(token)],
    );
    return result.rows[0]?.user_id || null;
}
module.exports = {
    registerAuth,
    authenticate,
    requireAuthentication,
    hashPassword,
    verifyPassword,
};
