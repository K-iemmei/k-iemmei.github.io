import { escapeHtml as h } from '../../shared/escape-html.js';
const $ = (id) => document.getElementById(id);
const conditions = (code) =>
    code === 0
        ? 'Clear sky'
        : code <= 3
          ? 'Partly cloudy'
          : code <= 48
            ? 'Fog'
            : code <= 57
              ? 'Drizzle'
              : code <= 67
                ? 'Rain'
                : code <= 77
                  ? 'Snow'
                  : code <= 82
                    ? 'Rain showers'
                    : code <= 86
                      ? 'Snow showers'
                      : 'Thunderstorms';
async function json(url) {
    const r = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!r.ok) throw new Error('Weather service unavailable. Please retry.');
    return r.json();
}
export function initWeather(saveCity) {
    let city = null,
        request = 0,
        searchRequest = 0,
        choosing = false;
    async function show(next) {
        city = next;
        const token = ++request;
        $('weatherMessage').textContent = '';
        if (!city) {
            $('weatherContent').innerHTML =
                '<p class="home-muted">Choose a city to see its weather.</p>';
            return;
        }
        $('weatherContent').innerHTML = '<p class="home-muted">Loading weather…</p>';
        try {
            const params = new URLSearchParams({
                latitude: city.latitude,
                longitude: city.longitude,
                current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m',
                daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
                timezone: 'auto',
                forecast_days: '3',
            });
            const d = await json('https://api.open-meteo.com/v1/forecast?' + params);
            if (token !== request) return;
            if (!d.current || !d.daily) throw new Error('Weather data unavailable. Please retry.');
            $('weatherContent').innerHTML =
                `<h3 class="weather-city">${h(city.name)}</h3><div class="weather-now"><strong>${Math.round(d.current.temperature_2m)}°</strong><span>${h(conditions(d.current.weather_code))}<small>Feels like ${Math.round(d.current.apparent_temperature)}° · Wind ${Math.round(d.current.wind_speed_10m)} km/h</small></span></div><div class="weather-days">${d.daily.time.map((day, i) => `<div><span>${i === 0 ? 'Today' : h(new Date(day + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short' }))}</span><strong>${Math.round(d.daily.temperature_2m_min[i])}° / ${Math.round(d.daily.temperature_2m_max[i])}°</strong><span>Rain ${d.daily.precipitation_probability_max[i] ?? '—'}%</span></div>`).join('')}</div><p class="home-muted weather-updated">Updated ${h(d.current.time.slice(11, 16))} · ${h(d.timezone)}</p>`;
        } catch (e) {
            if (token === request) {
                $('weatherContent').textContent = '';
                $('weatherMessage').textContent = e.message;
            }
        }
    }
    $('weatherRefresh').addEventListener('click', () => show(city));
    $('citySearchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = $('citySearch').value.trim();
        if (query.length < 2) return;
        const token = ++searchRequest;
        $('cityResults').textContent = 'Searching…';
        try {
            const data = await json(
                'https://geocoding-api.open-meteo.com/v1/search?' +
                    new URLSearchParams({
                        name: query,
                        count: '5',
                        language: 'en',
                        format: 'json',
                    }),
            );
            if (token !== searchRequest) return;
            const results = data.results || [];
            $('cityResults').innerHTML = results.length
                ? results
                      .map(
                          (c, i) =>
                              `<button type="button" data-city="${i}">${h([c.name, c.admin1, c.country].filter(Boolean).join(', '))}</button>`,
                      )
                      .join('')
                : 'No cities found.';
            $('cityResults').onclick = async (event) => {
                const button = event.target.closest('[data-city]');
                if (!button || choosing) return;
                const chosen = results[Number(button.dataset.city)];
                if (!chosen) return;
                choosing = true;
                $('cityResults')
                    .querySelectorAll('button')
                    .forEach((b) => (b.disabled = true));
                try {
                    const next = {
                        name: [chosen.name, chosen.country].filter(Boolean).join(', '),
                        latitude: chosen.latitude,
                        longitude: chosen.longitude,
                    };
                    await saveCity(next);
                    $('cityResults').innerHTML = '';
                    $('citySearch').value = '';
                    await show(next);
                } catch (error) {
                    $('weatherMessage').textContent = error.message;
                } finally {
                    choosing = false;
                    $('cityResults')
                        .querySelectorAll('button')
                        .forEach((b) => (b.disabled = false));
                }
            };
        } catch (error) {
            if (token === searchRequest) $('cityResults').textContent = error.message;
        }
    });
    return { show };
}
