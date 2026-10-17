import {
    initWritingShell,
    request,
    h,
    tagsHTML,
    dateLabel,
    userId,
    paintRich,
    watchTheme,
    message,
} from './common.js';
initWritingShell();
const id = new URLSearchParams(location.search).get('id');
const article = document.getElementById('postArticle');
let post;
try {
    if (!id) throw Error('Select a post from Blog.');
    post = await request('/api/blog/' + encodeURIComponent(id));
    document.title = `${post.title} · Blog | Daily Note`;
    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postMeta').textContent =
        `${post.author_name} · ${dateLabel(post.published_at)}${post.updated_at !== post.published_at ? ' · Updated ' + dateLabel(post.updated_at) : ''}`;
    document.getElementById('postTags').innerHTML = tagsHTML(post.tags);
    const edit = document.getElementById('postEdit');
    edit.hidden = post.author_id !== userId;
    edit.href = 'note.html?id=' + encodeURIComponent(id);
    await paintRich(article, post.body);
    const headings = [...article.querySelectorAll('h1,h2,h3')];
    document.getElementById('postContents').innerHTML = headings
        .map((heading, index) => {
            heading.id = 'post-section-' + index;
            return `<a href="#${heading.id}" class="toc-${heading.tagName.toLowerCase()}">${h(heading.textContent)}</a>`;
        })
        .join('');
    document.getElementById('postContentsPanel').hidden = !headings.length;
} catch (error) {
    document.getElementById('postTitle').textContent = 'Post unavailable';
    message(error.message, 'error');
}
watchTheme(async () => {
    if (post) {
        await paintRich(article, post.body);
        [...article.querySelectorAll('h1,h2,h3')].forEach(
            (heading, index) => (heading.id = 'post-section-' + index),
        );
    }
});
