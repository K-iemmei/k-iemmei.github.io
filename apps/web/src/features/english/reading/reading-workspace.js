import { state } from './reading-state.js';
import { loader } from './reading-loader.js';
import { renderer } from './reading-renderer.js';

export function initReadingWorkspace() {
    const resizer = document.getElementById('paneResizer');
    const columns = document.querySelector('.reading-columns');
    if (resizer && columns) {
        let dragging = false;
        resizer.addEventListener('pointerdown', (event) => {
            dragging = true;
            resizer.setPointerCapture(event.pointerId);
            document.body.classList.add('is-resizing-panes');
        });
        resizer.addEventListener('pointermove', (event) => {
            if (!dragging) return;
            const rect = columns.getBoundingClientRect();
            const ratio = Math.max(0.32, Math.min(0.68, (event.clientX - rect.left) / rect.width));
            columns.style.gridTemplateColumns = ratio * 100 + '% 8px ' + (1 - ratio) * 100 + '%';
        });
        resizer.addEventListener('pointerup', () => {
            dragging = false;
            document.body.classList.remove('is-resizing-panes');
        });
    }
    const setPanel = (panel) => {
        document.body.dataset.mobilePanel = panel;
        document
            .querySelectorAll('[data-panel]')
            .forEach((button) =>
                button.setAttribute('aria-pressed', String(button.dataset.panel === panel)),
            );
    };
    document
        .querySelectorAll('[data-panel]')
        .forEach((button) =>
            button.addEventListener('click', () => setPanel(button.dataset.panel)),
        );
    const updateProgress = () => {
        let answered = 0;
        state.currentQuestions.forEach((question) => {
            const response = loader.getQuestionResponse(question.id);
            const complete = Array.isArray(response) ? response.length > 0 : Boolean(response);
            if (complete) answered++;
            document
                .querySelectorAll(
                    `[data-jump-id="${question.id}"], .question-row[data-question-id="${question.id}"]`,
                )
                .forEach((element) => element.classList.toggle('is-answered', complete));
        });
        document.getElementById('answeredCount').textContent =
            `${answered} / ${state.currentQuestions.length} answered`;
    };
    document.addEventListener('reading:rendered', () => {
        updateProgress();
        document.getElementById('passagePane').scrollTop = 0;
        document.getElementById('questionsPane').scrollTop = 0;
        document.getElementById('scoreChip').hidden = true;
        document.getElementById('reviewLatestButton').hidden = true;
    });
    const questionList = document.getElementById('questionList');
    for (const event of ['input', 'change']) questionList.addEventListener(event, updateProgress);
    questionList.addEventListener('focusin', (event) => {
        const id = event.target.dataset.questionId;
        if (!id) return;
        document
            .querySelectorAll('.question-nav-button')
            .forEach((button) =>
                button.setAttribute('aria-current', String(button.dataset.jumpId === id)),
            );
    });
    document.addEventListener('click', (event) => {
        const button = event.target.closest('[data-jump-id]');
        if (!button) return;
        setPanel('questions');
        const control = document.querySelector(
            `.answer-input[data-question-id="${button.dataset.jumpId}"]`,
        );
        control?.focus({ preventScroll: true });
        control?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
    let fontSize = 18;
    for (const [id, delta] of [
        ['decreaseReadingFont', -1],
        ['increaseReadingFont', 1],
    ]) {
        document.getElementById(id).addEventListener('click', () => {
            fontSize = Math.max(14, Math.min(24, fontSize + delta));
            document.body.style.setProperty('--reading-font-size', `${fontSize}px`);
        });
    }
    document
        .getElementById('practiceHistoryButton')
        .addEventListener('click', () => document.getElementById('historyDialog').showModal());
    document.getElementById('reviewLatestButton').addEventListener('click', () => {
        if (!state.attempts[0]) return;
        renderer.renderAnswerReview(state.attempts[0].review || []);
        document.getElementById('answerReviewDialog').showModal();
    });
}
