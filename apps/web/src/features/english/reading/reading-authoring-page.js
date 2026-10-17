import { apiRequest } from '../../../core/database-client.js';
import { escapeHtml as h } from '../../../shared/escape-html.js';
const types = await apiRequest('/api/reading/author/question-types');
const typeMap = new Map(types.map((type) => [type.id, type]));
const blankQuestion = (type) => ({
    question_type: type,
    prompt: '',
    options: [],
    answer_key: { answers: [], case_sensitive: false },
    metadata: { label: '', explanation: '' },
});
const blankGroup = () => ({
    group_type: 'short_answer',
    title: '',
    instructions: '',
    options: [],
    metadata: { summary: '', paragraphs: '' },
    questions: [blankQuestion('short_answer')],
});
const blankPassage = () => ({ title: '', content: '', groups: [blankGroup()] });
const blankTest = () => ({
    title: '',
    slug: '',
    category: 'General Reading',
    description: '',
    status: 'draft',
    passages: [blankPassage()],
});
let model = blankTest();
let dirty = false;
let saving = false;
const form = document.getElementById('authorForm');
const select = document.getElementById('authorTestSelect');
const host = document.getElementById('passageEditors');
const message = document.getElementById('authorMessage');
function notify(text, kind = 'info') {
    message.textContent = text;
    message.dataset.kind = kind;
}
function syncEditorUrl() {
    const url = new URL(window.location.href);
    if (model.id) url.searchParams.set('test', model.slug);
    else url.searchParams.delete('test');
    window.history.replaceState({}, '', url);
}
function enableEditor(enabled) {
    document.getElementById('authorFields').disabled = !enabled;
    document.getElementById('saveReadingButton').disabled = !enabled;
}
function at(path) {
    return path.split('.').reduce((value, key) => value[key], model);
}
function set(path, value) {
    const keys = path.split('.');
    const key = keys.pop();
    keys.reduce((object, key) => object[key], model)[key] = value;
    dirty = true;
}
const optionText = (rows) => rows.map((row) => `${row.id} | ${row.text}`).join('\n');
const parseOptions = (value) =>
    value
        .split('\n')
        .filter((line) => line.trim())
        .map((line, index) => {
            const split = line.indexOf('|');
            return {
                id: split < 0 ? String.fromCharCode(65 + index) : line.slice(0, split).trim(),
                text: (split < 0 ? line : line.slice(split + 1)).trim(),
            };
        });
function area(label, path, value, format = '', hint = '', rows = 3) {
    return `<label>${h(label)}<textarea rows="${rows}" data-path="${path}" data-format="${format}">${h(value)}</textarea>${hint ? `<small>${h(hint)}</small>` : ''}</label>`;
}
function input(label, path, value) {
    return `<label>${h(label)}<input data-path="${path}" value="${h(value)}"/></label>`;
}
function typeSelect(path, value) {
    return `<label>Question type<select data-path="${path}" data-render="type">${types.map((type) => `<option value="${type.id}" ${type.id === value ? 'selected' : ''}>${h(type.label)}</option>`).join('')}</select></label>`;
}
function questionEditor(q, path, group, pi, gi, qi) {
    const type = typeMap.get(q.question_type);
    const choices =
        type.choices?.map((value) => ({ id: value, text: value })) ||
        (q.options.length ? q.options : group.options);
    let answer;
    if (type.kind === 'text')
        answer = area(
            'Accepted answers (one alternative per line)',
            path + '.answer_key.answers',
            q.answer_key.answers.join('\n'),
            'answers',
        );
    else if (type.kind === 'checkbox')
        answer = input(
            'Correct option IDs (comma separated)',
            path + '.answer_key.answers',
            q.answer_key.answers.join(', '),
        ).replace('data-path=', 'data-format="multiple" data-path=');
    else
        answer = `<label>Correct answer<select data-path="${path}.answer_key.answers" data-format="single"><option value="">Choose an answer</option>${choices.map((option) => `<option value="${h(option.id)}" ${q.answer_key.answers[0] === option.id ? 'selected' : ''}>${h(option.id)} - ${h(option.text)}</option>`).join('')}</select></label>`;
    return `<fieldset class="question-editor" data-question-editor><legend>Question ${q.metadata.source_number || qi + 1}</legend><div class="editor-heading">${typeSelect(path + '.question_type', q.question_type)}<button type="button" class="remove-button" data-action="remove-question" data-pi="${pi}" data-gi="${gi}" data-qi="${qi}">Remove question</button></div>
 ${area(type.kind === 'text' ? 'Prompt / sentence with blank' : 'Prompt / statement', path + '.prompt', q.prompt)}
 ${type.sharedOptions ? input('Paragraph / classification label', path + '.metadata.label', q.metadata.label || '') : ''}
 ${type.questionOptions || (type.sharedOptions && !typeMap.get(group.group_type).sharedOptions) ? area('Answer options', path + '.options', optionText(q.options), 'options', 'One per line: A | Option text. Leave the field to update the answer selector.') : ''}
 ${q.answer_key.distinct_group ? '<p>Linked choose-two answers: enter the same two correct letters in both answer slots. Each distinct letter earns one point, in either order.</p>' : ''}${answer}${type.kind === 'text' ? `<label>Case-sensitive answer<select data-path="${path}.answer_key.case_sensitive" data-format="boolean"><option value="false" ${!q.answer_key.case_sensitive ? 'selected' : ''}>No</option><option value="true" ${q.answer_key.case_sensitive ? 'selected' : ''}>Yes</option></select></label>` : ''}
 ${area('Explanation shown after submission', path + '.metadata.explanation', q.metadata.explanation || '')}</fieldset>`;
}
function render() {
    for (const key of ['title', 'slug', 'category', 'status', 'description'])
        form.querySelector(`[data-path="${key}"]`).value = model[key];
    host.innerHTML = model.passages
        .map((passage, pi) => {
            const pp = `passages.${pi}`;
            return `<fieldset class="passage-editor"><legend>Passage ${pi + 1}</legend><div class="editor-heading"><h2>Passage ${pi + 1}</h2><button type="button" class="remove-button" data-action="remove-passage" data-pi="${pi}">Remove passage</button></div>
 ${input('Passage title', pp + '.title', passage.title)}${area('Passage content', pp + '.content', passage.content, '', 'Plain text fallback. Paragraph breaks are preserved.', 8)}${area('Formatted content (optional HTML)', pp + '.content_html', passage.content_html || '', '', 'Use p, h2, h3, strong, em, blockquote, ul, ol, li and br tags.', 8)}
 ${passage.groups
     .map((group, gi) => {
         const gp = `${pp}.groups.${gi}`;
         const type = typeMap.get(group.group_type);
         return `<fieldset class="group-editor"><legend>Group ${gi + 1}</legend><div class="editor-heading">${typeSelect(gp + '.group_type', group.group_type)}<button type="button" class="remove-button" data-action="remove-group" data-pi="${pi}" data-gi="${gi}">Remove group</button></div>
 ${input('Group title', gp + '.title', group.title)}${area('Instructions', gp + '.instructions', group.instructions)}
 ${type.sharedOptions ? area('Shared headings / classification options', gp + '.options', optionText(group.options), 'options', 'One per line: A | Heading or category. Leave the field to update answer selectors.') : ''}
 ${type.paragraphs ? area('Paragraph labels and text', gp + '.metadata.paragraphs', group.metadata.paragraphs || '', '', 'One labelled paragraph per line, for example A | Paragraph text.') : ''}
 ${type.summary ? area('Summary with numbered blanks', gp + '.metadata.summary', group.metadata.summary || '', '', 'Use ___ or numbered blanks, then add a question for each blank.') : ''}
 ${group.questions.map((q, qi) => questionEditor(q, `${gp}.questions.${qi}`, group, pi, gi, qi)).join('')}
 <button type="button" class="secondary-button" data-action="add-question" data-pi="${pi}" data-gi="${gi}">Add question</button></fieldset>`;
     })
     .join('')}
 <button type="button" class="secondary-button" data-action="add-group" data-pi="${pi}">Add question group</button></fieldset>`;
        })
        .join('');
    const preview = document.getElementById('previewTestLink');
    preview.hidden = !model.id;
    preview.href = `english.html?test=${encodeURIComponent(model.slug)}`;
}
function readField(target) {
    let value = target.value;
    if (target.dataset.format === 'options') value = parseOptions(value);
    if (target.dataset.format === 'answers')
        value = value
            .split('\n')
            .map((value) => value.trim())
            .filter(Boolean);
    if (target.dataset.format === 'multiple')
        value = value
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean);
    if (target.dataset.format === 'single') value = value ? [value] : [];
    if (target.dataset.format === 'boolean') value = value === 'true';
    set(target.dataset.path, value);
}
form.addEventListener('input', (event) => {
    if (event.target.dataset.path && !event.target.dataset.render) readField(event.target);
});
form.addEventListener('change', (event) => {
    const target = event.target;
    if (!target.dataset.path) return;
    readField(target);
    if (target.dataset.render === 'type') {
        const path = target.dataset.path;
        if (path.endsWith('group_type')) {
            const group = at(path.replace('.group_type', ''));
            group.questions = group.questions.map((q) => ({
                ...q,
                question_type: group.group_type,
                answer_key: { answers: [], case_sensitive: false },
            }));
        } else
            at(path.replace('.question_type', '')).answer_key = {
                answers: [],
                case_sensitive: false,
            };
        render();
    } else if (target.dataset.format === 'options') render();
});
form.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const pi = Number(button.dataset.pi),
        gi = Number(button.dataset.gi),
        qi = Number(button.dataset.qi);
    switch (button.dataset.action) {
        case 'add-passage':
            model.passages.push(blankPassage());
            break;
        case 'remove-passage':
            model.passages.splice(pi, 1);
            break;
        case 'add-group':
            model.passages[pi].groups.push(blankGroup());
            break;
        case 'remove-group':
            model.passages[pi].groups.splice(gi, 1);
            break;
        case 'add-question': {
            const group = model.passages[pi].groups[gi];
            group.questions.push(blankQuestion(group.group_type));
            break;
        }
        case 'remove-question':
            model.passages[pi].groups[gi].questions.splice(qi, 1);
            break;
    }
    dirty = true;
    render();
});
async function refreshList() {
    const tests = await apiRequest('/api/reading/author/tests');
    select.innerHTML =
        '<option value="">New test</option>' +
        tests
            .map(
                (test) =>
                    `<option value="${h(test.id)}">${h(test.title)} (${h(test.status)})</option>`,
            )
            .join('');
    select.value = model.id || '';
    return tests;
}
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (saving) return;
    saving = true;
    document.getElementById('authorFields').disabled = true;
    document.getElementById('saveReadingButton').disabled = true;
    notify('Saving...');
    try {
        const saved = await apiRequest(
            '/api/reading/author/tests' + (model.id ? '/' + model.id : ''),
            { method: model.id ? 'PUT' : 'POST', body: JSON.stringify(model) },
        );
        model = await apiRequest('/api/reading/author/tests/' + saved.id);
        syncEditorUrl();
        dirty = false;
        render();
        await refreshList();
        notify('Saved. You can now open this test in practice mode.', 'success');
    } catch (error) {
        notify(error.message, 'error');
    } finally {
        saving = false;
        document.getElementById('authorFields').disabled = false;
        document.getElementById('saveReadingButton').disabled = false;
    }
});
select.addEventListener('change', async () => {
    if (dirty && !window.confirm('Discard unsaved edits?')) {
        select.value = model.id || '';
        return;
    }
    try {
        model = select.value
            ? await apiRequest('/api/reading/author/tests/' + select.value)
            : blankTest();
        dirty = false;
        render();
        notify('');
        syncEditorUrl();
        enableEditor(true);
    } catch (error) {
        notify(error.message, 'error');
    }
});
document.getElementById('newTestButton').addEventListener('click', () => {
    if (dirty && !window.confirm('Discard unsaved edits?')) return;
    model = blankTest();
    dirty = false;
    select.value = '';
    syncEditorUrl();
    enableEditor(true);
    render();
    notify('');
});
window.addEventListener('beforeunload', (event) => {
    if (dirty) {
        event.preventDefault();
        event.returnValue = '';
    }
});
enableEditor(false);
try {
    const tests = await refreshList();
    const requested = new URLSearchParams(window.location.search).get('test');
    if (requested) {
        const test = tests.find((test) => test.slug === requested || test.id === requested);
        if (!test)
            throw new Error(
                'This reading test is unavailable or you do not have permission to edit it.',
            );
        model = await apiRequest('/api/reading/author/tests/' + encodeURIComponent(test.id));
        select.value = model.id;
        syncEditorUrl();
    }
    render();
    enableEditor(true);
} catch (error) {
    notify(error.message, 'error');
}
