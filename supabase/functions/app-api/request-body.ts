export async function readApiBody(req: Request, path: string) {
    const json = ['POST', 'PUT', 'PATCH'].includes(req.method) ||
        (req.method === 'DELETE' && /^\/api\/home\/todos\/[0-9a-f-]{36}$/i.test(path));
    return json && !path.includes('/source-pages/') && path !== '/api/vocabulary/import-apkg'
        ? await req.json()
        : null;
}
