const normalize = (value: unknown) => String(value ?? '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
const checked = (result: { data: unknown; error: { message: string } | null }) => {
    if (result.error) throw new Error(result.error.message);
    return result.data;
};
function scoreExam(session: Record<string, any>, responses: Record<string, unknown>) {
    let correct = 0, graded = 0;
    const review = [];
    for (let number = session.first_question; number <= session.last_question; number++) {
        const expected = session.answer_key?.[number];
        const accepted = Array.isArray(expected) ? expected : expected ? [expected] : [];
        const answer = String(responses?.[number] ?? '').trim().slice(0, 200);
        const isGraded = accepted.length > 0;
        const isCorrect = isGraded && accepted.some((item: unknown) => normalize(item) === normalize(answer));
        if (isGraded) graded++;
        if (isCorrect) correct++;
        review.push({ number, answer, correct: isGraded ? isCorrect : null, expected: accepted });
    }
    return { correct, graded, score: graded ? Math.round((correct / graded) * 10000) / 100 : null, review };
}
function scoreDictation(transcript: string | null, answer: string) {
    if (!transcript) return null;
    const words = (text: string) => normalize(text).match(/[\p{L}\p{N}']+/gu) || [];
    const expected = words(transcript), actual = words(answer).slice(0, 1500);
    if (!expected.length) return null;
    let previous = Array.from({ length: actual.length + 1 }, (_, index) => index);
    for (let i = 1; i <= expected.length; i++) {
        const next = [i];
        for (let j = 1; j <= actual.length; j++) next[j] = Math.min(next[j - 1] + 1, previous[j] + 1, previous[j - 1] + (expected[i - 1] === actual[j - 1] ? 0 : 1));
        previous = next;
    }
    return Math.round(Math.max(0, 1 - previous[actual.length] / expected.length) * 10000) / 100;
}
export async function listeningApi(admin: any, user: { id: string }, path: string, method: string, body: any) {
    const parts = path.split('/').filter(Boolean);
    if (parts[0] !== 'listening') return undefined;
    if (parts.length === 1 && method === 'GET') return checked(await admin.from('listening_sessions').select('id,slug,book_number,test_number,part_number,title,first_question,last_question,status,updated_at').order('book_number', { ascending: false }).order('test_number').order('part_number'));
    const slug = parts[1];
    if (!slug) return undefined;
    const session = checked(await admin.from('listening_sessions').select('*').eq('slug', slug).maybeSingle()) as Record<string, any> | null;
    if (!session) throw new Error('Session not found');
    if (parts[2] === 'attempts' && method === 'GET') return checked(await admin.from('listening_attempts').select('id,mode,correct_count,graded_count,score_percent,completed_at').eq('session_id', session.id).eq('user_id', user.id).order('completed_at', { ascending: false }).limit(20));
    if (parts[2] === 'audio-url' && method === 'GET') {
        const listed = await admin.storage.from('listening-audio').list('', { search: session.audio_filename, limit: 1 });
        if (listed.error || !listed.data?.some((item: { name: string }) => item.name === session.audio_filename)) return { url: null };
        const result = await admin.storage.from('listening-audio').createSignedUrl(session.audio_filename, 600);
        return { url: result.error ? null : result.data.signedUrl };
    }
    if (parts.length === 2 && method === 'GET') {
        const { answer_key, transcript, ...visible } = session;
        return { ...visible, transcript_available: Boolean(transcript) };
    }
    if (parts[2] === 'attempts' && method === 'POST') {
        const mode = body?.mode;
        if (mode !== 'exam' && mode !== 'dictation') throw new Error('Invalid practice mode');
        const responses = mode === 'exam' && body.responses && typeof body.responses === 'object' && !Array.isArray(body.responses) ? body.responses : {};
        const text = mode === 'dictation' ? String(body?.text ?? '').slice(0, 30000) : null;
        const result = mode === 'exam' ? scoreExam(session, responses) : { correct: null, graded: 0, score: scoreDictation(session.transcript, text || ''), transcript: session.transcript || null };
        const saved = checked(await admin.from('listening_attempts').insert({ session_id: session.id, user_id: user.id, mode, responses, dictation_text: text, correct_count: result.correct, graded_count: result.graded, score_percent: result.score }).select('id,completed_at').single());
        return { ...result, ...(saved as Record<string, unknown>) };
    }
    return undefined;
}
