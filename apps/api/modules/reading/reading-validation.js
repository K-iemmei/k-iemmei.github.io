const { typeMap } = require('./question-types');
const { sanitizeReadingHtml, readingHtmlText } = require('../../../web/src/domain/reading-html.js');
const invalid = (message) => {
    throw Object.assign(new Error(message), { status: 400 });
};
function object(value, label) {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        invalid(label + ' must be an object');
    return value;
}
function text(value, label, max = 10000, required = false) {
    if (typeof value !== 'string') {
        if (value === undefined && !required) return '';
        invalid(label + ' must be text');
    }
    const result = value.trim();
    if (result.length > max || (required && !result))
        invalid(label + ' is required and must be at most ' + max + ' characters');
    return result;
}
function richContent(value, label, max = 120000) {
    const html = text(value, label, max);
    if (!html) return '';
    if (/<\/?(script|style|iframe|object|embed|form|input|svg|math)\b/i.test(html))
        invalid(label + ' contains an unsafe HTML element');
    return sanitizeReadingHtml(html);
}
function options(value, label) {
    if (!Array.isArray(value) || value.length > 100)
        invalid(label + ' must contain at most 100 options');
    const rows = value.map((option) => ({
        id: text(object(option, label).id, label + ' ID', 40, true),
        text: text(option.text, label + ' text', 1000, true),
    }));
    if (new Set(rows.map((row) => row.id)).size !== rows.length)
        invalid(label + ' IDs must be unique');
    return rows;
}
function validateTest(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input))
        invalid('Test must be an object');
    const title = text(input.title, 'Title', 200, true);
    const slug = text(input.slug, 'Slug', 200, true);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
        invalid('Slug must use lowercase letters, numbers and hyphens');
    if (!['draft', 'published', 'archived'].includes(input.status)) invalid('Invalid status');
    const result = {
        title,
        slug,
        category: text(input.category, 'Category', 100, true),
        description: text(input.description, 'Description', 4000),
        status: input.status,
    };
    if (!Array.isArray(input.passages) || input.passages.length < 1 || input.passages.length > 20)
        invalid('Add 1 to 20 passages');
    let questionCount = 0;
    result.passages = input.passages.map((passage, pi) => {
        const label = 'Passage ' + (pi + 1);
        object(passage, label);
        if (
            !Array.isArray(passage.groups) ||
            passage.groups.length < 1 ||
            passage.groups.length > 40
        )
            invalid(label + ' needs 1 to 40 groups');
        const contentHtml = richContent(passage.content_html, label + ' formatted content');
        return {
            title: text(passage.title, label + ' title', 200),
            content: text(
                contentHtml ? readingHtmlText(contentHtml) : passage.content,
                label + ' content',
                100000,
                true,
            ),
            content_html: contentHtml,
            groups: passage.groups.map((group, gi) => {
                const prefix = label + ', group ' + (gi + 1);
                object(group, prefix);
                const type = typeMap.get(group.group_type);
                if (!type) invalid(prefix + ': unsupported type');
                const groupOptions = options(group.options || [], prefix + ' options');
                const meta = group.metadata || {};
                const metadata = {
                    summary: text(meta.summary, prefix + ' summary', 20000),
                    paragraphs: text(meta.paragraphs, prefix + ' paragraph labels', 20000),
                };
                for (const field of ['summary_html', 'instructions_html'])
                    if (meta[field] !== undefined)
                        metadata[field] = richContent(
                            meta[field],
                            prefix + ' formatted content',
                            20000,
                        );
                if (metadata.summary_html)
                    metadata.summary = readingHtmlText(metadata.summary_html);
                if (meta.source_pages !== undefined) {
                    if (!Array.isArray(meta.source_pages) || meta.source_pages.length > 20)
                        invalid(prefix + ': at most 20 source pages');
                    metadata.source_pages = meta.source_pages.map((page) => {
                        object(page, prefix + ' source page');
                        if (
                            !/^cambridge-(?:[1-9]|1[0-9]|2[01])-p\d{3}(?:-[lr])?\.png$/.test(
                                page.file,
                            )
                        )
                            invalid(prefix + ': invalid source page filename');
                        return {
                            file: page.file,
                            label: text(page.label, prefix + ' source page label', 200, true),
                        };
                    });
                }
                if (meta.figures !== undefined) {
                    if (!Array.isArray(meta.figures) || meta.figures.length > 20)
                        invalid(prefix + ': at most 20 figures');
                    metadata.figures = meta.figures.map((figure) => {
                        object(figure, prefix + ' figure');
                        if (
                            !/^cambridge-(?:[1-9]|1[0-9]|2[01])-p\d{3}(?:-[lr])?-figure\.png$/.test(
                                figure.file,
                            )
                        )
                            invalid(prefix + ': invalid figure filename');
                        return {
                            file: figure.file,
                            label: text(figure.label, prefix + ' figure label', 200, true),
                        };
                    });
                }
                if (type.summary && !metadata.summary)
                    invalid(prefix + ': enter the summary with blanks');
                if (type.paragraphs && !metadata.paragraphs)
                    invalid(prefix + ': enter paragraph labels');
                if (
                    !Array.isArray(group.questions) ||
                    !group.questions.length ||
                    group.questions.length > 100
                )
                    invalid(prefix + ': add 1 to 100 questions');
                const questions = group.questions.map((question, qi) => {
                    questionCount++;
                    if (questionCount > 400) invalid('At most 400 questions per test');
                    const qlabel = prefix + ', question ' + (qi + 1);
                    object(question, qlabel);
                    const qtype = typeMap.get(question.question_type || group.group_type);
                    if (!qtype) invalid(qlabel + ': unsupported type');
                    const ownOptions = options(question.options || [], qlabel + ' options');
                    const choices =
                        qtype.choices ||
                        (ownOptions.length ? ownOptions : groupOptions).map((option) => option.id);
                    const key = question.answer_key || {};
                    if (
                        !Array.isArray(key.answers) ||
                        (input.status !== 'draft' && !key.answers.length) ||
                        key.answers.length > 100
                    )
                        invalid(qlabel + ': enter at least one answer');
                    const answers = key.answers.map((answer) =>
                        text(answer, qlabel + ' answer', 1000, true),
                    );
                    if (new Set(answers).size !== answers.length)
                        invalid(qlabel + ': duplicate answers');
                    if (qtype.kind !== 'text') {
                        if (choices.length < 2) invalid(qlabel + ': add at least two options');
                        if (answers.some((answer) => !choices.includes(answer)))
                            invalid(qlabel + ': answer must match an option ID');
                        if (qtype.kind !== 'checkbox' && answers.length > 1)
                            invalid(qlabel + ': choose one answer');
                    }
                    const distinctGroup = text(
                        key.distinct_group,
                        qlabel + ' linked answer group',
                        100,
                    );
                    if (distinctGroup && qtype.kind !== 'text')
                        invalid(qlabel + ': linked answer slots must use text answers');
                    const aliases = key.aliases || [];
                    if (
                        !Array.isArray(aliases) ||
                        aliases.length > 100 ||
                        (aliases.length && qtype.kind !== 'text')
                    )
                        invalid(qlabel + ': invalid answer aliases');
                    const normalizeAlias = (value) => {
                        const normalized = value.normalize('NFKC').trim().replace(/\s+/g, ' ');
                        return key.case_sensitive === true ? normalized : normalized.toLowerCase();
                    };
                    const aliasNames = new Set(answers.map(normalizeAlias));
                    const normalizedAliases = aliases.map((alias) => {
                        object(alias, qlabel + ' alias');
                        const value = text(alias.value, qlabel + ' alias value', 1000, true);
                        const answer = text(alias.answer, qlabel + ' alias answer', 1000, true);
                        if (!answers.includes(answer) || aliasNames.has(normalizeAlias(value)))
                            invalid(
                                qlabel + ': aliases must uniquely reference an accepted answer',
                            );
                        aliasNames.add(normalizeAlias(value));
                        return { value, answer };
                    });
                    const sourceNumber = question.metadata?.source_number;
                    if (
                        sourceNumber !== undefined &&
                        (!Number.isInteger(sourceNumber) ||
                            sourceNumber < 1 ||
                            sourceNumber > 10000)
                    )
                        invalid(qlabel + ': invalid source question number');
                    const promptHtml = richContent(
                        question.metadata?.prompt_html,
                        qlabel + ' formatted prompt',
                        20000,
                    );
                    return {
                        question_type: qtype.id,
                        prompt: text(
                            promptHtml ? readingHtmlText(promptHtml) : question.prompt,
                            qlabel + ' prompt',
                            10000,
                            true,
                        ),
                        options: ownOptions,
                        answer_key: {
                            answers,
                            match: qtype.kind === 'checkbox' ? 'all' : 'one',
                            case_sensitive: key.case_sensitive === true,
                            ...(distinctGroup ? { distinct_group: distinctGroup } : {}),
                            ...(normalizedAliases.length ? { aliases: normalizedAliases } : {}),
                        },
                        metadata: {
                            ...(promptHtml ? { prompt_html: promptHtml } : {}),
                            ...(sourceNumber === undefined ? {} : { source_number: sourceNumber }),
                            label: text(question.metadata?.label, qlabel + ' label', 100),
                            explanation: text(
                                question.metadata?.explanation,
                                qlabel + ' explanation',
                                10000,
                            ),
                        },
                    };
                });
                const pools = new Map();
                for (const q of questions) {
                    if (!q.answer_key.distinct_group) continue;
                    const id = q.answer_key.distinct_group;
                    if (!pools.has(id)) pools.set(id, []);
                    pools.get(id).push(q);
                }
                for (const linked of pools.values()) {
                    const first = linked[0].answer_key;
                    const canonical = (values) =>
                        JSON.stringify(
                            values.map((v) => (first.case_sensitive ? v : v.toLowerCase())).sort(),
                        );
                    if (
                        linked.length < 2 ||
                        (first.answers.length && first.answers.length !== linked.length) ||
                        linked.some(
                            (q) =>
                                q.answer_key.case_sensitive !== first.case_sensitive ||
                                canonical(q.answer_key.answers) !== canonical(first.answers) ||
                                canonical(
                                    (q.answer_key.aliases || []).map((a) => JSON.stringify(a)),
                                ) !==
                                    canonical((first.aliases || []).map((a) => JSON.stringify(a))),
                        )
                    )
                        invalid(
                            prefix +
                                ': linked slots must share the same distinct answers, one accepted answer per slot',
                        );
                    if (
                        new Set(
                            first.answers.map((v) => (first.case_sensitive ? v : v.toLowerCase())),
                        ).size !== first.answers.length
                    )
                        invalid(prefix + ': linked answers must be distinct');
                }
                return {
                    group_type: type.id,
                    title: text(group.title, prefix + ' title', 200),
                    instructions: text(
                        metadata.instructions_html
                            ? readingHtmlText(metadata.instructions_html)
                            : group.instructions,
                        prefix + ' instructions',
                        4000,
                    ),
                    options: groupOptions,
                    metadata,
                    questions,
                };
            }),
        };
    });
    return result;
}
module.exports = { validateTest };
