import { utils } from './reading-formatters.js';
import { state } from './reading-state.js';
import { renderCompletion } from './reading-completion.js';
import { deployment } from '../../../core/deployment-config.js';
const h = utils.escapeHtml;
function sourceUrl(image, slug) {
    if (deployment.mode === 'supabase') {
        const prefix = `${deployment.url}/storage/v1/object/sign/reading-assets/`;
        return typeof image.url === 'string' && image.url.startsWith(prefix) ? image.url : '';
    }
    return `/api/tests/${encodeURIComponent(slug)}/source-pages/${encodeURIComponent(image.file)}`;
}
export const renderer = {
    renderInputMarkup(question, inline = false) {
        const type = state.types.find((type) => type.id === question.question_type);
        const options =
            type?.choices?.map((value) => ({ id: value, text: value })) || question.options;
        const attrs = `class="answer-input${inline ? ' inline-input' : ''}" data-question-id="${h(question.id)}" data-question-number="${question.number}" aria-label="Answer for question ${question.number}"`;
        if (!inline && (type?.kind === 'radio' || type?.kind === 'checkbox' || type?.choices))
            return `<div class="practice-options ${type.choices ? 'judgement-options' : ''}">${options.map((option) => `<label><input type="${type.kind === 'checkbox' ? 'checkbox' : 'radio'}" name="q-${h(question.id)}" ${attrs} value="${h(option.id)}"/><span>${type.choices ? '' : `<b>${h(option.id)}</b> `}${h(option.text)}</span></label>`).join('')}</div>`;
        if (type?.kind === 'select')
            return `<select ${attrs}><option value="">${inline ? 'Choose' : 'Choose an answer'}</option>${options.map((option) => `<option value="${h(option.id)}">${h(inline ? option.id : option.id + ' - ' + option.text)}</option>`).join('')}</select>`;
        return `<input type="text" ${attrs} autocomplete="off" spellcheck="false" placeholder="${inline ? 'Answer' : 'Your answer'}"/>`;
    },
    renderQuestion(question) {
        const type = state.types.find((t) => t.id === question.question_type);
        if (type?.kind === 'text') {
            const completion = renderCompletion(question.prompt, [question], (q) =>
                renderer.renderInputMarkup(q, true),
            );
            if (completion.used.size)
                return `<p class="sentence-completion">${completion.html}</p>`;
        }
        return `<fieldset class="question-row" data-question-id="${h(question.id)}"><legend><span class="question-number">${question.number}</span> ${h(question.metadata.label || '')} ${h(question.prompt)}</legend><div class="answer-row">${renderer.renderInputMarkup(question)}</div></fieldset>`;
    },
    renderQuestionList(groups) {
        document.getElementById('questionList').innerHTML =
            groups
                .map((group) => {
                    const completion = group.metadata.summary
                        ? renderCompletion(group.metadata.summary, group.questions, (q) =>
                              renderer.renderInputMarkup(q, true),
                          )
                        : null;
                    const remaining = group.questions.filter((q) => !completion?.used.has(q.id));
                    const range = group.questions.length
                        ? `${group.questions[0].number}&ndash;${group.questions.at(-1).number}`
                        : '';
                    const title =
                        group.title ||
                        state.types.find((t) => t.id === group.group_type)?.label ||
                        'Questions';
                    return `<section class="question-group" data-type="${h(group.group_type)}"><div class="group-heading"><h3>${h(title)}</h3><span class="group-range">${range}</span></div><p class="group-instructions">${h(group.instructions)}</p>
            ${group.options.length ? `<ul class="heading-options">${group.options.map((option) => `<li><b>${h(option.id)}</b> ${h(option.text)}</li>`).join('')}</ul>` : ''}
            ${group.metadata.paragraphs ? `<div class="group-text">${h(group.metadata.paragraphs)}</div>` : ''}
            ${(group.metadata.figures || [])
                .map((figure) => {
                    const slug = state.tests[state.currentIndex]?.slug;
                    const url = sourceUrl(figure, slug);
                    return url
                        ? `<figure class="reading-question-figure"><a href="${h(url)}" target="_blank" rel="noopener" aria-label="Enlarge ${h(figure.label)}"><img src="${h(url)}" alt="${h(figure.label)}" loading="lazy" /></a><figcaption>${h(figure.label)}</figcaption></figure>`
                        : `<p class="source-page-hint">Figure ${h(figure.label)} is not uploaded to Reading storage yet.</p>`;
                })
                .join('')}
            ${completion ? `<div class="completion-text">${completion.html}</div>` : ''}
            ${remaining.map((question) => renderer.renderQuestion(question)).join('')}</section>`;
                })
                .join('') || '<p class="empty-reading">No questions available.</p>';
        const questions = groups.flatMap((group) => group.questions);
        document.getElementById('questionCount').textContent = `${questions.length} questions`;
        const navigation = document.getElementById('questionNavigation');
        if (navigation)
            navigation.innerHTML = questions
                .map(
                    (q) =>
                        `<button type="button" class="question-nav-button" data-jump-id="${h(q.id)}" aria-label="Go to question ${q.number}">${q.number}</button>`,
                )
                .join('');
        document.dispatchEvent(new CustomEvent('reading:rendered'));
    },
    renderPassage(title, passages, description = '') {
        document.getElementById('readingTitle').textContent =
            passages.length === 1 ? passages[0].title : title;
        const descriptionHost = document.getElementById('readingDescription');
        if (descriptionHost) descriptionHost.textContent = description;
        document.getElementById('readingPassage').innerHTML = passages
            .map((p) => {
                const pages = p.groups?.flatMap((g) => g.metadata.source_pages || []) || [];
                const slug = state.tests[state.currentIndex]?.slug;
                const content = pages.length
                    ? `<p class="source-page-hint">Original passage and questions. Click a page to enlarge it; enter answers in the right pane.</p>${pages
                          .map((page) => {
                              const url = sourceUrl(page, slug);
                              return url
                                  ? `<figure class="reading-source-page"><figcaption>${h(page.label)}</figcaption><a href="${h(url)}" target="_blank" rel="noopener" aria-label="Enlarge ${h(page.label)}"><img src="${h(url)}" alt="${h(page.label)}" loading="lazy" /></a></figure>`
                                  : `<p class="source-page-hint">Source page ${h(page.label)} is not uploaded to Reading storage yet.</p>`;
                          })
                          .join('')}`
                    : `<div class="passage-text">${p.content_html || h(p.content).replace(/\\n/g, '<br>')}</div>`;
                return `<section>${passages.length > 1 ? `<h3>${h(p.title || 'Passage ' + p.passage_order)}</h3>` : ''}${content}</section>`;
            })
            .join('');
    },
    updateScoreSummary(message, type = 'info') {
        const host = document.getElementById('scoreSummary');
        host.className = `english-submit-message ${type}`;
        host.textContent = message;
    },
    updateScoreChip(correct, total) {
        document.getElementById('scoreChip').hidden = false;
        document.getElementById('scoreChip').textContent = total
            ? `${correct}/${total}`
            : 'Ungraded';
    },
    renderAnswerReview(results) {
        const host = document.getElementById('answerReview');
        if (!host) return;
        host.innerHTML = results.length
            ? `
            ${results
                .map(
                    (result) => `
                <article class="answer-review-item ${result.is_graded ? (result.is_correct ? 'is-correct' : 'is-incorrect') : 'is-ungraded'}">
                    <strong>Q${result.question_number}: ${result.is_graded ? (result.is_correct ? 'Correct' : 'Incorrect') : 'Not graded'}</strong>
                    <p>${utils.escapeHtml(result.prompt || '')}</p>
                    <p>Your answer: ${utils.escapeHtml(result.response || 'No answer')}</p>
                    ${
                        result.is_graded && result.correct_answer
                            ? `<p>Correct answer: ${utils.escapeHtml((Array.isArray(result.correct_answer) ? result.correct_answer : [result.correct_answer]).join(' / '))}</p>
                        <p>${utils.escapeHtml(result.explanation || '')}</p>
                        ${result.evidence ? `<button type="button" class="evidence-button" data-evidence="${utils.escapeHtml(result.evidence)}">Show evidence</button>` : ''}`
                            : '<p>Answer key not available for this question.</p>'
                    }
                </article>
            `,
                )
                .join('')}
        `
            : '';
    },

    showEvidence(text) {
        const passage = document.getElementById('readingPassage');
        if (!passage || !text) return;
        passage
            .querySelectorAll('mark.evidence-highlight')
            .forEach((mark) => mark.replaceWith(document.createTextNode(mark.textContent)));
        passage.normalize();
        const walker = document.createTreeWalker(passage, NodeFilter.SHOW_TEXT);
        const target = text.toLowerCase();
        let node;
        while ((node = walker.nextNode())) {
            const start = node.textContent.toLowerCase().indexOf(target);
            if (start < 0) continue;
            const range = document.createRange();
            range.setStart(node, start);
            range.setEnd(node, start + text.length);
            const mark = document.createElement('mark');
            mark.className = 'evidence-highlight';
            range.surroundContents(mark);
            mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
        }
    },
};
