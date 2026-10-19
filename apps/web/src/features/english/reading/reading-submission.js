import { renderer } from './reading-renderer.js';
import { state } from './reading-state.js';
import { loader } from './reading-loader.js';
import { attempts } from './reading-repository.js';
import { notifyTrackingUpdate } from '../tracking-updates.js';
let submitting = false;
export const submit = {
    async submitCurrentTest() {
        if (submitting || !state.currentQuestions.length || !state.version) return;
        const test = state.tests[state.currentIndex];
        const responses = Object.fromEntries(
            state.currentQuestions.map((question) => [
                question.id,
                loader.getQuestionResponse(question.id),
            ]),
        );
        submitting = true;
        const buttons = ['submitAnswers', 'checkScoreButton', 'loadTestButton', 'testSelect'].map(
            (id) => document.getElementById(id),
        );
        buttons.forEach((button) => {
            if (button) button.disabled = true;
        });
        try {
            const result = await attempts.save(test.slug, state.version, responses);
            notifyTrackingUpdate();
            renderer.updateScoreChip(result.correct_count, result.graded_count);
            renderer.updateScoreSummary(
                result.graded_count
                    ? `Score: ${result.correct_count}/${result.graded_count} (${Number(result.score_percent)}%). ${result.total_count - result.graded_count} ungraded. Saved to practice history.`
                    : 'Responses saved. Ungraded: this test has no verified answer key.',
                'success',
            );
            await loader.loadAttemptHistory();
            document.getElementById('reviewLatestButton').hidden = !state.attempts.length;
        } catch (error) {
            renderer.updateScoreSummary(error.message, 'error');
        } finally {
            submitting = false;
            buttons.forEach((button) => {
                if (button) button.disabled = false;
            });
        }
    },
};
