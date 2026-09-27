(function () {
    window.ENG = window.ENG || {};
    const utils = {
        escapeHtml(value = '') {
            return String(value).replace(/[&<>"']/g, (character) => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            })[character]);
        },

        normalizeAnswer(value = '') {
            return String(value ?? '')
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        },

        normalizeQuestionType(value = '') {
            const raw = String(value || '').trim().toLowerCase();
            const map = {
                tfng: 'true_false_not_given',
                true_false: 'true_false_not_given',
                true_false_not_given: 'true_false_not_given',
                yes_no: 'yes_no_not_given',
                yes_no_not_given: 'yes_no_not_given',
                matching_heading: 'matching_headings',
                matching_headings: 'matching_headings',
                matching_information: 'matching_information',
                matching_features: 'matching_features',
                matching_sentence_endings: 'matching_sentence_endings',
                multiple_choice: 'multiple_choice',
                mcq: 'multiple_choice',
                summary_completion: 'summary_completion',
                sentence_completion: 'sentence_completion',
                note_completion: 'note_completion',
                table_completion: 'table_completion',
                flow_chart_completion: 'flow_chart_completion',
                diagram_labelling: 'diagram_labelling',
                short_answer: 'short_answer',
            };

            return map[raw] || raw || 'short_answer';
        },

        parseTestTitle(rawTitle = '') {
            const value = String(rawTitle).trim();
            if (!value) return '';

            const withoutSource = value.replace(/\s*\(.*?\)\s*$/g, '').trim();
            const cleaned = withoutSource
                .replace(/^Cambridge IELTS\s+\d+\s+Academic Reading Test\s+\d+\s*[:\-]?\s*/i, '')
                .trim();

            return cleaned || withoutSource;
        },

        extractPassageFromText(rawText = '') {
            const text = String(rawText).replace(/\r/g, '');
            const beforeQuestions = text.split(/(?:^|\n)\s*Questions\s+\d+\s*[-–]\d+/i)[0] || text;
            const lines = beforeQuestions
                .split(/\n/)
                .map((line) => line.trim())
                .filter(Boolean);

            const startIndex = lines.findIndex((line) => {
                const noise = /^(Skip to content|Cambridge IELTS|🔥 Today Only:|Export|Focus|00:\d{2}:\d{2}|[-+]+|Part\s+\d+|Practice Skimming|Read the text|You should spend|Practice this section only|Complete the notes below|Choose ONE WORD ONLY|Questions\s+\d+)/i.test(line);
                return !noise && !/answer questions/i.test(line) && line.length > 10;
            });

            if (startIndex === -1) return window.ENG.fallbackPassage || '';

            const endIndex = lines.findIndex((line, index) => index > startIndex && /^(?:Questions\s+\d+\s*[-–]\d+|Questions\s+\d+\s*[-–]\d+.*)$/i.test(line));
            const meaningfulLines = lines.slice(startIndex, endIndex >= 0 ? endIndex : undefined);
            const cleaned = meaningfulLines.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();

            return cleaned || window.ENG.fallbackPassage || '';
        },

        getQuestionType(instructions = '') {
            const text = (instructions || '').toLowerCase();
            if (/true\s*\/\s*false\s*\/\s*not given|true[\s\S]*false[\s\S]*not given|statements agree/.test(text)) return 'true_false_not_given';
            if (/yes\s*\/\s*no\s*\/\s*not given|yes[\s\S]*no[\s\S]*not given/.test(text)) return 'yes_no_not_given';
            if (/choose.{0,60}heading|matching headings/.test(text)) return 'matching_headings';
            if (/which paragraph (contains|mentions|refers to)/.test(text)) return 'matching_information';
            if (/matching features|matching names|matching features and names/.test(text)) return 'matching_features';
            if (/complete the summary|summary completion|summary\s*:\s*/.test(text)) return 'summary_completion';
            if (/complete the sentences|complete the summary by using no more than|one word only|choose one word only/i.test(text)) return 'sentence_completion';
            if (/diagram label|label the diagram|diagram labelling/.test(text)) return 'diagram_labelling';
            if (/choose the correct letter/.test(text)) return 'multiple_choice';
            return 'short_answer';
        }
    };

    window.ENG.utils = utils;
})();