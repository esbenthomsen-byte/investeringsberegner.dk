// renters-rente.js – Standalone compound interest calculator (no tax)

/* ---------- Helpers ---------- */
function formatDKK(n) {
  return Math.round(n).toLocaleString('da-DK') + ' kr';
}

function parseDanish(s) {
  return parseFloat(String(s).replace(/\./g, '').replace(',', '.')) || 0;
}

function setFormatted(input, raw) {
  input.dataset.raw = raw;
  input.value = Math.round(raw).toLocaleString('da-DK');
}

/* ---------- DOM refs ---------- */
const inputStart = document.getElementById('rr-start');
const inputMonthly = document.getElementById('rr-monthly');
const inputPeriod = document.getElementById('rr-period');
const inputRate = document.getElementById('rr-rate');
const rateDisplay = document.getElementById('rr-rate-display');

const resTotal = document.getElementById('rr-res-total');
const resDeposits = document.getElementById('rr-res-deposits');
const resInterest = document.getElementById('rr-res-interest');
const resSimple = document.getElementById('rr-res-simple');
const resBonus = document.getElementById('rr-res-bonus');
const resDouble = document.getElementById('rr-res-double');
const tableBody = document.getElementById('rr-table-body');

/* ---------- Calculation ---------- */
function calculate() {
  const start = parseDanish(inputStart.dataset.raw);
  const monthly = parseDanish(inputMonthly.dataset.raw);
  const years = parseDanish(inputPeriod.dataset.raw);
  const rate = parseFloat(inputRate.value) / 100;
  const monthlyRate = rate / 12;

  // Update slider display
  rateDisplay.textContent = parseFloat(inputRate.value).toLocaleString('da-DK', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';

  const totalMonths = Math.round(years * 12);
  const totalDeposits = start + monthly * totalMonths;

  // Year-by-year calculation
  let balanceCompound = start;
  let balanceSimple = start;
  const rows = [];

  for (let y = 1; y <= years; y++) {
    let yearInterest = 0;
    for (let m = 0; m < 12; m++) {
      const monthInterest = balanceCompound * monthlyRate;
      yearInterest += monthInterest;
      balanceCompound += monthInterest + monthly;
    }
    // Simple interest: interest only on original capital + deposits at start
    const depositsAtYear = start + monthly * y * 12;
    balanceSimple = start * (1 + rate * y) + monthly * 12 * y + monthly * 12 * rate * y * (y - 1) / 2;
    // Simpler: just track it month by month
    rows.push({
      year: y,
      deposits: start + monthly * y * 12,
      interest: yearInterest,
      compound: balanceCompound,
    });
  }

  // Recalculate simple interest properly
  let simpleBalance = start;
  const simpleYearlyRate = rate;
  for (let y = 1; y <= years; y++) {
    const simpleInterest = (start + monthly * (y - 1) * 12) * simpleYearlyRate;
    simpleBalance += monthly * 12 + simpleInterest;
    if (rows[y - 1]) rows[y - 1].simple = simpleBalance;
  }

  // Results
  const finalCompound = balanceCompound;
  const finalSimple = simpleBalance;
  const totalInterest = finalCompound - totalDeposits;
  const bonusFromCompound = finalCompound - finalSimple;

  resTotal.textContent = formatDKK(finalCompound);
  resDeposits.textContent = formatDKK(totalDeposits);
  resInterest.textContent = formatDKK(totalInterest);
  resSimple.textContent = formatDKK(finalSimple);
  resBonus.textContent = formatDKK(Math.max(0, bonusFromCompound));

  // Rule of 72
  if (rate > 0) {
    const doubleYears = 72 / (rate * 100);
    resDouble.textContent = doubleYears.toLocaleString('da-DK', { maximumFractionDigits: 1 }) + ' år';
  } else {
    resDouble.textContent = '∞';
  }

  // Table
  tableBody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.year}</td>
      <td>${formatDKK(r.deposits)}</td>
      <td>${formatDKK(r.interest)}</td>
      <td>${formatDKK(r.compound)}</td>
      <td>${formatDKK(r.simple || 0)}</td>
    </tr>
  `).join('');

  // Chart
  updateChart(rows);
}

/* ---------- Chart ---------- */
let chartInstance = null;

function getChartColors() {
  const style = getComputedStyle(document.documentElement);
  return {
    deposits: style.getPropertyValue('--chart-deposits').trim(),
    depositsBorder: style.getPropertyValue('--chart-deposits-border').trim(),
    line: style.getPropertyValue('--chart-line').trim(),
    lineBg: style.getPropertyValue('--chart-line-bg').trim(),
    grid: style.getPropertyValue('--chart-grid').trim(),
    text: style.getPropertyValue('--chart-text').trim(),
  };
}

function updateChart(rows) {
  if (typeof Chart === 'undefined') {
    const cdnScript = document.querySelector('script[src*="chart.js"]');
    if (cdnScript) {
      cdnScript.addEventListener('load', () => updateChart(rows));
    }
    return;
  }

  const ctx = document.getElementById('rr-chart-canvas');
  const c = getChartColors();
  const labels = rows.map(r => `År ${r.year}`);
  const depositsData = rows.map(r => Math.round(r.deposits));
  const compoundData = rows.map(r => Math.round(r.compound));
  const simpleData = rows.map(r => Math.round(r.simple || 0));

  const config = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Indskud i alt',
          data: depositsData,
          backgroundColor: c.deposits,
          borderColor: c.depositsBorder,
          borderWidth: 1,
          borderRadius: 4,
          order: 3,
        },
        {
          label: 'Renters rente',
          data: compoundData,
          type: 'line',
          borderColor: c.line,
          backgroundColor: c.lineBg,
          fill: true,
          borderWidth: 2.5,
          pointRadius: rows.length > 25 ? 0 : 3,
          pointBackgroundColor: c.line,
          pointHoverRadius: 5,
          tension: 0.35,
          order: 1,
        },
        {
          label: 'Simpel rente',
          data: simpleData,
          type: 'line',
          borderColor: 'rgba(142, 142, 147, 0.6)',
          backgroundColor: 'transparent',
          fill: false,
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.35,
          order: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            font: { size: 12, family: '-apple-system, BlinkMacSystemFont, sans-serif' },
            color: c.text,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,.8)',
          titleFont: { size: 12, family: '-apple-system, BlinkMacSystemFont, sans-serif' },
          bodyFont: { size: 12, family: '-apple-system, BlinkMacSystemFont, sans-serif' },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label(context) {
              const val = context.parsed.y;
              const formatted = Math.round(val).toLocaleString('da-DK');
              return ` ${context.dataset.label}: ${formatted} kr`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            font: { size: 11, family: '-apple-system, BlinkMacSystemFont, sans-serif' },
            color: c.text,
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 15,
          },
        },
        y: {
          beginAtZero: true,
          border: { display: false },
          grid: { color: c.grid, drawTicks: false },
          ticks: {
            font: { size: 11, family: '-apple-system, BlinkMacSystemFont, sans-serif' },
            color: c.text,
            padding: 8,
            callback(value) {
              if (value >= 1_000_000) return (value / 1_000_000).toLocaleString('da-DK') + ' mio';
              if (value >= 1_000) return (value / 1_000).toLocaleString('da-DK') + ' t';
              return value.toLocaleString('da-DK');
            },
          },
        },
      },
    },
  };

  if (chartInstance) {
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = depositsData;
    chartInstance.data.datasets[0].backgroundColor = c.deposits;
    chartInstance.data.datasets[0].borderColor = c.depositsBorder;
    chartInstance.data.datasets[1].data = compoundData;
    chartInstance.data.datasets[1].borderColor = c.line;
    chartInstance.data.datasets[1].backgroundColor = c.lineBg;
    chartInstance.data.datasets[1].pointBackgroundColor = c.line;
    chartInstance.data.datasets[1].pointRadius = rows.length > 25 ? 0 : 3;
    chartInstance.data.datasets[2].data = simpleData;
    chartInstance.options.plugins.legend.labels.color = c.text;
    chartInstance.options.scales.x.ticks.color = c.text;
    chartInstance.options.scales.y.ticks.color = c.text;
    chartInstance.options.scales.y.grid.color = c.grid;
    chartInstance.update('none');
  } else {
    chartInstance = new Chart(ctx, config);
  }
}

/* ---------- Input handling ---------- */
function setupNumberInput(input) {
  const min = input.dataset.min !== undefined ? parseFloat(input.dataset.min) : 0;
  const max = input.dataset.max !== undefined ? parseFloat(input.dataset.max) : Infinity;

  input.addEventListener('focus', () => {
    input.value = input.dataset.raw;
    input.select();
  });

  input.addEventListener('blur', () => {
    let val = parseDanish(input.value);
    val = Math.max(min, Math.min(max, val));
    setFormatted(input, val);
    calculate();
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
  });
}

function setupStepButtons() {
  document.querySelectorAll('.number-input-wrap button[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      const step = parseFloat(btn.dataset.step) || 0;
      const min = input.dataset.min !== undefined ? parseFloat(input.dataset.min) : 0;
      const max = input.dataset.max !== undefined ? parseFloat(input.dataset.max) : Infinity;
      let val = parseDanish(input.dataset.raw) + step;
      val = Math.max(min, Math.min(max, val));
      setFormatted(input, val);
      calculate();
    });
  });
}

/* ---------- Theme toggle ---------- */
function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    // Re-render chart with new colors
    calculate();
  });
}

/* ---------- Debounce ---------- */
let debounceTimer;
function debounce(fn, delay = 50) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fn, delay);
}

/* ---------- Init ---------- */
[inputStart, inputMonthly, inputPeriod].forEach(setupNumberInput);
setupStepButtons();
setupThemeToggle();

inputRate.addEventListener('input', () => debounce(calculate));

// Initial calculation
calculate();
