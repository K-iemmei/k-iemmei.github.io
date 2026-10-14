import { apiRequest } from '../../../core/database-client.js';
export const listReadingTests = () => apiRequest('/api/tests');
export const getReadingTest = (slug) => apiRequest('/api/tests/' + encodeURIComponent(slug));
export const getQuestionTypes = () => apiRequest('/api/reading/author/question-types');
export const attempts = {
    list: (_userId, slug) => apiRequest(`/api/tests/${encodeURIComponent(slug)}/attempts`),
    save: (slug, version, responses) =>
        apiRequest(`/api/tests/${encodeURIComponent(slug)}/attempts`, {
            method: 'POST',
            body: JSON.stringify({ version, responses }),
        }),
};
