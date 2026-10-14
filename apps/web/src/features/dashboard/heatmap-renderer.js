import { normalizeDailyProgress } from './progress-calculator.js';
export function generateHeatmap(elementId, seed, records = []) {
    const container = document.getElementById(elementId);

    if (!container) return;

    const yearSelector = document.getElementById('yearSelector');
    const year = Number(yearSelector?.value || new Date().getFullYear());
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    container.innerHTML = '';

    const labelsRow = document.createElement('div');
    labelsRow.classList.add('months-row');

    const grid = document.createElement('div');
    grid.classList.add('heatmap-grid');

    const cellSize = 10;
    const gap = 3;
    const shouldShowProgress = Number(seed) > 0 || (Array.isArray(records) && records.length > 0);
    let random = seed;

    function pseudoRandom() {
        random = (random * 9301 + 49297) % 233280;
        return random / 233280;
    }

    const progressByDate = new Map();
    (Array.isArray(records) ? records : []).forEach((record) => {
        const rawDate = record.activity_date || record.date || record.updated_at || '';
        const dateKey = String(rawDate).slice(0, 10);

        if (!dateKey) return;

        const normalized = normalizeDailyProgress(record);
        if (normalized.total > 0 || normalized.completed > 0) {
            progressByDate.set(dateKey, normalized);
        }
    });

    const monthData = monthNames.map((name, monthIndex) => {
        const firstDay = new Date(year, monthIndex, 1);
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const firstWeekday = firstDay.getDay();
        const weeksInMonth = Math.ceil((firstWeekday + daysInMonth) / 7);

        return {
            name,
            monthIndex,
            firstDay,
            daysInMonth,
            firstWeekday,
            weeksInMonth,
        };
    });

    let totalCols = 0;
    monthData.forEach((month) => {
        totalCols += month.weeksInMonth + 1;
    });

    grid.style.setProperty('--cols', totalCols);
    labelsRow.style.width = `${totalCols * (cellSize + gap) - gap}px`;

    let currentColumn = 1;

    monthData.forEach((month) => {
        const monthLabel = document.createElement('span');
        monthLabel.classList.add('month-label');
        monthLabel.textContent = month.name;
        const monthWidth = month.weeksInMonth * (cellSize + gap);
        monthLabel.style.left = `${(currentColumn - 1) * (cellSize + gap) + monthWidth / 2}px`;
        labelsRow.appendChild(monthLabel);

        for (let week = 0; week < month.weeksInMonth; week++) {
            for (let day = 0; day < 7; day++) {
                const date = new Date(
                    year,
                    month.monthIndex,
                    1 + week * 7 + day - month.firstWeekday,
                );
                const isCurrentMonth =
                    date.getFullYear() === year && date.getMonth() === month.monthIndex;

                if (!isCurrentMonth) {
                    continue;
                }

                const cell = document.createElement('div');
                cell.classList.add('heat-cell');
                cell.style.gridColumn = String(currentColumn + week);
                cell.style.gridRow = String(day + 1);

                const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                const dailyProgress = progressByDate.get(dateKey) || null;

                if (!dailyProgress || dailyProgress.total <= 0) {
                    cell.classList.add('heat-empty');
                    cell.title = `${date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} · 0/0 exercises`;
                    grid.appendChild(cell);
                    continue;
                }

                let level = 0;
                if (dailyProgress.ratio >= 0.75) {
                    level = 4;
                } else if (dailyProgress.ratio >= 0.5) {
                    level = 3;
                } else if (dailyProgress.ratio >= 0.25) {
                    level = 2;
                } else if (dailyProgress.ratio > 0) {
                    level = 1;
                }

                if (level > 0) {
                    cell.classList.add(`level-${level}`);
                } else {
                    cell.classList.add('heat-empty');
                }

                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });

                cell.title = `${formattedDate} · ${dailyProgress.completed}/${dailyProgress.total} exercises`;
                grid.appendChild(cell);
            }
        }

        currentColumn += month.weeksInMonth + 1;
    });

    if (!shouldShowProgress && !records.length) {
        const allCells = grid.querySelectorAll('.heat-cell');
        allCells.forEach((cell) => {
            cell.classList.add('heat-empty');
        });
    }

    container.appendChild(labelsRow);
    container.appendChild(grid);
}
