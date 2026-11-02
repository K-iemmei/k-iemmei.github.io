import { apiRequest } from '../../core/database-client.js';
import { escapeHtml as h } from '../../shared/escape-html.js';
import { priorityCatalog } from './content/priority-catalog.js';
import { filterPriorityWords } from '../../domain/priority-vocabulary.js';
import { relatedPriorityWords } from '../../domain/priority-relations.js';

const $ = (id) => document.getElementById(id),
    pageSize = 36;
let catalog = [...priorityCatalog],
    progress = new Map(),
    ready = false,
    pending = new Set(),
    limit = pageSize,
    generation = 0;
const contents = new Map(),
    requests = new Map();
function letterContent(letter) {
    if (!priorityCatalog.some((word) => word.letter === letter)) return Promise.resolve();
    if (!requests.has(letter))
        requests.set(
            letter,
            import(`./content/priority/${letter}.js`)
                .then((module) => {
                    module.words.forEach((word) => contents.set(word.id, word));
                })
                .catch((error) => {
                    requests.delete(letter);
                    throw error;
                }),
        );
    return requests.get(letter);
}
function card(word, comparison = false) {
    const entry = progress.get(word.id),
        count = entry?.completed_rounds || 0,
        content = contents.get(word.id);
    const headingId = `heading-${comparison ? 'related-' : ''}${word.id}`;
    return `<article class="priority-word ${count === 5 ? 'is-mastered' : ''}" data-word="${word.id}" ${comparison ? '' : 'tabindex="0" aria-haspopup="dialog"'} aria-labelledby="${headingId}">
        <header><div><h3 id="${headingId}" lang="en">${h(word.term)}</h3><small>${word.custom ? 'Từ tự thêm' : `${h(word.pos)} · ${h(word.level)}`}${word.qualifier ? ` · ${h(word.qualifier)}` : ''}</small></div>${count === 5 ? '<span class="priority-mastered" aria-label="Đã học đủ 5 lần">✓</span>' : ''}</header>
        ${comparison ? '' : `<button type="button" class="priority-related-trigger" data-related="${word.id}" aria-haspopup="dialog" aria-controls="priorityRelatedDialog">Từ liên quan ↗</button>`}
        ${content?.pronunciation ? `<p class="priority-pronunciation" lang="en">/${h(content.pronunciation)}/</p>` : ''}
        <details class="priority-definition"><summary><span class="definition-show">Hiện nghĩa</span><span class="definition-hide">Ẩn nghĩa</span></summary><ol class="priority-meanings">${(content?.senses || []).map((sense) => `<li>${sense.pos ? `<small>${h(sense.pos)}</small> ` : ''}${h(sense.meaning)}</li>`).join('')}</ol></details>
        <details class="priority-examples"><summary>Ví dụ thực tế</summary>${(content?.examples || []).map((example) => `<figure><blockquote lang="en">${h(example.en)}</blockquote>${example.vi ? `<figcaption>${h(example.vi)}</figcaption>` : ''}</figure>`).join('')}</details>
        ${
            comparison
                ? `<p class="priority-comparison-progress">Đã học ${count}/5 lượt</p>`
                : `<div class="priority-checks" role="group" aria-label="5 lần học ${h(word.term)}">${Array.from(
                      { length: 5 },
                      (_, i) => {
                          const checked = i < count,
                              available = i === count || i === count - 1;
                          const date = entry?.studied_at?.[i];
                          const label = checked
                              ? `Lượt ${i + 1} đã học${date ? ' · ' + new Date(date).toLocaleString('vi-VN') : ''}${i === count - 1 ? ' · Bấm để bỏ tích' : ''}`
                              : `Đánh dấu đã học lượt ${i + 1}`;
                          return `<button type="button" class="priority-check ${checked ? 'is-checked' : ''}" role="checkbox" aria-checked="${checked}" aria-label="${h(label)}" title="${h(label)}" data-round="${i + 1}" ${!ready || pending.has(word.id) || !available ? 'disabled' : ''}><span aria-hidden="true">${checked ? '✓' : i + 1}</span></button>`;
                      },
                  ).join('')}</div>`
        }</article>`;
}

let comparisonGeneration = 0;
function initRelatedWords() {
    const dialog = $('priorityRelatedDialog');
    let opener;
    function close() {
        dialog.close();
    }
    $('priorityRelatedClose').addEventListener('click', close);
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            const rect = dialog.getBoundingClientRect();
            if (
                event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom
            )
                close();
        }
    });
    dialog.addEventListener('close', () => {
        comparisonGeneration++;
        document.body.classList.remove('priority-comparison-open');
        if (opener?.isConnected) opener.focus();
    });
    async function open(article) {
        const selected = catalog.find((word) => word.id === article.dataset.word);
        if (!selected) return;
        opener = article;
        const token = ++comparisonGeneration;
        $('priorityRelatedTitle').textContent = `Từ liên quan đến “${selected.term}”`;
        $('priorityRelatedStatus').textContent = 'Đang tìm các từ liên quan…';
        $('priorityRelatedWords').innerHTML = '';
        dialog.showModal();
        document.body.classList.add('priority-comparison-open');
        try {
            await Promise.all(
                [...new Set(priorityCatalog.map((word) => word.letter))].map(letterContent),
            );
            if (token !== comparisonGeneration || !dialog.open) return;
            const related = relatedPriorityWords(selected, catalog, contents);
            $('priorityRelatedStatus').textContent = related.length
                ? `${related.length} từ liên quan · Gợi ý theo nghĩa chung hoặc nhóm học; không phải từ nào cũng thay thế được cho nhau.`
                : 'Chưa tìm thấy từ liên quan trong danh sách. Bạn vẫn có thể ôn card này.';
            $('priorityRelatedWords').innerHTML = [
                `<section class="priority-relation"><p class="priority-relation-label">Từ đang chọn</p>${card(selected, true)}</section>`,
                ...related.map(
                    ({ word, reason }) =>
                        `<section class="priority-relation"><p class="priority-relation-label">${reason}</p>${card(word, true)}</section>`,
                ),
            ].join('');
            $('priorityRelatedWords')
                .querySelectorAll('.priority-definition')
                .forEach((el) => {
                    el.open = true;
                });
        } catch (error) {
            if (token === comparisonGeneration && dialog.open)
                $('priorityRelatedStatus').textContent =
                    'Không tải được từ liên quan. Đóng và mở lại card để thử lại. ' + error.message;
        }
    }
    $('priorityWords').addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-related]');
        if (!trigger && event.target.closest('button, summary, a, input, select, textarea')) return;
        const article = event.target.closest('[data-word]');
        if (article) open(article);
    });
    $('priorityWords').addEventListener('keydown', (event) => {
        if (event.target.matches('.priority-word') && ['Enter', ' '].includes(event.key)) {
            event.preventDefault();
            open(event.target);
        }
    });
}
function options() {
    return {
        query: $('prioritySearch').value,
        rounds: $('priorityRounds').value,
        letter: $('priorityLetter').value,
        level: $('priorityLevel').value,
    };
}
async function render() {
    const token = ++generation,
        filters = options(),
        filtered = filterPriorityWords(catalog, progress, filters),
        visible = filtered.slice(0, limit);
    $('priorityCount').textContent =
        `${filtered.length.toLocaleString('vi-VN')} từ · ${ready ? catalog.filter((word) => progress.get(word.id)?.completed_rounds === 5).length + ' từ đủ 5 lần' : 'Đang tải tiến độ…'}`;
    $('priorityWords').setAttribute('aria-busy', 'true');
    $('priorityMore').hidden = filtered.length <= limit;
    $('priorityLetters').innerHTML = [
        '',
        ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        ...(catalog.some((w) => w.letter === '#') ? ['#'] : []),
    ]
        .map(
            (letter) =>
                `<button type="button" data-letter="${letter}" aria-pressed="${filters.letter === letter}" ${letter && !catalog.some((w) => w.letter === letter) ? 'disabled' : ''}>${letter || 'Tất cả'}</button>`,
        )
        .join('');
    $('priorityLetters')
        .querySelectorAll('button')
        .forEach((button) =>
            button.addEventListener('click', () => {
                $('priorityLetter').value = button.dataset.letter;
                limit = pageSize;
                render();
            }),
        );
    try {
        await Promise.all([...new Set(visible.map((word) => word.letter))].map(letterContent));
        if (token !== generation) return;
        $('priorityWords').innerHTML = visible.length
            ? [...new Set(visible.map((word) => word.letter))]
                  .map(
                      (letter) =>
                          `<section class="priority-letter-group" aria-labelledby="priority-group-${letter}"><h2 id="priority-group-${letter}">${letter}</h2><div class="priority-word-grid">${visible
                              .filter((word) => word.letter === letter)
                              .map((word) => card(word))
                              .join('')}</div></section>`,
                  )
                  .join('')
            : '<p class="empty-state">Không có từ phù hợp. Thử đổi bộ lọc.</p>';
    } catch (error) {
        if (token === generation) {
            $('priorityMessage').textContent = 'Không tải được nội dung từ. ' + error.message;
            $('priorityReload').hidden = false;
        }
    } finally {
        if (token === generation) $('priorityWords').setAttribute('aria-busy', 'false');
    }
}
function customWord(row) {
    const initial = row.word.charAt(0).toUpperCase();
    const word = {
        id: row.id,
        term: row.word,
        pos: '',
        level: '',
        letter: /^[A-Z]$/.test(initial) ? initial : '#',
        custom: true,
    };
    contents.set(word.id, { senses: [{ meaning: row.mean }], examples: [{ en: row.example }] });
    return word;
}
function updateLetters() {
    const selected = $('priorityLetter').value;
    $('priorityLetter').innerHTML =
        '<option value="">Tất cả A–Z</option>' +
        [...new Set(catalog.map((word) => word.letter))]
            .sort()
            .map((letter) => `<option>${letter}</option>`)
            .join('');
    $('priorityLetter').value = selected;
}
async function load() {
    const result = await apiRequest('/api/vocabulary/priority');
    catalog = [...priorityCatalog, ...(result.words || []).map(customWord)].sort((a, b) =>
        a.term.localeCompare(b.term, 'en'),
    );
    updateLetters();
    const incoming = new Map(result.progress.map((entry) => [entry.word_id, entry]));
    // An overlapping save may be newer than the snapshot returned by this GET.
    for (const [id, entry] of progress) {
        if (entry.revision > (incoming.get(id)?.revision ?? -1)) incoming.set(id, entry);
    }
    progress = incoming;
    ready = true;
}
export async function initPriorityVocabulary() {
    initRelatedWords();
    $('priorityAttribution').innerHTML =
        '<a href="src/features/vocabulary/content/priority-attribution.txt" target="_blank" rel="noopener">Dữ liệu từ điển: Từ điển Anh–Việt thichhoc.com (thichhoc-dict), giấy phép CC BY-SA 4.0. Nguồn gốc: WordNet 3.1 (Princeton), CMUdict (CMU), Wiktionary. Đã chỉnh sửa dữ liệu. Xem ghi nguồn đầy đủ.</a>';
    updateLetters();
    $('priorityAddToggle').addEventListener('click', () => {
        const form = $('priorityAddForm');
        form.hidden = !form.hidden;
        $('priorityAddToggle').setAttribute('aria-expanded', String(!form.hidden));
        if (!form.hidden) $('priorityWord').focus();
    });
    $('priorityAddForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const submit = $('priorityAddSubmit');
        if (submit.disabled) return;
        submit.disabled = true;
        $('priorityAddMessage').textContent = 'Đang lưu…';
        try {
            const saved = await apiRequest('/api/vocabulary/priority', {
                method: 'POST',
                body: JSON.stringify({
                    word: $('priorityWord').value,
                    mean: $('priorityMean').value,
                    example: $('priorityExample').value,
                }),
            });
            const word = customWord(saved);
            catalog.push(word);
            catalog.sort((a, b) => a.term.localeCompare(b.term, 'en'));
            updateLetters();
            $('prioritySearch').value = word.term;
            for (const id of ['priorityRounds', 'priorityLetter', 'priorityLevel'])
                $(id).value = '';
            limit = pageSize;
            $('priorityAddForm').reset();
            $('priorityAddMessage').textContent = `Đã thêm “${word.term}”.`;
            await render();
            $('priorityWord').focus();
        } catch (error) {
            $('priorityAddMessage').textContent = 'Không thêm được từ. ' + error.message;
        } finally {
            submit.disabled = false;
        }
    });
    for (const id of ['prioritySearch', 'priorityRounds', 'priorityLetter', 'priorityLevel'])
        $(id).addEventListener(id === 'prioritySearch' ? 'input' : 'change', () => {
            limit = pageSize;
            render();
        });
    $('priorityMore').addEventListener('click', () => {
        limit += pageSize;
        render();
    });
    $('priorityWords').addEventListener('click', async (event) => {
        const button = event.target.closest('[data-round]');
        if (!button || button.disabled || !ready) return;
        const article = button.closest('[data-word]'),
            id = article.dataset.word;
        if (pending.has(id)) return;
        const old = progress.get(id),
            count = old?.completed_rounds || 0,
            round = Number(button.dataset.round);
        const target = round === count ? count - 1 : round;
        if (Math.abs(target - count) !== 1) return;
        pending.add(id);
        article.querySelectorAll('button').forEach((el) => (el.disabled = true));
        $('priorityMessage').textContent = '';
        try {
            const result = await apiRequest(`/api/vocabulary/priority/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    completed_rounds: target,
                    expected_revision: old?.revision || 0,
                }),
            });
            progress.set(id, result);
            $('priorityMessage').textContent =
                `${catalog.find((word) => word.id === id).term}: ${target > count ? 'đã ghi nhận' : 'đã bỏ tích'} lượt ${target > count ? target : count}.`;
            // Preserve the card and keyboard focus while it still matches the filter.
            pending.delete(id);
            if (
                filterPriorityWords(
                    catalog.filter((word) => word.id === id),
                    progress,
                    options(),
                ).length
            ) {
                const visibleArticle = $('priorityWords').querySelector(`[data-word="${id}"]`);
                if (visibleArticle) {
                    const detailsState = [...visibleArticle.querySelectorAll('details')].map(
                        (el) => el.open,
                    );
                    visibleArticle.outerHTML = card(catalog.find((word) => word.id === id));
                    $('priorityWords')
                        .querySelectorAll(`[data-word="${id}"] details`)
                        .forEach((el, index) => {
                            el.open = detailsState[index];
                        });
                    if (visibleArticle === article)
                        $('priorityWords')
                            .querySelector(`[data-word="${id}"] [data-round="${round}"]`)
                            ?.focus();
                }
                $('priorityCount').textContent =
                    `${filterPriorityWords(catalog, progress, options()).length.toLocaleString('vi-VN')} từ · ${catalog.filter((word) => progress.get(word.id)?.completed_rounds === 5).length} từ đủ 5 lần`;
            } else await render();
        } catch (error) {
            $('priorityMessage').textContent = error.message;
            if (error.status === 409) {
                try {
                    await load();
                } catch (loadError) {
                    ready = false;
                    $('priorityMessage').textContent += ' ' + loadError.message;
                    $('priorityReload').hidden = false;
                }
            }
            pending.delete(id);
            await render();
        }
    });
    $('priorityReload').addEventListener('click', async () => {
        $('priorityReload').disabled = true;
        $('priorityMessage').textContent = '';
        try {
            await load();
            $('priorityReload').hidden = true;
            await render();
        } catch (error) {
            $('priorityMessage').textContent = 'Không tải được tiến độ. ' + error.message;
        } finally {
            $('priorityReload').disabled = false;
        }
    });
    const results = await Promise.allSettled([render(), load()]);
    if (results[1].status === 'rejected') {
        $('priorityMessage').textContent = 'Không tải được tiến độ. ' + results[1].reason.message;
        $('priorityReload').hidden = false;
    }
    await render();
}
