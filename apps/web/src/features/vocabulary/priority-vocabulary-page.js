import { apiRequest } from '../../core/database-client.js';
import { escapeHtml as h } from '../../shared/escape-html.js';
import { priorityCatalog } from './content/priority-catalog.js';
import { filterPriorityWords } from '../../domain/priority-vocabulary.js';

const $ = (id) => document.getElementById(id),
    pageSize = 36;
let progress = new Map(),
    ready = false,
    pending = new Set(),
    limit = pageSize,
    generation = 0;
const contents = new Map(),
    requests = new Map();
function letterContent(letter) {
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
function card(word) {
    const entry = progress.get(word.id),
        count = entry?.completed_rounds || 0,
        content = contents.get(word.id);
    return `<article class="priority-word ${count === 5 ? 'is-mastered' : ''}" data-word="${word.id}" aria-labelledby="heading-${word.id}">
        <header><div><h3 id="heading-${word.id}" lang="en">${h(word.term)}</h3><small>${h(word.pos)} · ${h(word.level)}${word.qualifier ? ` · ${h(word.qualifier)}` : ''}</small></div>${count === 5 ? '<span class="priority-mastered" aria-label="Đã học đủ 5 lần">✓</span>' : ''}</header>
        ${content?.pronunciation ? `<p class="priority-pronunciation" lang="en">/${h(content.pronunciation)}/</p>` : ''}
        <ol class="priority-meanings">${(content?.senses || []).map((sense) => `<li>${sense.pos ? `<small>${h(sense.pos)}</small> ` : ''}${h(sense.meaning)}</li>`).join('')}</ol>
        <details class="priority-examples" open><summary>Ví dụ thực tế</summary>${(content?.examples || []).map((example) => `<figure><blockquote lang="en">${h(example.en)}</blockquote>${example.vi ? `<figcaption>${h(example.vi)}</figcaption>` : ''}</figure>`).join('')}</details>
        <div class="priority-checks" role="group" aria-label="5 lần học ${h(word.term)}">${Array.from(
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
        ).join('')}</div></article>`;
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
        filtered = filterPriorityWords(priorityCatalog, progress, filters),
        visible = filtered.slice(0, limit);
    $('priorityCount').textContent =
        `${filtered.length.toLocaleString('vi-VN')} từ · ${ready ? priorityCatalog.filter((word) => progress.get(word.id)?.completed_rounds === 5).length + ' từ đủ 5 lần' : 'Đang tải tiến độ…'}`;
    $('priorityWords').setAttribute('aria-busy', 'true');
    $('priorityMore').hidden = filtered.length <= limit;
    $('priorityLetters').innerHTML = ['', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
        .map(
            (letter) =>
                `<button type="button" data-letter="${letter}" aria-pressed="${filters.letter === letter}" ${letter && !priorityCatalog.some((w) => w.letter === letter) ? 'disabled' : ''}>${letter || 'Tất cả'}</button>`,
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
                              .map(card)
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
async function load() {
    const result = await apiRequest('/api/vocabulary/priority');
    const incoming = new Map(result.progress.map((entry) => [entry.word_id, entry]));
    // An overlapping save may be newer than the snapshot returned by this GET.
    for (const [id, entry] of progress) {
        if (entry.revision > (incoming.get(id)?.revision ?? -1)) incoming.set(id, entry);
    }
    progress = incoming;
    ready = true;
}
export async function initPriorityVocabulary() {
    $('priorityAttribution').innerHTML =
        '<a href="src/features/vocabulary/content/priority-attribution.txt" target="_blank" rel="noopener">Dữ liệu từ điển: Từ điển Anh–Việt thichhoc.com (thichhoc-dict), giấy phép CC BY-SA 4.0. Nguồn gốc: WordNet 3.1 (Princeton), CMUdict (CMU), Wiktionary. Đã chỉnh sửa dữ liệu. Xem ghi nguồn đầy đủ.</a>';
    $('priorityLetter').innerHTML =
        '<option value="">Tất cả A–Z</option>' +
        [...new Set(priorityCatalog.map((word) => word.letter))]
            .map((letter) => `<option>${letter}</option>`)
            .join('');
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
                `${priorityCatalog.find((word) => word.id === id).term}: ${target > count ? 'đã ghi nhận' : 'đã bỏ tích'} lượt ${target > count ? target : count}.`;
            // Preserve the card and keyboard focus while it still matches the filter.
            pending.delete(id);
            if (
                filterPriorityWords(
                    priorityCatalog.filter((word) => word.id === id),
                    progress,
                    options(),
                ).length
            ) {
                const visibleArticle = $('priorityWords').querySelector(`[data-word="${id}"]`);
                if (visibleArticle) {
                    const wasOpen = visibleArticle.querySelector('details').open;
                    visibleArticle.outerHTML = card(priorityCatalog.find((word) => word.id === id));
                    $('priorityWords').querySelector(`[data-word="${id}"] details`).open = wasOpen;
                    if (visibleArticle === article)
                        $('priorityWords')
                            .querySelector(`[data-word="${id}"] [data-round="${round}"]`)
                            ?.focus();
                }
                $('priorityCount').textContent =
                    `${filterPriorityWords(priorityCatalog, progress, options()).length.toLocaleString('vi-VN')} từ · ${priorityCatalog.filter((word) => progress.get(word.id)?.completed_rounds === 5).length} từ đủ 5 lần`;
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
