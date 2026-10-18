// Shared numbered navigation keeps both English libraries consistent.
export function libraryPagination({ page: currentPage, pageCount, start, pageSize, total, label }) {
    const pages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, pageCount])]
        .filter((page) => page >= 1 && page <= pageCount)
        .sort((a, b) => a - b);
    const pageButtons = pages
        .map(
            (page, index) =>
                `${index && page - pages[index - 1] > 1 ? '<span class="page-gap" aria-hidden="true">&hellip;</span>' : ''}<button type="button" data-page-number="${page}" aria-label="Page ${page}" ${page === currentPage ? 'aria-current="page"' : ''}>${page}</button>`,
        )
        .join('');
    return `<span class="page-summary" role="status">${start + 1}&ndash;${Math.min(start + pageSize, total)} of ${total} ${label}</span><div class="page-controls"><button type="button" data-page-number="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous page">&larr;</button>${pageButtons}<button type="button" data-page-number="${currentPage + 1}" ${currentPage === pageCount ? 'disabled' : ''} aria-label="Next page">&rarr;</button></div>`;
}
