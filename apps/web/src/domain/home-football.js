export const footballLeagues = {
    'eng.1': 'Premier League',
    'esp.1': 'La Liga',
    'ita.1': 'Serie A',
    'ger.1': 'Bundesliga',
    'fra.1': 'Ligue 1',
    'uefa.champions': 'Champions League',
};
const cache = new Map(),
    pending = new Map();
export function parseStandings(data) {
    const entries = data?.children?.flatMap((group) => group.standings?.entries || []) || [];
    const teams = entries.map((entry) => {
        const stat = (name) => entry.stats?.find((stat) => stat.name === name)?.value;
        return {
            id: String(entry.team?.id || ''),
            name: entry.team?.displayName,
            rank: stat('rank'),
            played: stat('gamesPlayed'),
            won: stat('wins'),
            drawn: stat('ties'),
            lost: stat('losses'),
            difference: stat('pointDifferential'),
            points: stat('points'),
        };
    });
    if (
        !teams.length ||
        teams.length > 60 ||
        teams.some(
            (team) =>
                !team.id ||
                typeof team.name !== 'string' ||
                !team.name ||
                ['rank', 'played', 'won', 'drawn', 'lost', 'difference', 'points'].some(
                    (key) => !Number.isInteger(team[key]),
                ) ||
                team.rank < 1,
        )
    )
        throw Error('Standings source returned incomplete data');
    if (
        new Set(teams.map((team) => team.id)).size !== teams.length ||
        new Set(teams.map((team) => team.rank)).size !== teams.length
    )
        throw Error('Standings source returned multiple groups');
    return {
        season: data.season?.displayName || data.name || '',
        teams: teams.sort((a, b) => a.rank - b.rank),
    };
}
export async function loadStandings(league = 'eng.1', fetcher = fetch) {
    league ||= 'eng.1';
    if (!Object.hasOwn(footballLeagues, league))
        throw Object.assign(new Error('Invalid football league'), { status: 400 });
    const old = cache.get(league);
    if (old && Date.now() - old.time < 600000) return old.data;
    if (pending.has(league)) return pending.get(league);
    const task = (async () => {
        try {
            const response = await fetcher(
                `https://site.web.api.espn.com/apis/v2/sports/soccer/${league}/standings`,
                { signal: AbortSignal.timeout(10000) },
            );
            if (!response.ok) throw Error('Standings source unavailable');
            const data = {
                ...parseStandings(await response.json()),
                league,
                name: footballLeagues[league],
                source: 'ESPN',
                source_url: `https://www.espn.com/soccer/standings/_/league/${league}`,
                updated_at: new Date().toISOString(),
                stale: false,
            };
            cache.set(league, { time: Date.now(), data });
            return data;
        } catch {
            if (old && Date.now() - old.time < 86400000) return { ...old.data, stale: true };
            throw Object.assign(new Error('Unable to load standings. Please retry.'), {
                status: 503,
            });
        }
    })();
    pending.set(league, task);
    try {
        return await task;
    } finally {
        pending.delete(league);
    }
}
