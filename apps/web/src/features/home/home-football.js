import { cachedLoad } from '../../core/page-cache.js';
import { apiRequest } from '../../core/database-client.js';
import { escapeHtml as h } from '../../shared/escape-html.js';
import { footballLeagues } from '../../domain/home-football.js';

export function initFootball() {
    const select = document.getElementById('footballLeague');
    const table = document.getElementById('footballTable');
    const status = document.getElementById('footballMessage');
    const expand = document.getElementById('footballExpand');
    const retry = document.getElementById('footballRetry');
    let generation = 0,
        data = null,
        full = false;
    select.innerHTML = Object.entries(footballLeagues)
        .map(([id, name]) => `<option value="${id}">${h(name)}</option>`)
        .join('');
    try {
        const league = localStorage.getItem('home-football-league');
        if (Object.hasOwn(footballLeagues, league)) select.value = league;
    } catch {}
    function render() {
        document.getElementById('footballRows').innerHTML = (
            full ? data.teams : data.teams.slice(0, 5)
        )
            .map(
                (team) =>
                    `<tr><td>${team.rank}</td><th scope="row">${h(team.name)}</th><td>${team.played}</td><td class="football-detail">${team.won}</td><td class="football-detail">${team.drawn}</td><td class="football-detail">${team.lost}</td><td>${team.difference > 0 ? '+' : ''}${team.difference}</td><td class="football-points">${team.points}</td></tr>`,
            )
            .join('');
        table.hidden = false;
        expand.hidden = data.teams.length <= 5;
        expand.textContent = full ? 'Show top 5' : 'Full table';
        expand.setAttribute('aria-expanded', String(full));
    }
    async function load(force = false) {
        const current = ++generation,
            league = select.value;
        status.textContent = 'Loading standings…';
        table.hidden = true;
        expand.hidden = true;
        retry.hidden = true;
        document.getElementById('footballSource').hidden = true;
        try {
            const result = await cachedLoad(
                'football-standings:' + league,
                () => apiRequest('/api/home/football?league=' + encodeURIComponent(league)),
                { maxAge: 600000, force },
            );
            if (current !== generation) return;
            data = result;
            render();
            const updated = new Date(data.updated_at).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
            status.textContent = `${data.season} · ${data.stale ? 'Last available update' : 'Updated'} ${updated}`;
            const source = document.getElementById('footballSource');
            source.href = `https://www.espn.com/soccer/standings/_/league/${league}`;
            source.hidden = false;
        } catch (error) {
            if (current !== generation) return;
            status.textContent = error.message;
            retry.hidden = false;
        }
    }
    select.addEventListener('change', () => {
        full = false;
        try {
            localStorage.setItem('home-football-league', select.value);
        } catch {}
        load();
    });
    expand.addEventListener('click', () => {
        full = !full;
        render();
    });
    retry.addEventListener('click', () => load(true));
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) load();
    });
    load();
}
