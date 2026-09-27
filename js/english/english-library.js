const testGrid = document.getElementById('testGrid');
const emptyState = document.getElementById('emptyState');
const testCountPill = document.getElementById('testCountPill');
const searchInput = document.getElementById('searchInput');
const editionFilter = document.getElementById('editionFilter');

const state = {
    tests: [],
    filteredTests: [],
};

function normalizeText(value = '') {
    return String(value || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function getEditionLabel(test) {
    const slug = test.slug || test.file || '';
    const match = slug.match(/cambridge-ielts-(\d+)/i);
    if (match) return `IELTS ${match[1]}`;
    const label = test.title || '';
    const labelMatch = label.match(/\b(\d{1,2})\b/);
    return labelMatch ? `IELTS ${labelMatch[1]}` : 'IELTS';
}

function buildTestCards(tests) {
    if (!tests.length) {
        testGrid.innerHTML = '';
        emptyState.style.display = 'block';
        testCountPill.textContent = `${state.tests.length} tests available`;
        return;
    }

    emptyState.style.display = 'none';
    testGrid.innerHTML = tests.map((test) => {
        const title = test.title || 'Cambridge IELTS Reading';
        const slug = test.slug || test.file?.replace(/\.txt$/i, '') || 'reading-test';
        const file = test.file || '';
        const label = getEditionLabel(test);
        const hint = file ? file.replace(/\.txt$/i, '').replace(/-/g, ' ') : 'Reading practice';
        const shortTitle = title.replace(/\s*\(Free Online Test & Answers\)$/i, '').trim();

        return `
            <article class="test-card">
                <span class="test-meta">${label}</span>
                <h2>${shortTitle}</h2>
                <p>${hint}</p>
                <div class="card-footer">
                    <span class="test-tag">Cambridge</span>
                    <a class="open-link" href="english.html?test=${encodeURIComponent(slug)}${test.passage ? '&passage=' + test.passage : ''}">Open test →</a>
                </div>
            </article>
        `;
    }).join('');

    testCountPill.textContent = `${tests.length} match${tests.length === 1 ? '' : 'es'} shown`;
}

function applyFilters() {
    const query = normalizeText(searchInput?.value || '');
    const selectedEdition = editionFilter?.value || 'all';

    const filtered = state.tests.filter((test) => {
        const edition = getEditionLabel(test).toLowerCase();
        const haystack = normalizeText(`${test.title} ${test.slug} ${test.file} ${edition}`);
        const passesText = !query || haystack.includes(query);
        const passesEdition = selectedEdition === 'all' || edition.includes(selectedEdition.toLowerCase());
        return passesText && passesEdition;
    });

    state.filteredTests = filtered;
    buildTestCards(filtered);
}

async function loadTestLibrary() {
    try {
        // prefer a passages-level manifest if available (each entry can have a .passage property)
        let response = await fetch('data/cambridge_ielts_reading/manifest_passages.json', { cache: 'no-store' });
        if (!response.ok) {
            // fallback to the original manifest
            response = await fetch('data/cambridge_ielts_reading/manifest.json', { cache: 'no-store' });
        }

        if (!response.ok) throw new Error('Manifest not found');

        const manifest = await response.json();
        const tests = Array.isArray(manifest) ? manifest : (manifest.tests || []);

        if (!Array.isArray(tests) || tests.length === 0) {
            throw new Error('No tests available');
        }

        state.tests = tests.map((test) => ({
            ...test,
            title: test.title || test.name || 'Cambridge IELTS Reading',
            slug: test.slug || test.file?.replace(/\.txt$/i, '') || 'reading-test',
            file: test.file || test.filename || '',
            passage: test.passage || 1,
            test_slug: test.test_slug || test.slug || (test.file || '').replace(/\.html?$/i, ''),
        }));

        const editions = [...new Set(state.tests.map((test) => getEditionLabel(test)))].sort((a, b) => {
            const left = Number((a.match(/(\d+)/) || [])[1] || 0);
            const right = Number((b.match(/(\d+)/) || [])[1] || 0);
            return left - right;
        });

        if (editionFilter) {
            editionFilter.innerHTML = ['<option value="all">All Cambridge editions</option>']
                .concat(editions.map((edition) => `<option value="${edition}">${edition}</option>`))
                .join('');
            editionFilter.addEventListener('change', applyFilters);
        }

        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
        }

        state.filteredTests = [...state.tests];
        buildTestCards(state.filteredTests);
    } catch (error) {
        console.warn('Unable to load Cambridge library:', error);
        testGrid.innerHTML = '';
        emptyState.style.display = 'block';
        testCountPill.textContent = '0 tests available';
    }
}

loadTestLibrary();
