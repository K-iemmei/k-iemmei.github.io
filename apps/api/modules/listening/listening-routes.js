const { Router } = require('express');
const fs = require('node:fs');
const path = require('node:path');
const { root } = require('../../config/environment');

const clean = (value) =>
    String(value ?? '')
        .normalize('NFKC')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();
function scoreExam(session, responses) {
    let correct = 0;
    let graded = 0;
    const review = [];
    for (let number = session.first_question; number <= session.last_question; number++) {
        const expected = session.answer_key?.[number];
        const accepted = Array.isArray(expected) ? expected : expected ? [expected] : [];
        const answer = String(responses?.[number] ?? '')
            .trim()
            .slice(0, 200);
        const isGraded = accepted.length > 0;
        const isCorrect = isGraded && accepted.some((value) => clean(value) === clean(answer));
        if (isGraded) graded++;
        if (isCorrect) correct++;
        review.push({ number, answer, correct: isGraded ? isCorrect : null, expected: accepted });
    }
    return {
        correct,
        graded,
        score: graded ? Math.round((correct / graded) * 10000) / 100 : null,
        review,
    };
}
function scoreDictation(transcript, answer) {
    if (!transcript) return null;
    const words = (text) => clean(text).match(/[\p{L}\p{N}']+/gu) || [];
    const expected = words(transcript);
    const actual = words(answer).slice(0, 1500);
    if (!expected.length) return null;
    let previous = Array.from({ length: actual.length + 1 }, (_, index) => index);
    for (let i = 1; i <= expected.length; i++) {
        const next = [i];
        for (let j = 1; j <= actual.length; j++)
            next[j] = Math.min(
                next[j - 1] + 1,
                previous[j] + 1,
                previous[j - 1] + (expected[i - 1] === actual[j - 1] ? 0 : 1),
            );
        previous = next;
    }
    return Math.round(Math.max(0, 1 - previous[actual.length] / expected.length) * 10000) / 100;
}
function audioPath(filename) {
    if (!/^0-cam\d+-test-[1-4]-part-[1-4]\.mp3$/.test(filename)) return null;
    return [
        path.join(root, 'data/imports/listening-audio', filename),
        path.join(root, 'data/imports', filename),
        path.join(root, 'data', filename),
    ].find((candidate) => fs.existsSync(candidate));
}
function createListeningRouter(db) {
    const router = Router();
    const find = async (slug) =>
        (await db.query('SELECT * FROM public.listening_sessions WHERE slug=$1', [slug])).rows[0];
    router.get('/', async (req, res, next) => {
        try {
            const result = await db.query(
                'SELECT id,slug,book_number,test_number,part_number,title,first_question,last_question,status,updated_at FROM public.listening_sessions ORDER BY book_number DESC,test_number,part_number',
            );
            res.json(result.rows);
        } catch (error) {
            next(error);
        }
    });
    router.get('/:slug/attempts', async (req, res, next) => {
        try {
            const session = await find(req.params.slug);
            if (!session) return res.status(404).json({ error: 'Session not found' });
            const result = await db.query(
                'SELECT id,mode,correct_count,graded_count,score_percent,completed_at FROM public.listening_attempts WHERE session_id=$1 AND user_id=$2 ORDER BY completed_at DESC LIMIT 20',
                [session.id, req.userId],
            );
            res.json(result.rows);
        } catch (error) {
            next(error);
        }
    });
    router.get('/:slug/audio-url', async (req, res, next) => {
        try {
            const session = await find(req.params.slug);
            if (!session) return res.status(404).json({ error: 'Session not found' });
            res.json({
                url: audioPath(session.audio_filename)
                    ? `/api/listening/${encodeURIComponent(session.slug)}/audio`
                    : null,
            });
        } catch (error) {
            next(error);
        }
    });
    router.get('/:slug/audio', async (req, res, next) => {
        try {
            const session = await find(req.params.slug);
            const file = session && audioPath(session.audio_filename);
            if (!file) return res.status(404).end();
            res.type('audio/mpeg').sendFile(file, (error) => {
                if (error) next(error);
            });
        } catch (error) {
            next(error);
        }
    });
    router.get('/:slug', async (req, res, next) => {
        try {
            const session = await find(req.params.slug);
            if (!session) return res.status(404).json({ error: 'Session not found' });
            const { answer_key, transcript, ...publicSession } = session;
            res.json({
                ...publicSession,
                transcript_available: Boolean(transcript),
                audio_available: Boolean(audioPath(session.audio_filename)),
            });
        } catch (error) {
            next(error);
        }
    });
    router.post('/:slug/attempts', async (req, res, next) => {
        try {
            const session = await find(req.params.slug);
            if (!session) return res.status(404).json({ error: 'Session not found' });
            const mode = req.body?.mode;
            if (!['exam', 'dictation'].includes(mode))
                return res.status(400).json({ error: 'Invalid practice mode' });
            const responses =
                mode === 'exam' &&
                req.body.responses &&
                typeof req.body.responses === 'object' &&
                !Array.isArray(req.body.responses)
                    ? req.body.responses
                    : {};
            const text = mode === 'dictation' ? String(req.body?.text ?? '').slice(0, 30000) : null;
            const result =
                mode === 'exam'
                    ? scoreExam(session, responses)
                    : {
                          correct: null,
                          graded: 0,
                          score: scoreDictation(session.transcript, text),
                          transcript: session.transcript || null,
                      };
            const saved = await db.query(
                'INSERT INTO public.listening_attempts(session_id,user_id,mode,responses,dictation_text,correct_count,graded_count,score_percent) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id,completed_at',
                [
                    session.id,
                    req.userId,
                    mode,
                    JSON.stringify(responses),
                    text,
                    result.correct,
                    result.graded,
                    result.score,
                ],
            );
            res.status(201).json({ ...result, ...saved.rows[0] });
        } catch (error) {
            next(error);
        }
    });
    return router;
}
module.exports = { createListeningRouter, scoreExam, scoreDictation };
