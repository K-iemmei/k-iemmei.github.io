(function () {
    window.ENG = window.ENG || {};
    // entrypoint (renamed from english-init.js)
    document.addEventListener('DOMContentLoaded', () => {
        const select = document.getElementById('testSelect');
        if (select) {
            select.addEventListener('change', async (event) => {
                window.ENG.state.currentIndex = Number(event.target.value || 0);
                const selectedTest = window.ENG.state.tests[window.ENG.state.currentIndex];
                const url = new URL(window.location.href);
                if (selectedTest && selectedTest.slug) {
                    url.searchParams.set('test', selectedTest.slug);
                } else {
                    url.searchParams.delete('test');
                }
                window.history.replaceState({}, '', url);
                await window.ENG.loader.loadCurrentTest();
            });
        }

        const loadButton = document.getElementById('loadTestButton');
        if (loadButton) {
            loadButton.addEventListener('click', window.ENG.loader.loadCurrentTest);
        }

        const submitButton = document.getElementById('submitAnswers');
        if (submitButton) {
            submitButton.addEventListener('click', window.ENG.submit.submitCurrentTest);
        }

        const checkScoreButton = document.getElementById('checkScoreButton');
        if (checkScoreButton) {
            checkScoreButton.addEventListener('click', window.ENG.submit.submitCurrentTest);
        }

        const answerReview = document.getElementById('answerReview');
        if (answerReview) {
            answerReview.addEventListener('click', (event) => {
                const evidenceButton = event.target.closest('.evidence-button');
                if (evidenceButton) {
                    window.ENG.renderer.showEvidence(evidenceButton.dataset.evidence);
                }
            });
        }

        const attemptHistory = document.getElementById('attemptHistory');
        if (attemptHistory) {
            attemptHistory.addEventListener('click', (event) => {
                const button = event.target.closest('.history-review-button');
                if (!button) return;
                const attempt = window.ENG.state.attempts.find((item) => item.id === button.dataset.attemptId);
                if (!attempt) return;
                window.ENG.renderer.renderAnswerReview(attempt.review || []);
                document.getElementById('answerReviewDialog')?.showModal();
            });
        }

        // initial load
        window.ENG.loader.loadTestList();
    });
})();