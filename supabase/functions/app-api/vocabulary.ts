import { priorityRequest } from '../../../apps/web/src/domain/priority-vocabulary.js';
function checked(result) {
    if (result.error) throw new Error(result.error.message);
    return result.data;
}
async function settings(admin, userId) {
    return checked(await admin.rpc('app_vocabulary_settings', { p_user: userId }));
}
async function decks(admin, userId) {
    return checked(
        await admin
            .from('vocabulary_decks')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false }),
    );
}
async function decoratedDecks(admin, userId) {
    return checked(await admin.rpc('app_list_vocabulary_decks', { p_user: userId }));
}
const clean = (value, max, required = false) => {
    const text = String(value ?? '').trim();
    if (text.length > max || (required && !text)) throw new Error('Invalid vocabulary input');
    return text;
};
export async function vocabularyApi(admin, user, path, method, body, url) {
    const priority=priorityRequest('/api/'+path,method,body);
    if(priority) {
        const result=await admin.rpc('app_priority_vocabulary',{p_user:user.id,p_action:priority.action,p_id:priority.id,p_payload:priority.payload});
        if(result.error)throw Object.assign(new Error(result.error.message),{status:result.error.code==='40001'?409:result.error.code==='P0002'?404:400});
        return result.data;
    }
    const segments = path.split('/').filter(Boolean);
    if (segments[0] !== 'vocabulary') return undefined;
    const action = segments[1];
    if (action === 'settings') {
        if (method === 'GET') return settings(admin, user.id);
        if (method === 'PUT') {
            const limit = body?.daily_limit;
            if (limit !== null && (!Number.isInteger(limit) || limit < 1 || limit > 1000))
                throw new Error('Daily limit must be 1–1000 or unlimited');
            const timezone = clean(body?.timezone || 'Asia/Bangkok', 100, true);
            new Intl.DateTimeFormat('en', { timeZone: timezone });
            checked(
                await admin
                    .from('vocabulary_settings')
                    .upsert({ user_id: user.id, daily_limit: limit, timezone }),
            );
            return settings(admin, user.id);
        }
    }
    if (action === 'activity' && method === 'GET') {
        return checked(await admin.rpc('app_vocabulary_activity', { p_user: user.id }));
    }
    if (action === 'decks') {
        const id = segments[2];
        if (!id) {
            if (method === 'GET') return decoratedDecks(admin, user.id);
            if (method === 'POST')
                return checked(
                    await admin
                        .from('vocabulary_decks')
                        .insert({
                            user_id: user.id,
                            name: clean(body?.name, 120, true),
                            description: clean(body?.description, 1000),
                            source_type: body?.source_type === 'apkg' ? 'apkg' : 'manual',
                        })
                        .select()
                        .single(),
                );
        }
        const owned = checked(
            await admin
                .from('vocabulary_decks')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .maybeSingle(),
        );
        const deck = segments[3]
            ? owned
            : (await decoratedDecks(admin, user.id)).find((item) => item.id === id);
        if (!deck) throw new Error('Deck not found');
        if (!segments[3] && method === 'GET') return deck;
        if (segments[3] === 'cards') {
            if (segments[4] === 'batch' && method === 'POST') {
                if (!Array.isArray(body?.cards) || body.cards.length < 1 || body.cards.length > 250)
                    throw new Error('Import batches must contain 1–250 cards');
                const rows = body.cards.map((card) => ({
                    deck_id: id,
                    term: clean(card.term, 500, true),
                    meaning: clean(card.meaning, 4000, true),
                    example: clean(card.example, 4000),
                    tags: Array.isArray(card.tags)
                        ? card.tags.slice(0, 30).map((tag) => clean(tag, 100))
                        : [],
                }));
                checked(await admin.from('vocabulary_cards').insert(rows));
                return { card_count: rows.length };
            }
            if (method === 'GET') {
                const offset = Number(url.searchParams.get('offset') || 0);
                if (!Number.isInteger(offset) || offset < 0) throw new Error('Invalid card offset');
                return checked(
                    await admin
                        .from('vocabulary_cards')
                        .select('*')
                        .eq('deck_id', id)
                        .order('term')
                        .order('id')
                        .range(offset, offset + 99),
                );
            }
            if (method === 'POST') {
                const card = checked(
                    await admin
                        .from('vocabulary_cards')
                        .insert({
                            deck_id: id,
                            term: clean(body?.term, 500, true),
                            meaning: clean(body?.meaning, 4000, true),
                            example: clean(body?.example, 4000),
                            audio_path: clean(body?.audio_path, 1000),
                        })
                        .select()
                        .single(),
                );
                checked(
                    await admin
                        .from('vocabulary_decks')
                        .update({ updated_at: new Date().toISOString() })
                        .eq('id', id),
                );
                return card;
            }
        }
    }
    if (action === 'study' && method === 'GET') {
        return checked(
            await admin.rpc('app_next_vocabulary_card', {
                p_user: user.id,
                p_deck: url.searchParams.get('deck_id') || null,
            }),
        );
    }
    if (action === 'cards' && segments[3] === 'review' && method === 'POST') {
        return checked(
            await admin.rpc('app_review_vocabulary_card', {
                p_user: user.id,
                p_card: segments[2],
                p_minutes: Number(body?.interval_minutes),
            }),
        );
    }
    if (action === 'import-apkg') throw new Error('APKG browser import is not configured yet');
    return undefined;
}
