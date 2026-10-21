const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cheerio = require('cheerio');

test('dashboard serves current subject cards before JavaScript runs', async () => {
    const { subjects } = await import('../../apps/web/src/features/catalog/subject-catalog.js');
    const html = fs.readFileSync(
        path.resolve(__dirname, '../../apps/web/pages/dashboard/study-dashboard.html'),
        'utf8',
    );
    const $ = cheerio.load(html);
    const cards = $('.subject-grid > .subject-card');
    assert.equal(cards.length, subjects.length);
    subjects.forEach((subject, index) => {
        const card = cards.eq(index);
        assert(card.hasClass(`subject-card--${subject.id}`));
        assert.equal(card.find('h3').text(), subject.name);
        assert.equal(card.find('.subject-icon svg').length, 1);
        assert.equal(card.find('.subject-icon svg').attr('viewBox'), '0 0 24 24');
        assert.equal(card.attr('href'), subject.href);
        assert.equal(
            card.find('p').text(),
            subject.description + (subject.href ? '' : ' - Coming soon'),
        );
        if (!subject.href) assert.equal(card.attr('aria-disabled'), 'true');
    });
    assert.equal($('.subject-grid [data-go]').length, 0);
});
