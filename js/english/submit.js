(function () {
    window.ENG = window.ENG || {};
    const utils = window.ENG.utils;
    const renderer = window.ENG.renderer;
    const state = window.ENG.state;
    const loader = window.ENG.loader;

    const submit = {
        async submitCurrentTest() {
            const total = state.currentQuestions.length || 0;
            if (!total) {
                renderer.updateScoreSummary('No question set is loaded yet.', 'error');
                return;
            }

            const keyQuestions = state.currentAnswerKey?.questions || {};
            const results = state.currentQuestions.map((question) => {
                const key = keyQuestions[question.number];
                const response = loader.getQuestionResponse(question.number);
                const acceptedAnswers = key ? (Array.isArray(key.answer) ? key.answer : (typeof key.answer === 'string' ? [key.answer] : [])) : [];
                const correct = Boolean(key && response && acceptedAnswers.some((answer) => utils.normalizeAnswer(response) === utils.normalizeAnswer(answer)));
                return { ...question, response, key, correct, graded: Boolean(key) };
            });

            const graded = results.filter((result) => result.graded);
            const correct = results.filter((result) => result.graded && result.correct).length;
            const score = graded.length ? Math.round((correct / graded.length) * 100) : null;
            const test = state.tests[state.currentIndex];
            const summary = score === null
                ? 'Attempt completed, but this test has no answer key and could not be graded.'
                : `Score: ${correct}/${graded.length} (${score}%).${total > graded.length ? ` ${total - graded.length} question${total - graded.length === 1 ? '' : 's'} not graded because the answer key is incomplete.` : ''}`;

            if (score === null) {
                renderer.updateScoreChip('—', total);
            } else {
                renderer.updateScoreChip(correct, graded.length);
            }

            const userId = localStorage.getItem('userId');
            if (!userId || !window.supabase) {
                renderer.updateScoreSummary(`${summary} Sign in to save this attempt to your history.`, 'info');
                return;
            }

            const review = results.map((result) => ({
                question_id: result.id,
                question_number: result.number,
                prompt: result.prompt,
                response: result.response,
                is_graded: result.graded,
                is_correct: result.correct,
                correct_answer: result.key?.answer ?? null,
                explanation: result.key?.explanation || '',
                evidence: result.key?.evidence || '',
            }));

            try {
                await window.supabase.create('english_reading_attempts', {
                    user_id: userId,
                    test_slug: test?.slug || '',
                    test_title: test?.title || 'IELTS Reading',
                    correct_count: correct,
                    graded_count: graded.length,
                    total_count: total,
                    score_percent: score,
                    review,
                });
                renderer.updateScoreSummary(`${summary} Saved to practice history.`, score === null ? 'info' : (score >= 60 ? 'success' : 'info'));
                await loader.loadAttemptHistory();
            } catch (error) {
                console.error('Unable to save reading attempt:', error);
                renderer.updateScoreSummary(`${summary} Could not save this attempt to the database.`, 'error');
            }
        }
    };

    window.ENG.submit = submit;
})();