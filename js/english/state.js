(function () {
    window.ENG = window.ENG || {};
    window.ENG.state = {
        tests: [],
        currentIndex: 0,
        currentGroups: [],
        currentQuestions: [],
        currentAnswerKey: null,
        attempts: [],
    };

    window.ENG.fallbackPassage = `Artificial intelligence is increasingly shaping the workplace, but its effect on employment is still a matter of debate. Some analysts argue that AI will replace many routine tasks, particularly in administration, data processing and basic customer service. These roles often involve repetitive work that can be automated with software. As a result, workers in these fields may need to retrain or focus on more complex responsibilities that require judgment, empathy and creativity.`;
})();