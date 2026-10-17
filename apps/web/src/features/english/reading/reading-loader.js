import { adaptReadingTest } from './reading-adapter.js';
import { utils } from './reading-formatters.js';
import { renderer } from './reading-renderer.js';
import { state } from './reading-state.js';
import {
    attempts,
    listReadingTests,
    getReadingTest,
    getQuestionTypes,
} from './reading-repository.js';

export const loader = {
    getQuestionResponse(questionId) {
        const controls = Array.from(
            document.querySelectorAll(`.answer-input[data-question-id="${questionId}"]`),
        );
        if (!controls.length) return '';

        if (controls[0].type === 'checkbox')
            return controls.filter((control) => control.checked).map((control) => control.value);
        const checked = controls.find((control) => control.type === 'radio' && control.checked);
        if (checked) return checked.value;

        const select = controls.find((control) => control.tagName === 'SELECT');
        if (select) return select.value;

        const input = controls.find(
            (control) => control.tagName === 'INPUT' && control.type !== 'radio',
        );
        return input ? input.value.trim() : '';
    },

    async loadTestList() {
        const select = document.getElementById('testSelect');
        if (!select) return;

        try {
            [state.tests, state.types] = await Promise.all([
                listReadingTests(),
                getQuestionTypes(),
            ]);
        } catch (error) {
            console.warn('Unable to load reading tests:', error);
            state.tests = [];
            renderer.updateScoreSummary(
                'Cannot load tests. Check the local API and database.',
                'error',
            );
        }

        const requestedTest = new URLSearchParams(window.location.search).get('test');
        if (requestedTest && !state.tests.some((test) => test.slug === requestedTest)) {
            try {
                state.tests.push(await getReadingTest(requestedTest));
            } catch (error) {
                renderer.updateScoreSummary('Requested reading test is not available.', 'error');
                return;
            }
        }
        select.innerHTML = state.tests
            .map(
                (test, index) =>
                    `<option value="${index}">${utils.escapeHtml(test.title)}</option>`,
            )
            .join('');

        const requestedIndex = requestedTest
            ? state.tests.findIndex(
                  (test) =>
                      test.slug === requestedTest ||
                      test.file === requestedTest ||
                      test.title === requestedTest,
              )
            : -1;

        state.currentIndex = requestedIndex >= 0 ? requestedIndex : 0;
        select.value = String(state.currentIndex);
        await loader.loadCurrentTest();
    },

    async loadCurrentTest() {
        const test = state.tests[state.currentIndex] || state.tests[0];
        const editLink = document.getElementById('editReadingLink');
        if (editLink)
            editLink.href = test?.slug
                ? `admin.html?test=${encodeURIComponent(test.slug)}`
                : 'admin.html';
        const titleHost = document.getElementById('examTitle');
        if (titleHost) {
            titleHost.textContent = test ? test.title : 'IELTS Reading Practice';
        }

        if (!test) {
            state.currentQuestions = [];
            state.attempts = [];
            state.version = null;
            renderer.renderPassage('No reading tests yet', []);
            renderer.renderQuestionList([]);
            renderer.updateScoreSummary('Create your first test in Reading authoring.', 'info');
            document.getElementById('attemptHistory').innerHTML = '<li>No attempts yet.</li>';
            return;
        }

        const requestedSlug = test.slug;
        // Clear stale answers while changing tests; ignore requests that finish out of order.
        state.currentQuestions = [];
        state.version = null;
        renderer.renderQuestionList([]);
        try {
            const content = adaptReadingTest(await getReadingTest(requestedSlug));
            if (state.tests[state.currentIndex]?.slug !== requestedSlug) return;
            state.currentGroups = content.groups;
            state.currentQuestions = content.groups.flatMap((group) => group.questions);
            state.version = content.version;
            renderer.renderPassage(content.title, content.passages, content.description);
            renderer.renderQuestionList(content.groups);

            renderer.updateScoreSummary(
                content.ungradedCount
                    ? `Draft: ${content.ungradedCount} questions have no verified answer key. Responses can be saved but those questions will not be graded.`
                    : '',
                'info',
            );
            await loader.loadAttemptHistory();
        } catch (error) {
            renderer.updateScoreSummary('Unable to load this test from the database.', 'error');
            console.error(error);
        }
    },

    async loadAttemptHistory() {
        const host = document.getElementById('attemptHistory');
        if (!host) return;
        const test = state.tests[state.currentIndex];
        const userId = localStorage.getItem('userId');
        if (!userId) {
            state.attempts = [];
            host.innerHTML = '<li>Sign in to save and view practice history.</li>';
            return;
        }

        try {
            state.attempts = await attempts.list(userId, test?.slug || '');
            host.innerHTML = state.attempts.length
                ? state.attempts
                      .map((attempt) => {
                          const date = new Date(attempt.completed_at).toLocaleString();
                          const score =
                              attempt.score_percent === null
                                  ? 'Ungraded'
                                  : `${attempt.correct_count}/${attempt.graded_count} (${attempt.score_percent}%)`;
                          return `<li>
                        <span><time datetime="${utils.escapeHtml(attempt.completed_at)}">${utils.escapeHtml(date)}</time><strong>${utils.escapeHtml(score)}</strong></span>
                        <button type="button" class="history-review-button" data-attempt-id="${utils.escapeHtml(attempt.id)}">Review answers</button>
                    </li>`;
                      })
                      .join('')
                : '<li>No attempts yet.</li>';
        } catch (error) {
            console.error('Unable to load reading attempt history:', error);
            state.attempts = [];
            host.innerHTML = '<li>Could not load practice history.</li>';
        }
    },
};
