import { gradeTest } from './grade.ts';
import { questionTypes } from './question-types.ts';

function checked(result) {
    if (result.error) throw new Error(result.error.message);
    return result.data;
}
const order = (rows, field) => (rows || []).sort((a, b) => a[field] - b[field]);

export async function readingApi(admin, user, path, method, body) {
    const segments = path.split('/').filter(Boolean);
    const author = segments[0] === 'reading' && segments[1] === 'author';
    if (author && segments[2] === 'question-types' && method === 'GET') return questionTypes;
    if (author && segments[2] === 'tests') {
        const id = segments[3];
        if (!id && method === 'GET')
            return checked(
                await admin
                    .from('reading_tests')
                    .select('id,category,title,slug,description,status,version,updated_at')
                    .eq('created_by', user.id)
                    .order('updated_at', { ascending: false }),
            );
        if (id && method === 'GET') return await detail(admin, 'id', id, user.id, true);
        if (method === 'POST' || method === 'PUT') {
            validate(body);
            const saved = checked(
                await admin.rpc('app_save_reading_test', {
                    p_user: user.id,
                    p_test: body,
                    p_id: id || null,
                    p_version: id ? body.version : null,
                }),
            );
            return checked(await admin.from('reading_tests').select('*').eq('id', saved).single());
        }
    }
    if (segments[0] !== 'tests') return undefined;
    const slug = segments[1];
    if (!slug && method === 'GET') {
        const rows = checked(
            await admin
                .from('reading_tests')
                .select('id,created_by,category,title,slug,description,status,version,updated_at')
                .neq('status', 'archived')
                .order('updated_at', { ascending: false }),
        );
        return rows.filter((row) => row.status === 'published' || row.created_by === user.id);
    }
    if (!slug) return undefined;
    if (segments[2] === 'attempts') {
        if (method === 'GET') {
            const test = checked(
                await admin
                    .from('reading_tests')
                    .select('id,status,created_by')
                    .eq('slug', slug)
                    .maybeSingle(),
            );
            if (!test || (test.status !== 'published' && test.created_by !== user.id))
                throw new Error('Test not found');
            return checked(
                await admin
                    .from('reading_attempts')
                    .select('*')
                    .eq('test_id', test.id)
                    .eq('user_id', user.id)
                    .order('completed_at', { ascending: false }),
            );
        }
        if (method === 'POST') {
            const test = await detail(admin, 'slug', slug, user.id);
            if (!test) throw new Error('Test not found');
            if (body?.version !== test.version)
                throw new Error('Test changed. Reload before submitting.');
            const score = gradeTest(test, body.responses);
            return checked(
                await admin
                    .from('reading_attempts')
                    .insert({
                        test_id: test.id,
                        user_id: user.id,
                        test_version: test.version,
                        test_title: test.title,
                        ...score,
                    })
                    .select()
                    .single(),
            );
        }
    }
    if (segments[2] === 'source-pages' && method === 'GET') {
        const test = await detail(admin, 'slug', slug, user.id);
        const filename = segments[3];
        if (
            !test ||
            !/^cambridge-(?:[1-9]|1[0-9]|2[01])-p\d{3}(?:-[lr])?(?:-figure)?\.png$/.test(
                filename || '',
            )
        )
            throw new Error('Source image not found');
        const allowed = test.passages
            .flatMap((p) =>
                p.groups.flatMap((g) => [
                    ...(g.metadata.source_pages || []),
                    ...(g.metadata.figures || []),
                ]),
            )
            .some((image) => image.file === filename);
        if (!allowed) throw new Error('Source image not found');
        const file = checked(await admin.storage.from('reading-assets').download(filename));
        return { __binary: file, __contentType: 'image/png' };
    }
    if (method === 'GET') {
        const test = await detail(admin, 'slug', slug, user.id);
        if (!test) throw new Error('Test not found');
        test.ungraded_count = test.passages
            .flatMap((p) => p.groups.flatMap((g) => g.questions))
            .filter((q) => !(q.answer_key?.answers || []).length).length;
        for (const passage of test.passages)
            for (const group of passage.groups)
                for (const question of group.questions) {
                    delete question.answer_key;
                    if (question.metadata) delete question.metadata.explanation;
                }
        for (const passage of test.passages)
            for (const group of passage.groups) {
                for (const image of [
                    ...(group.metadata?.source_pages || []),
                    ...(group.metadata?.figures || []),
                ]) {
                    if (
                        /^cambridge-(?:[1-9]|1[0-9]|2[01])-p\d{3}(?:-[lr])?(?:-figure)?\.png$/.test(
                            image.file || '',
                        )
                    ) {
                        const signed = await admin.storage
                            .from('reading-assets')
                            .createSignedUrl(image.file, 3600);
                        if (!signed.error) image.url = signed.data.signedUrl;
                    }
                }
            }
        return test;
    }
    return undefined;
}

async function detail(admin, field, value, userId, author = false) {
    const test = checked(
        await admin.from('reading_tests').select('*').eq(field, value).maybeSingle(),
    );
    if (
        !test ||
        (author
            ? test.created_by !== userId
            : test.status !== 'published' && test.created_by !== userId)
    )
        return null;
    const passages = order(
        checked(await admin.from('reading_passages').select('*').eq('test_id', test.id)),
        'passage_order',
    );
    const passageIds = passages.map((p) => p.id);
    const groups = passageIds.length
        ? order(
              checked(
                  await admin
                      .from('reading_question_groups')
                      .select('*')
                      .in('passage_id', passageIds),
              ),
              'group_order',
          )
        : [];
    const groupIds = groups.map((g) => g.id);
    const questions = groupIds.length
        ? order(
              checked(await admin.from('reading_questions').select('*').in('group_id', groupIds)),
              'question_order',
          )
        : [];
    test.passages = passages.map((p) => ({
        ...p,
        groups: groups
            .filter((g) => g.passage_id === p.id)
            .map((g) => ({ ...g, questions: questions.filter((q) => q.group_id === g.id) })),
    }));
    return test;
}
function validate(test) {
    if (
        !test ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(test.slug || '') ||
        !['draft', 'published', 'archived'].includes(test.status) ||
        !test.title?.trim() ||
        !test.category?.trim()
    )
        throw new Error('Invalid test title, slug, category or status');
    if (!Array.isArray(test.passages) || !test.passages.length || test.passages.length > 20)
        throw new Error('Add 1 to 20 passages');
    let count = 0;
    for (const passage of test.passages) {
        if (
            !passage.content?.trim() ||
            passage.content.length > 100000 ||
            !Array.isArray(passage.groups) ||
            !passage.groups.length ||
            passage.groups.length > 40
        )
            throw new Error('Passage needs content and question groups');
        const rich = passage.content_html || '';
        if (rich.length > 120000 || rich.replace(/<[^>]*>/g, '').includes('<'))
            throw new Error('Unsafe passage HTML');
        for (const tag of rich.match(/<[^>]*>/g) || [])
            if (
                !/^<\/?(?:p|div|span|h2|h3|h4|strong|b|em|i|br|ul|ol|li|blockquote)(?:\s+class=(['"])[a-z0-9 _-]+\1)?\s*\/?>$/i.test(
                    tag,
                )
            )
                throw new Error('Unsafe passage HTML');
        for (const group of passage.groups) {
            if (
                !questionTypes.some((type) => type.id === group.group_type) ||
                !Array.isArray(group.questions) ||
                !group.questions.length ||
                group.questions.length > 100
            )
                throw new Error('Invalid question group');
            for (const question of group.questions) {
                if (
                    ++count > 400 ||
                    !question.prompt?.trim() ||
                    !questionTypes.some((type) => type.id === question.question_type) ||
                    !Array.isArray(question.answer_key?.answers) ||
                    (test.status === 'published' && !question.answer_key.answers.length)
                )
                    throw new Error('Invalid question or answer key');
            }
        }
    }
}
