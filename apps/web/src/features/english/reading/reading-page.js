import { state } from './reading-state.js';
import { loader } from './reading-loader.js';
import { renderer } from './reading-renderer.js';
import { submit } from './reading-submission.js';

import { initReadingWorkspace } from './reading-workspace.js';
export function initReading() {
    initReadingWorkspace();
    const select = document.getElementById('testSelect');
    if (select) {
        select.addEventListener('change', async (event) => {
            state.currentIndex = Number(event.target.value || 0);
            const selectedTest = state.tests[state.currentIndex];
            const url = new URL(window.location.href);
            if (selectedTest && selectedTest.slug) {
                url.searchParams.set('test', selectedTest.slug);
            } else {
                url.searchParams.delete('test');
            }
            window.history.replaceState({}, '', url);
            await loader.loadCurrentTest();
        });
    }

    const loadButton = document.getElementById('loadTestButton');
    if (loadButton) {
        loadButton.addEventListener('click', loader.loadCurrentTest);
    }

    const submitButton = document.getElementById('submitAnswers');
    if (submitButton) {
        submitButton.addEventListener('click', submit.submitCurrentTest);
    }

    const checkScoreButton = document.getElementById('checkScoreButton');
    if (checkScoreButton) {
        checkScoreButton.addEventListener('click', submit.submitCurrentTest);
    }

    const answerReview = document.getElementById('answerReview');
    if (answerReview) {
        answerReview.addEventListener('click', (event) => {
            const evidenceButton = event.target.closest('.evidence-button');
            if (evidenceButton) {
                renderer.showEvidence(evidenceButton.dataset.evidence);
            }
        });
    }

    const attemptHistory = document.getElementById('attemptHistory');
    if (attemptHistory) {
        attemptHistory.addEventListener('click', (event) => {
            const button = event.target.closest('.history-review-button');
            if (!button) return;
            const attempt = state.attempts.find((item) => item.id === button.dataset.attemptId);
            if (!attempt) return;
            document.getElementById('historyDialog')?.close();
            renderer.renderAnswerReview(attempt.review || []);
            document.getElementById('answerReviewDialog')?.showModal();
        });
    }

    // initial load
    loader.loadTestList();
}
