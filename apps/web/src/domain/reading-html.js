const tags = new Set(
    'p div span h2 h3 h4 strong b em i u s br hr ul ol li blockquote table thead tbody tfoot tr td th caption'.split(
        ' ',
    ),
);
const escape = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
export function sanitizeReadingHtml(value) {
    const source = String(value || '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(
            /<(script|style|iframe|object|svg|math|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
            '',
        );
    return source
        .split(/(<[^>]*>)/g)
        .map((part) => {
            if (!part.startsWith('<')) return part.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const match = part.match(/^<(\/)?([a-z][a-z0-9]*)\b([^<>]*)>$/i);
            if (!match || !tags.has(match[2].toLowerCase())) return '';
            const tag = match[2].toLowerCase();
            if (match[1]) return ['br', 'hr'].includes(tag) ? '' : `</${tag}>`;
            let attrs = '';
            if (tag === 'td' || tag === 'th') {
                for (const name of ['rowspan', 'colspan']) {
                    const value = match[3].match(
                        new RegExp(
                            '(?:^|\\s)' + name + '\\s*=\\s*(?:"(\\d+)"|\'(\\d+)\'|(\\d+)(?=\\s|$))',
                            'i',
                        ),
                    );
                    const number = Number(value?.[1] || value?.[2] || value?.[3]);
                    if (number >= 1 && number <= 100) attrs += ` ${name}="${number}"`;
                }
                const scope = match[3].match(/\bscope\s*=\s*["'](col|row|colgroup|rowgroup)["']/i);
                if (scope && tag === 'th') attrs += ` scope="${scope[1].toLowerCase()}"`;
            }
            return `<${tag}${attrs}>`;
        })
        .join('');
}
export function readingHtmlText(html) {
    return sanitizeReadingHtml(html)
        .replace(/<br>|<\/(?:p|div|h[234]|blockquote|li|tr|table|caption)>/gi, '\n')
        .replace(/<\/(?:td|th)>/gi, '\t')
        .replace(/<[^>]*>/g, '')
        .replace(
            /&(?:amp|lt|gt|quot|apos|nbsp|#39);/g,
            (value) =>
                ({
                    '&amp;': '&',
                    '&lt;': '<',
                    '&gt;': '>',
                    '&quot;': '"',
                    '&apos;': "'",
                    '&#39;': "'",
                    '&nbsp;': ' ',
                })[value],
        )
        .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, v) => {
            const n = v[0].toLowerCase() === 'x' ? parseInt(v.slice(1), 16) : Number(v);
            return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : '';
        })
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
export function readingMarkup(html, text = '') {
    if (html?.trim()) return sanitizeReadingHtml(html);
    if (/<\/?(?:table|thead|tbody|tr|td|th|p|div|h[234]|ul|ol)\b/i.test(text))
        return sanitizeReadingHtml(text);
    return String(text || '')
        .split(/\n\s*\n/)
        .map((p) => `<p>${escape(p).replace(/\n/g, '<br>')}</p>`)
        .join('');
}

// Older imports retain table rows as "label: details". Keep all source text,
// without guessing missing columns or moving values between named columns.
export function legacyTableMarkup(text, instructions = '') {
    if (!/\btable\b/i.test(instructions)) return '';
    const lines = String(text || '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    if (lines.filter((line) => line.indexOf(':') > 0).length < 2) return '';
    const caption = !/\{\{|_{2,}|\.{3,}/.test(lines[0]) ? lines.shift() : '';
    return `<table>${caption ? `<caption>${escape(caption)}</caption>` : ''}<tbody>${lines
        .map((line) => {
            const colon = line.indexOf(':');
            return colon > 0
                ? `<tr><th scope="row">${escape(line.slice(0, colon))}</th><td>${escape(line.slice(colon + 1).trim())}</td></tr>`
                : `<tr><td colspan="2">${escape(line)}</td></tr>`;
        })
        .join('')}</tbody></table>`;
}
