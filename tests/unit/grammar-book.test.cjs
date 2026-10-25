const test = require('node:test'),
    assert = require('node:assert/strict'),
    fs = require('fs');
test('book roadmap contains 145 ordered verified units, separate ready content, and complete original practice', async () => {
    const { book } = await import('../../apps/web/src/features/grammar/content/book-curriculum.js');
    const { bookLessons } =
        await import('../../apps/web/src/features/grammar/content/book-lessons.js');
    const { gradeGrammar, normaliseGrammarAnswer, grammarRequest } =
        await import('../../apps/web/src/domain/grammar.js');
    assert.deepEqual(
        book,
        JSON.parse(
            fs.readFileSync('apps/web/src/features/grammar/content/book-curriculum.json', 'utf8'),
        ),
    );
    assert.equal(book.units.length, 145);
    assert.equal(Object.keys(bookLessons).length, 145);
    assert.equal(book.verification.unitTheoryPagesVerified, 145);
    assert.equal(book.units[0].title, 'Present continuous (I am doing)');
    assert.match(book.units[144].title, /away\/back/);
    for (const [i, u] of book.units.entries()) {
        assert.equal(u.unitNumber, i + 1);
        assert.equal(u.sourceReference.pdfPage, u.unitNumber * 2 + 12);
        assert(u.section);
        assert.equal(u.status === 'ready', !!bookLessons[u.unitNumber]);
    }
    for (const lesson of Object.values(bookLessons)) {
        assert.equal(lesson.questions.length, 19);
        assert.equal(lesson.examples.length, 6);
        assert.equal(lesson.scenarios.length, 3);
        assert.equal(new Set(lesson.questions.map((q) => q.id)).size, 19);
        for (const mode of ['quick', 'deep', 'assessment']) {
            const answers = Object.fromEntries(
                lesson.questions.filter((q) => q.mode === mode).map((q) => [q.id, q.answers[0]]),
            );
            assert(gradeGrammar(lesson, mode, answers).every((r) => r.correct));
        }
        for (const q of lesson.questions) {
            assert(q.prompt && q.explanation && q.hint);
            assert(!/[{}]|\[[^\]]+~/.test(q.prompt + q.answers.join(' ')), q.id);
            assert(q.answers.every((a) => typeof a === 'string' && a.trim()));
            if (q.type === 'choice') {
                assert.equal(new Set(q.options).size, q.options.length);
                assert(q.answers.every((a) => q.options.includes(a)));
            }
        }
    }
    assert.equal(
        normaliseGrammarAnswer("She isn't working!"),
        normaliseGrammarAnswer('She is not working.'),
    );
    const possessive = bookLessons[81].questions[0];
    assert.equal(possessive.answers[0], "Linh's");
    const punctuation = bookLessons[95].questions.find((q) => q.type === 'error');
    assert(
        gradeGrammar(bookLessons[95], 'review', { [punctuation.id]: punctuation.answers[0] })[0]
            .correct,
    );
    assert(
        !gradeGrammar(bookLessons[95], 'review', {
            [punctuation.id]: punctuation.answers[0].replaceAll(',', ''),
        })[0].correct,
    );
    assert.throws(
        () => grammarRequest('/api/grammar/giu-146/attempts', 'POST', {}),
        /no interactive/,
    );
    assert.throws(
        () =>
            grammarRequest('/api/grammar/giu-001/attempts', 'POST', {
                mode: 'assessment',
                answers: {},
                request_id: '12345678-1234-4234-8234-123456789abc',
            }),
        /every question/,
    );
});
