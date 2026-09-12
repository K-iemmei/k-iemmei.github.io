const testGrid = document.getElementById('testGrid');
const emptyState = document.getElementById('emptyState');
const testCountPill = document.getElementById('testCountPill');

async function loadTestLibrary() {
    try {
        const response = await fetch('data/cambridge_ielts_reading/manifest.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Manifest not found');

        const manifest = await response.json();
        const tests = Array.isArray(manifest) ? manifest : (manifest.tests || []);

        if (!Array.isArray(tests) || tests.length === 0) {
            throw new Error('No tests available');
        }

        testGrid.innerHTML = tests.map((test) => {
            const title = test.title || 'Cambridge IELTS Reading';
            const slug = test.slug || test.file?.replace(/\.txt$/i, '') || 'reading-test';
            const file = test.file || '';
            const label = title.includes('21') ? 'IELTS 21' : title.includes('20') ? 'IELTS 20' : 'IELTS 19';
            const hint = file ? file.replace(/\.txt$/i, '').replace(/-/g, ' ') : 'Reading practice';

            return `
                <article class="test-card">
                    <span class="test-meta">${label}</span>
                    <h2>${title.replace(/ \(Free Online Test & Answers\)$/i, '')}</h2>
                    <p>${hint}</p>
                    <div class="card-footer">
                        <span class="test-tag">Cambridge</span>
                        <a class="open-link" href="english.html?test=${encodeURIComponent(slug)}">Open test →</a>
                    </div>
                </article>
            `;
        }).join('');

        testCountPill.textContent = `${tests.length} tests available`;
        emptyState.style.display = 'none';
    } catch (error) {
        console.warn('Unable to load Cambridge library:', error);
        testGrid.innerHTML = '';
        emptyState.style.display = 'block';
        testCountPill.textContent = '0 tests available';
    }
}

loadTestLibrary();
