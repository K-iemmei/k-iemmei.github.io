// Import independently playable Listening parts from a local, user-supplied PDF.
// OCR output remains in PostgreSQL; source book pages are never copied into the site build.
const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');
const { databaseOptions, root } = require('../../apps/api/config/environment');

const source = path.join(root, 'data/imports/Cambridge IELTS 20 Academic.pdf');
const modelDirectory = path.join(root, '.local');
const cacheDirectory = path.join(root, '.local/listening-ocr/cambridge-20');
const manifest = [
    { book: 20, test: 1, part: 1, pages: [5], scriptPages: [150, 151, 152] },
    { book: 20, test: 1, part: 2, pages: [6, 7], scriptPages: [152, 153, 154, 155] },
    { book: 20, test: 1, part: 3, pages: [8, 9], scriptPages: [155, 156, 157, 158] },
    { book: 20, test: 1, part: 4, pages: [10, 11], scriptPages: [158, 159, 160] },
];
async function run() {
    if (!fs.existsSync(source)) throw Error(`Missing source PDF: ${source}`);
    if (!fs.existsSync(path.join(modelDirectory, 'eng.traineddata.gz')))
        throw Error(
            'Missing .local/eng.traineddata.gz OCR model. Download the English Tesseract model before importing scanned PDFs.',
        );
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const { createCanvas } = require('@napi-rs/canvas');
    const { createWorker } = require('tesseract.js');
    const task = getDocument({
        data: new Uint8Array(fs.readFileSync(source)),
        useSystemFonts: true,
        disableFontFace: true,
    });
    const pdf = await task.promise;
    const worker = await createWorker('eng', 1, {
        langPath: modelDirectory,
        gzip: true,
        cacheMethod: 'none',
    });
    fs.mkdirSync(cacheDirectory, { recursive: true });
    async function extractPage(number) {
        const cached = path.join(cacheDirectory, `page-${number}.txt`);
        if (fs.existsSync(cached)) return fs.readFileSync(cached, 'utf8');
        const page = await pdf.getPage(number);
        const content = await page.getTextContent();
        let text = content.items
            .map((item) => item.str + (item.hasEOL ? '\n' : ' '))
            .join('')
            .trim();
        if (text.length < 300) {
            const viewport = page.getViewport({ scale: 2 });
            const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
            await page.render({ canvasContext: canvas.getContext('2d'), viewport, canvas }).promise;
            text = (await worker.recognize(canvas.toBuffer('image/png'))).data.text.trim();
        }
        if (text.length < 80) throw Error(`OCR returned too little text for PDF page ${number}`);
        fs.writeFileSync(cached, text);
        return text;
    }
    const client = new Client(
        process.argv.includes('--hosted')
            ? { connectionString: process.env.HOSTED_DATABASE_URL }
            : databaseOptions(),
    );
    if (process.argv.includes('--hosted') && !process.env.HOSTED_DATABASE_URL)
        throw Error('Set HOSTED_DATABASE_URL before --hosted import');
    await client.connect();
    try {
        await client.query('BEGIN');
        for (const entry of manifest) {
            const parts = [];
            for (const number of entry.pages) parts.push(await extractPage(number));
            let transcript = (await Promise.all(entry.scriptPages.map(extractPage))).join('\n\n');
            const start = transcript.search(new RegExp(`^Part\\s*${entry.part}\\s*$`, 'im'));
            if (start >= 0)
                transcript = transcript
                    .slice(start)
                    .replace(/^Part\s*\d+\s*$/im, '')
                    .trim();
            const next = transcript.search(
                new RegExp(`^(?:Part\\s*${entry.part + 1}|Test\\s*2)\\s*$`, 'im'),
            );
            if (next >= 0) transcript = transcript.slice(0, next).trim();
            transcript = transcript
                .replace(/^\s*(?:Speaker\s*\d+[^:]*|Narrator\/Instructor|Lecturer)\s*:\s*/gim, '')
                .replace(/^\s*\d{1,3}\s*$/gm, '')
                .trim();
            const slug = `cambridge-${entry.book}-test-${entry.test}-part-${entry.part}`;
            const first = (entry.part - 1) * 10 + 1;
            await client.query(
                `INSERT INTO public.listening_sessions
                (slug,book_number,test_number,part_number,title,question_text,first_question,last_question,audio_filename,source_pages,transcript)
                VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
                ON CONFLICT(slug) DO UPDATE SET
                question_text=COALESCE(NULLIF(btrim(public.listening_sessions.question_text),''),EXCLUDED.question_text),
                source_pages=EXCLUDED.source_pages,
                transcript=COALESCE(NULLIF(btrim(public.listening_sessions.transcript),''),EXCLUDED.transcript),updated_at=now()`,
                [
                    slug,
                    entry.book,
                    entry.test,
                    entry.part,
                    `Cambridge ${entry.book} · Test ${entry.test} · Part ${entry.part}`,
                    parts.join('\n\n'),
                    first,
                    first + 9,
                    `0-cam${entry.book}-test-${entry.test}-part-${entry.part}.mp3`,
                    JSON.stringify(entry.pages),
                    transcript,
                ],
            );
            console.log(`Imported ${slug} from PDF pages ${entry.pages.join(', ')}`);
        }
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        await client.end();
        await worker.terminate();
        await task.destroy();
    }
}
run().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
