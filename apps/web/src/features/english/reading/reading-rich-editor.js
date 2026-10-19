import {
    readingMarkup,
    sanitizeReadingHtml,
    readingHtmlText,
} from '../../../domain/reading-html.js';
import { escapeHtml as h } from '../../../shared/escape-html.js';
export function richEditor(label, path, plainPath, html, text, large = false) {
    const id = 'rich-' + path.replaceAll('.', '-');
    return `<div class="reading-editor" data-rich-editor><label id="${id}-label">${h(label)}</label><div class="reading-editor-toolbar" role="toolbar" aria-label="${h(label)} formatting"><button type="button" data-rich-command="bold" aria-label="Bold"><strong>B</strong></button><button type="button" data-rich-command="italic" aria-label="Italic"><em>I</em></button><button type="button" data-rich-command="insertUnorderedList">List</button><button type="button" data-rich-command="formatBlock">Heading</button><button type="button" data-rich-command="blank">Blank</button><label>Rows<input type="number" data-table-rows value="3" min="1" max="20" aria-label="Table rows" /></label><label>Columns<input type="number" data-table-cols value="2" min="1" max="12" aria-label="Table columns" /></label><button type="button" data-rich-command="table">Insert table</button><button type="button" data-rich-command="row">Add row</button><button type="button" data-rich-command="column">Add column</button><button type="button" data-rich-command="remove-table">Remove table</button></div><div id="${id}" class="reading-editor-content reading-rich-content${large ? ' passage-content-editor' : ''}" contenteditable="true" role="textbox" aria-multiline="true" aria-labelledby="${id}-label" data-rich-path="${path}" data-plain-path="${plainPath}">${readingMarkup(html, text)}</div><small class="reading-editor-status" role="status"></small></div>`;
}
export function richValue(editor) {
    const html = sanitizeReadingHtml(editor.innerHTML);
    return {
        html,
        text: readingHtmlText(html),
        path: editor.dataset.richPath,
        plainPath: editor.dataset.plainPath,
    };
}
export function enableRichEditors(form, enabled) {
    form.querySelectorAll('[data-rich-path]').forEach((editor) => {
        editor.contentEditable = String(enabled);
        editor.setAttribute('aria-disabled', String(!enabled));
    });
}
export function initRichEditors(form) {
    const ranges = new WeakMap();
    document.addEventListener('selectionchange', () => {
        const selection = getSelection();
        if (!selection?.rangeCount) return;
        const node = selection.anchorNode;
        const editor = (node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement)?.closest(
            '[data-rich-path]',
        );
        if (editor && form.contains(editor))
            ranges.set(editor, selection.getRangeAt(0).cloneRange());
    });
    function restore(editor) {
        editor.focus();
        const range = ranges.get(editor);
        const selection = getSelection();
        if (range && editor.contains(range.commonAncestorContainer)) {
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            const end = document.createRange();
            end.selectNodeContents(editor);
            end.collapse(false);
            selection.removeAllRanges();
            selection.addRange(end);
        }
    }
    function insert(editor, html) {
        restore(editor);
        document.execCommand('insertHTML', false, html);
        editor.dispatchEvent(new Event('input', { bubbles: true }));
    }
    form.addEventListener('mousedown', (event) => {
        if (event.target.closest('[data-rich-command]')) event.preventDefault();
    });
    form.addEventListener('click', (event) => {
        const button = event.target.closest('[data-rich-command]');
        if (!button || button.closest('fieldset')?.disabled) return;
        const box = button.closest('[data-rich-editor]'),
            editor = box.querySelector('[data-rich-path]');
        if (editor.contentEditable !== 'true') return;
        box.querySelector('.reading-editor-status').textContent = '';
        restore(editor);
        const command = button.dataset.richCommand;
        if (command === 'table') {
            const rows = Math.max(
                1,
                Math.min(20, Number(box.querySelector('[data-table-rows]').value) || 3),
            );
            const cols = Math.max(
                1,
                Math.min(12, Number(box.querySelector('[data-table-cols]').value) || 2),
            );
            insert(
                editor,
                `<table><tbody>${Array.from({ length: rows }, (_, r) => `<tr>${Array.from({ length: cols }, () => (r === 0 ? '<th>Heading</th>' : '<td>Text</td>')).join('')}</tr>`).join('')}</tbody></table><p><br></p>`,
            );
        } else if (command === 'blank') insert(editor, '___');
        else if (['row', 'column', 'remove-table'].includes(command)) {
            const node = getSelection()?.anchorNode;
            const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
            const table = element?.closest('table');
            if (!table || !editor.contains(table)) {
                box.querySelector('.reading-editor-status').textContent =
                    'Click inside a table first.';
                return;
            }
            if (command === 'row') {
                const row = element.closest('tr') || table.rows[table.rows.length - 1];
                const next = document.createElement('tr');
                for (const cell of row.cells) {
                    const td = document.createElement('td');
                    if (cell.colSpan > 1) td.colSpan = cell.colSpan;
                    td.innerHTML = '<br>';
                    next.append(td);
                }
                row.after(next);
            } else if (command === 'column') {
                for (const row of table.rows) {
                    const cell = document.createElement(
                        row.cells[0]?.tagName === 'TH' ? 'th' : 'td',
                    );
                    cell.innerHTML = '<br>';
                    row.append(cell);
                }
            } else table.remove();
            editor.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            document.execCommand(command, false, command === 'formatBlock' ? 'h3' : undefined);
            editor.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    form.addEventListener('paste', (event) => {
        const editor = event.target.closest('[data-rich-path]');
        if (!editor || editor.contentEditable !== 'true') return;
        event.preventDefault();
        const html = event.clipboardData.getData('text/html');
        insert(
            editor,
            html
                ? sanitizeReadingHtml(html)
                : readingMarkup('', event.clipboardData.getData('text/plain')),
        );
    });
}
