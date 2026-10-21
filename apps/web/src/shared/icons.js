const paths = {
    book: '<path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v14"/><path d="M6 9h3m-3 4h3m6-4h3m-3 4h3"/>',
    headphones:
        '<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/><path d="M17 20c0 2-3 2-5 2"/>',
    grammar: '<path d="M4 5h9M4 10h6M4 15h4m-4 5h10m-3-5 7-7 3 3-7 7-4 1 1-4Z"/>',
    cards: '<rect x="7" y="5" width="13" height="16" rx="2"/><path d="M4 17H3V3h13v1m-5 7h5m-5 4h3"/>',
    language:
        '<path d="M3 4h13M9 2v2m-4 3c1 4 4 7 8 9m1-12c-1 6-4 10-10 13m10 4 4-11 4 11m-7-3h6"/>',
    nodes: '<rect x="8" y="8" width="8" height="8" rx="2"/><path d="M12 3v5m0 8v5M3 12h5m8 0h5M5 5l4 4m6 6 4 4M19 5l-4 4M9 15l-4 4"/>',
    arrow: '<path d="M6 18 18 6M6 6h12v12"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    moon: '<path d="M20.5 13a8.5 8.5 0 0 1-9.5-9.5A8.5 8.5 0 1 0 20.5 13Z"/>',
};
export function appIcon(name) {
    return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || paths.book}</svg>`;
}
