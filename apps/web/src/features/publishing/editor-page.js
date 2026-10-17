import {
    initWritingShell,
    request,
    userId,
    message,
    paintRich,
    watchTheme,
    confirmAction,
} from './common.js';
import { MAX_IMAGE_BYTES } from '../../domain/publishing.js';
initWritingShell();
const title = document.getElementById('noteTitle');
const body = document.getElementById('noteBody');
const tags = document.getElementById('noteTags');
const preview = document.getElementById('notePreview');
const status = document.getElementById('noteSaveStatus');
let note = { id: null, title: '', body: '', tags: [], version: 0, publication: null };
let dirty = false,
    revision = 0,
    saving = null,
    saveTimer,
    previewTimer,
    publicationBusy = false,
    conflicted = false,
    ready = false;
const backupKey = (id = note.id) => `note-recovery:${userId}:${id || 'new'}`;
function fields() {
    return {
        title: title.value,
        body: body.value,
        tags: tags.value
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean),
    };
}
function backup() {
    try {
        localStorage.setItem(
            backupKey(),
            JSON.stringify({
                ...fields(),
                base_version: note.version,
                saved_at: new Date().toISOString(),
            }),
        );
    } catch {
        /* Server save status remains visible. */
    }
}
function clearBackup(id = note.id) {
    try {
        localStorage.removeItem(backupKey(id));
    } catch {}
}
function updateControls() {
    document.getElementById('notePost').textContent = note.publication
        ? dirty || note.publication.note_version !== note.version
            ? 'Update post'
            : 'View post'
        : 'Post to Blog';
    document.getElementById('noteUnpublish').hidden = !note.publication;
    const link = document.getElementById('notePublishedLink');
    link.hidden = !note.publication;
    link.href = note.id ? 'post.html?id=' + encodeURIComponent(note.id) : '#';
    document.getElementById('noteDelete').disabled = !note.id || publicationBusy;
    document.getElementById('notePost').disabled = !ready || publicationBusy || conflicted;
    document.getElementById('noteSave').disabled = !ready || publicationBusy || conflicted;
    document.getElementById('notePublicationStatus').textContent = note.publication
        ? note.publication.note_version === note.version && !dirty
            ? 'Posted copy is up to date.'
            : 'Private edits · public post is unchanged.'
        : 'Private · visible only to you';
    document.getElementById('noteWordCount').textContent =
        `${body.value.trim() ? body.value.trim().split(/\s+/).length : 0} words`;
}
async function paint() {
    document.getElementById('notePreviewTitle').textContent = title.value || 'Untitled note';
    await paintRich(preview, body.value).catch((error) =>
        message('Preview unavailable: ' + error.message, 'error'),
    );
}
function setFields(value) {
    title.value = value.title || '';
    body.value = value.body || '';
    tags.value = (value.tags || []).join(', ');
}
function changed() {
    if (!ready) return;
    dirty = true;
    revision += 1;
    status.textContent = 'Unsaved changes';
    backup();
    updateControls();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => save().catch(() => {}), 1200);
    clearTimeout(previewTimer);
    previewTimer = setTimeout(paint, 300);
}
async function save({ force = false } = {}) {
    clearTimeout(saveTimer);
    if (saving) return saving;
    if (conflicted)
        throw Error('Reload the latest version before saving. Your draft is kept in this browser.');
    if (!dirty && note.id) return note;
    if (!force && !note.id && !title.value.trim() && !body.value.trim() && !tags.value.trim())
        return note;
    saving = (async () => {
        do {
            const capturedRevision = revision;
            const payload = fields();
            status.textContent = 'Saving…';
            try {
                const oldId = note.id;
                const saved = await request(
                    '/api/notes' + (note.id ? '/' + encodeURIComponent(note.id) : ''),
                    {
                        method: note.id ? 'PUT' : 'POST',
                        body: JSON.stringify({
                            ...payload,
                            ...(note.id ? { version: note.version } : {}),
                        }),
                    },
                );
                note = { ...note, ...saved };
                const url = new URL(location.href);
                url.searchParams.set('id', note.id);
                history.replaceState({}, '', url);
                document.title = `${note.title || 'Untitled note'} · Notes | Daily Note`;
                clearBackup(oldId);
                dirty = revision !== capturedRevision;
                if (dirty) backup();
                else clearBackup();
                status.textContent = dirty ? 'Saving new changes…' : 'Saved';
                updateControls();
            } catch (error) {
                conflicted = error.status === 409;
                status.textContent = conflicted ? 'Conflict · draft kept locally' : 'Not saved';
                message(error.message, 'error');
                backup();
                updateControls();
                throw error;
            }
        } while (dirty);
        return note;
    })().finally(() => {
        saving = null;
    });
    return saving;
}
function setBusy(value) {
    publicationBusy = value;
    for (const element of [
        title,
        body,
        tags,
        ...document.querySelectorAll('.editor-toolbar button,#noteUnpublish'),
    ])
        element.disabled = value || !ready;
    updateControls();
}
for (const input of [title, body, tags]) input.addEventListener('input', changed);
document
    .getElementById('noteSave')
    .addEventListener('click', () => save({ force: true }).catch(() => {}));
document.getElementById('notePost').addEventListener('click', async () => {
    if (note.publication && !dirty && note.publication.note_version === note.version) {
        location.href = 'post.html?id=' + encodeURIComponent(note.id);
        return;
    }
    setBusy(true);
    message('');
    try {
        await save({ force: true });
        await request(`/api/notes/${note.id}/publish`, {
            method: 'POST',
            body: JSON.stringify({ version: note.version }),
        });
        dirty = false;
        clearBackup();
        location.href = 'post.html?id=' + encodeURIComponent(note.id);
    } catch (error) {
        message(error.message, 'error');
    } finally {
        setBusy(false);
    }
});
document.getElementById('noteUnpublish').addEventListener('click', async () => {
    if (
        !(await confirmAction({
            title: 'Unpublish this post?',
            detail: 'The post and its published images will stop being available to other users. Your private note is kept.',
            label: 'Unpublish',
        }))
    )
        return;
    setBusy(true);
    try {
        await save();
        await request(`/api/notes/${note.id}/unpublish`, {
            method: 'POST',
            body: JSON.stringify({ version: note.version }),
        });
        note.publication = null;
        message('Post unpublished. Your note is still private.');
    } catch (error) {
        message(error.message, 'error');
    } finally {
        setBusy(false);
    }
});
document.getElementById('noteDelete').addEventListener('click', async () => {
    if (
        !(await confirmAction({
            title: 'Delete this note?',
            detail: note.publication
                ? 'This deletes the private note, its published post and all attached images.'
                : 'This permanently deletes the note and its attached images.',
            label: 'Delete note',
        }))
    )
        return;
    clearTimeout(saveTimer);
    setBusy(true);
    try {
        if (saving) await saving;
        await request(`/api/notes/${note.id}?version=${note.version}`, { method: 'DELETE' });
        dirty = false;
        clearBackup();
        location.href = 'notes.html';
    } catch (error) {
        message(error.message, 'error');
        setBusy(false);
    }
});
function insert(text) {
    body.setRangeText(text, body.selectionStart, body.selectionEnd, 'end');
    body.focus();
    body.dispatchEvent(new Event('input', { bubbles: true }));
}
const snippets = {
    heading: () =>
        `\n## ${body.value.slice(body.selectionStart, body.selectionEnd) || 'Heading'}\n`,
    bold: () => `**${body.value.slice(body.selectionStart, body.selectionEnd) || 'bold text'}**`,
    italic: () => `*${body.value.slice(body.selectionStart, body.selectionEnd) || 'italic text'}*`,
    list: () => '\n- First point\n- Second point\n',
    quote: () => '\n> A thought worth keeping.\n',
    code: () => '\n```python\ndef greet(name):\n    return f"Hello, {name}"\n```\n',
    math: () => '\n$$\nf(x) = \\frac{1}{\\sqrt{2\\pi}}e^{-x^2/2}\n$$\n',
    chart: () =>
        '\n```chart\n' +
        JSON.stringify(
            {
                type: 'bar',
                title: 'Weekly progress',
                labels: ['Mon', 'Tue', 'Wed'],
                datasets: [{ label: 'Minutes', data: [20, 35, 45] }],
            },
            null,
            2,
        ) +
        '\n```\n',
    diagram: () =>
        '\n```mermaid\nflowchart LR\n    A[Idea] --> B[Private note]\n    B --> C[Preview]\n    C --> D[Blog post]\n```\n',
    table: () =>
        '\n| Topic | Status |\n| --- | --- |\n| Reading | In progress |\n| Grammar | Completed |\n',
};
document
    .querySelectorAll('[data-insert]')
    .forEach((button) =>
        button.addEventListener('click', () => insert(snippets[button.dataset.insert]())),
    );
document.querySelectorAll('[data-editor-mode]').forEach((button) =>
    button.addEventListener('click', () => {
        document.getElementById('editorLayout').dataset.mode = button.dataset.editorMode;
        document
            .querySelectorAll('[data-editor-mode]')
            .forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
        if (button.dataset.editorMode !== 'write') paint();
    }),
);
const imageInput = document.getElementById('noteImageFile');
document.getElementById('noteImageButton').addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', async () => {
    const file = imageInput.files[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
        message('Choose an image up to 2 MB.', 'error');
        imageInput.value = '';
        return;
    }
    setBusy(true);
    message('Uploading image…');
    try {
        await save({ force: true });
        const encoded = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        const image = await request('/api/notes/assets', {
            method: 'POST',
            body: JSON.stringify({ note_id: note.id, mime_type: file.type, data_base64: encoded }),
        });
        insert(`\n\n![${file.name.replace(/[\[\]\\\n]/g, ' ')}](note-asset:${image.id})\n\n`);
        message('Image uploaded privately. It becomes visible with the posted version.');
    } catch (error) {
        message(error.message, 'error');
    } finally {
        imageInput.value = '';
        setBusy(false);
    }
});
document
    .getElementById('noteFormatHelp')
    .addEventListener('click', () => document.getElementById('formatHelp').showModal());
document.addEventListener('keydown', (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    if (event.key.toLowerCase() === 's') {
        event.preventDefault();
        save({ force: true }).catch(() => {});
    } else if (document.activeElement === body && ['b', 'i'].includes(event.key.toLowerCase())) {
        event.preventDefault();
        insert(snippets[event.key.toLowerCase() === 'b' ? 'bold' : 'italic']());
    }
});
window.addEventListener('beforeunload', (event) => {
    if (dirty) {
        event.preventDefault();
        event.returnValue = '';
    }
});
watchTheme(() => paint());
setBusy(true);
if (matchMedia('(max-width: 900px)').matches) {
    document.getElementById('editorLayout').dataset.mode = 'write';
    document
        .querySelectorAll('[data-editor-mode]')
        .forEach((button) =>
            button.setAttribute('aria-pressed', String(button.dataset.editorMode === 'write')),
        );
}
try {
    const id = new URLSearchParams(location.search).get('id');
    if (id) note = await request('/api/notes/' + encodeURIComponent(id));
    setFields(note);
    ready = true;
    status.textContent = note.id ? 'Saved' : 'New private note';
    document.title = `${note.title || 'New note'} · Notes | Daily Note`;
    let recovered;
    try {
        recovered = JSON.parse(localStorage.getItem(backupKey()) || 'null');
    } catch {}
    if (
        recovered &&
        typeof recovered.title === 'string' &&
        typeof recovered.body === 'string' &&
        Array.isArray(recovered.tags)
    ) {
        document.getElementById('noteRecovery').hidden = false;
        document.getElementById('noteRestoreDraft').addEventListener('click', () => {
            setFields(recovered);
            document.getElementById('noteRecovery').hidden = true;
            conflicted = false;
            changed();
            paint();
        });
        document.getElementById('noteDiscardDraft').addEventListener('click', () => {
            clearBackup();
            document.getElementById('noteRecovery').hidden = true;
        });
    }
    setBusy(false);
    await paint();
    updateControls();
} catch (error) {
    ready = false;
    setBusy(true);
    status.textContent = 'Note unavailable';
    message(error.message, 'error');
}
