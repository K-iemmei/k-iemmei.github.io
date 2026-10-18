import { escapeHtml as h } from '../../shared/escape-html.js';
const $ = (id) => document.getElementById(id);
const conditions = (code) =>
    !Number.isFinite(code)
        ? 'Forecast unavailable'
        : code === 0
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
export function forecastDays(daily) {
    return (daily?.time || [])
        .slice(1, 4)
        .map((date, offset) => {
            const i = offset + 1;
            return {
                date,
                low: Math.round(daily.temperature_2m_min?.[i]),
                high: Math.round(daily.temperature_2m_max?.[i]),
                code: daily.weather_code?.[i],
                rain: daily.precipitation_probability_max?.[i],
            };
        })
        .filter(
            (day) =>
                /^\d{4}-\d{2}-\d{2}$/.test(day.date) &&
                Number.isFinite(day.low) &&
                Number.isFinite(day.high),
        );
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
                daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
                timezone: 'auto',
                forecast_days: '4',
            });
            const d = await json('https://api.open-meteo.com/v1/forecast?' + params);
            if (token !== request) return;
            const days = forecastDays(d.daily);
            if (days.length !== 3) throw new Error('Forecast unavailable. Please retry.');
            $('weatherContent').innerHTML =
                `<h3 class="weather-city">${h(city.name)}</h3><p class="forecast-caption">Next 3 days</p><div class="weather-days">${days.map((day) => `<div><time datetime="${h(day.date)}">${h(new Date(day.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }))}</time><span class="forecast-condition">${h(conditions(day.code))}</span><strong>${day.low}° <span>/</span> ${day.high}°</strong><span>Rain ${h(day.rain ?? '—')}%</span></div>`).join('')}</div>`;
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
