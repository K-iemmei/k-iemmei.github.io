import { Marked } from 'marked';
import DOMPurify from 'dompurify';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import json from 'highlight.js/lib/languages/json';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import yaml from 'highlight.js/lib/languages/yaml';
import { escapeHtml as h } from '../../shared/escape-html.js';
import { chartData } from '../../domain/publishing.js';

for (const [name, language] of Object.entries({
    javascript,
    typescript,
    python,
    sql,
    json,
    css,
    xml,
    bash,
    java,
    cpp,
    yaml,
}))
    hljs.registerLanguage(name, language);
hljs.registerAliases(['js'], { languageName: 'javascript' });
hljs.registerAliases(['ts'], { languageName: 'typescript' });
hljs.registerAliases(['html'], { languageName: 'xml' });
const states = new WeakMap();
let diagramId = 0;
function safeURL(value, image = false) {
    try {
        const url = new URL(value, location.href);
        if (
            url.username ||
            url.password ||
            !(image ? ['https:'] : ['http:', 'https:', 'mailto:']).includes(url.protocol)
        )
            return null;
        return url.href;
    } catch {
        return null;
    }
}
function parser(blocks) {
    const slot = (type, source, display = false) => {
        const index = blocks.push({ type, source, display }) - 1;
        return `<span class="rich-slot" data-rich-slot="${index}"></span>`;
    };
    return new Marked({
        gfm: true,
        breaks: false,
        renderer: {
            html(token) {
                return h(token.text);
            },
            image(token) {
                const match = /^note-asset:([0-9a-f-]{36})$/i.exec(token.href);
                if (match)
                    return `<span class="rich-image-slot" data-asset-id="${h(match[1])}" data-alt="${h(token.text)}">Loading image…</span>`;
                const url = safeURL(token.href, true);
                return url
                    ? `<img src="${h(url)}" alt="${h(token.text)}" loading="lazy" referrerpolicy="no-referrer" />`
                    : '<span class="rich-error">Image URL must use HTTPS.</span>';
            },
            link(token) {
                const url = safeURL(token.href);
                const text = this.parser.parseInline(token.tokens);
                return url
                    ? `<a href="${h(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`
                    : text;
            },
            code(token) {
                const language = (token.lang || '').split(/\s/)[0].toLowerCase();
                if (['chart', 'mermaid'].includes(language))
                    return `<div class="rich-visual">${slot(language, token.text)}</div>`;
                const known = hljs.getLanguage(language) && token.text.length < 50000;
                const content = known
                    ? hljs.highlight(token.text, { language, ignoreIllegals: true }).value
                    : h(token.text);
                return `<pre><code class="hljs">${content}</code></pre>`;
            },
        },
        extensions: [
            {
                name: 'blockMath',
                level: 'block',
                start(src) {
                    return src.indexOf('$$');
                },
                tokenizer(src) {
                    const match = /^\$\$[ \t]*\n?([\s\S]+?)\n?\$\$(?:[ \t]*(?:\n|$))/.exec(src);
                    if (match) return { type: 'blockMath', raw: match[0], text: match[1] };
                },
                renderer(token) {
                    return `<div class="rich-math-block">${slot('math', token.text, true)}</div>`;
                },
            },
            {
                name: 'inlineMath',
                level: 'inline',
                start(src) {
                    return src.indexOf('$');
                },
                tokenizer(src) {
                    const match = /^\$(?!\s|\$)((?:\\.|[^$\\\n])+?)\$(?!\d)/.exec(src);
                    if (match) return { type: 'inlineMath', raw: match[0], text: match[1] };
                },
                renderer(token) {
                    return slot('math', token.text);
                },
            },
        ],
    });
}
export function disposeRich(host) {
    const state = states.get(host);
    if (!state) return;
    state.cancelled = true;
    for (const chart of state.charts) chart.destroy();
    for (const url of state.urls) URL.revokeObjectURL(url);
    states.delete(host);
}
export async function renderRich(host, source, { resolveAsset } = {}) {
    disposeRich(host);
    const state = { cancelled: false, charts: [], urls: [] };
    states.set(host, state);
    const blocks = [];
    const html = parser(blocks).parse(String(source || ''));
    host.innerHTML = DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select'],
        FORBID_ATTR: ['style', 'id', 'name'],
        ADD_ATTR: [
            'data-rich-slot',
            'data-asset-id',
            'data-alt',
            'target',
            'rel',
            'referrerpolicy',
        ],
    });
    const active = () => states.get(host) === state && !state.cancelled;
    const tasks = [...host.querySelectorAll('[data-rich-slot]')].map(async (element) => {
        const block = blocks[Number(element.dataset.richSlot)];
        try {
            if (block.type === 'math') {
                const output = katex.renderToString(block.source, {
                    displayMode: block.display,
                    throwOnError: true,
                    trust: false,
                    maxSize: 20,
                    maxExpand: 1000,
                    strict: 'ignore',
                });
                if (active())
                    element.innerHTML = DOMPurify.sanitize(output, {
                        USE_PROFILES: { html: true, svg: true, mathMl: true },
                        FORBID_TAGS: ['style'],
                    });
            } else if (block.type === 'chart') {
                const data = chartData(JSON.parse(block.source));
                const { default: Chart } = await import('chart.js/auto');
                if (!active()) return;
                const canvas = document.createElement('canvas');
                canvas.setAttribute('role', 'img');
                canvas.setAttribute('aria-label', data.title || 'Chart');
                const colours = [
                    '#83b6ed',
                    '#a99bde',
                    '#7cbec5',
                    '#d7ac79',
                    '#ce91ac',
                    '#a8bc7e',
                    '#7f9cc6',
                    '#c3a1d2',
                ];
                const colour = getComputedStyle(host).color;
                element.replaceChildren(canvas);
                const chart = new Chart(canvas, {
                    type: data.type,
                    data: {
                        labels: data.labels,
                        datasets: data.datasets.map((dataset, index) => ({
                            ...dataset,
                            borderColor: colours[index],
                            backgroundColor: ['pie', 'doughnut'].includes(data.type)
                                ? colours
                                : colours[index] + 'aa',
                            borderWidth: 2,
                        })),
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: false,
                        plugins: {
                            title: { display: !!data.title, text: data.title, color: colour },
                            legend: { labels: { color: colour } },
                        },
                        scales: ['pie', 'doughnut', 'radar'].includes(data.type)
                            ? {}
                            : {
                                  x: {
                                      ticks: { color: colour },
                                      grid: { color: 'rgba(130,150,180,.12)' },
                                  },
                                  y: {
                                      beginAtZero: true,
                                      ticks: { color: colour },
                                      grid: { color: 'rgba(130,150,180,.12)' },
                                  },
                              },
                    },
                });
                state.charts.push(chart);
                element.classList.add('rich-chart');
                const table = document.createElement('table');
                table.className = 'rich-chart-data';
                table.innerHTML = `<caption>Chart data</caption><thead><tr><th>Label</th>${data.datasets.map((dataset) => `<th>${h(dataset.label)}</th>`).join('')}</tr></thead><tbody>${data.labels.map((label, index) => `<tr><th>${h(label)}</th>${data.datasets.map((dataset) => `<td>${dataset.data[index]}</td>`).join('')}</tr>`).join('')}</tbody>`;
                const details = document.createElement('details');
                const summary = document.createElement('summary');
                summary.textContent = 'View chart data';
                details.append(summary, table);
                element.parentElement.append(details);
            } else {
                if (block.source.length > 10000 || /%%\{|^\s*---/.test(block.source))
                    throw Error('Diagram is too large or contains configuration directives.');
                const { default: mermaid } = await import('mermaid');
                if (!active()) return;
                mermaid.initialize({
                    startOnLoad: false,
                    securityLevel: 'strict',
                    htmlLabels: false,
                    theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default',
                    suppressErrorRendering: true,
                    maxTextSize: 10000,
                    maxEdges: 200,
                    flowchart: { htmlLabels: false },
                    secure: [
                        'secure',
                        'securityLevel',
                        'startOnLoad',
                        'maxTextSize',
                        'maxEdges',
                        'themeCSS',
                        'htmlLabels',
                    ],
                });
                const { svg } = await mermaid.render('note-diagram-' + ++diagramId, block.source);
                if (active())
                    element.innerHTML = DOMPurify.sanitize(svg, {
                        USE_PROFILES: { svg: true, svgFilters: true },
                        FORBID_TAGS: ['a', 'foreignObject'],
                        FORBID_ATTR: ['onload', 'onclick'],
                    });
            }
        } catch (error) {
            if (active()) {
                element.className = 'rich-error';
                element.textContent = `Unable to render ${block.type}: ${error.message}`;
            }
        }
    });
    for (const element of host.querySelectorAll('[data-asset-id]'))
        tasks.push(
            (async () => {
                try {
                    if (!resolveAsset) throw Error('Image loader is unavailable');
                    const asset = await resolveAsset(element.dataset.assetId);
                    if (!active()) return;
                    const bytes = Uint8Array.from(atob(asset.data_base64), (char) =>
                        char.charCodeAt(0),
                    );
                    const url = URL.createObjectURL(new Blob([bytes], { type: asset.mime_type }));
                    state.urls.push(url);
                    const image = document.createElement('img');
                    image.src = url;
                    image.alt = element.dataset.alt || '';
                    image.loading = 'lazy';
                    element.replaceWith(image);
                } catch (error) {
                    if (active()) {
                        element.className = 'rich-error';
                        element.textContent = 'Image unavailable: ' + error.message;
                    }
                }
            })(),
        );
    await Promise.allSettled(tasks);
}
