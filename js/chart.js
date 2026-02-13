// chart.js – Chart.js init + update (dark mode aware)

let chartInstance = null;
let pendingData = null;

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

/**
 * Initialiser eller opdater Chart.js diagrammet.
 * @param {Array} years – array af year-objects fra simulate()
 */
export function updateChart(years) {
  // Chart.js loaded async – if not ready yet, queue data and retry
  if (typeof Chart === 'undefined') {
    pendingData = years;
    return;
  }

  const ctx = document.getElementById('chart-canvas');
  const c = getChartColors();

  const labels = years.map(y => `År ${y.year}`);
  const depositsData = years.map(y => Math.round(y.deposits));
  const balanceData = years.map(y => Math.round(y.balance));

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
          order: 2,
        },
        {
          label: 'Porteføljeværdi',
          data: balanceData,
          type: 'line',
          borderColor: c.line,
          backgroundColor: c.lineBg,
          fill: true,
          borderWidth: 2.5,
          pointRadius: years.length > 25 ? 0 : 3,
          pointBackgroundColor: c.line,
          pointHoverRadius: 5,
          tension: 0.35,
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
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
          grid: {
            color: c.grid,
            drawTicks: false,
          },
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
    // Update colors in case theme changed
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = depositsData;
    chartInstance.data.datasets[0].backgroundColor = c.deposits;
    chartInstance.data.datasets[0].borderColor = c.depositsBorder;
    chartInstance.data.datasets[1].data = balanceData;
    chartInstance.data.datasets[1].borderColor = c.line;
    chartInstance.data.datasets[1].backgroundColor = c.lineBg;
    chartInstance.data.datasets[1].pointBackgroundColor = c.line;
    chartInstance.data.datasets[1].pointRadius = years.length > 25 ? 0 : 3;
    chartInstance.options.plugins.legend.labels.color = c.text;
    chartInstance.options.scales.x.ticks.color = c.text;
    chartInstance.options.scales.y.ticks.color = c.text;
    chartInstance.options.scales.y.grid.color = c.grid;
    chartInstance.update('none');
  } else {
    chartInstance = new Chart(ctx, config);
  }
}

// When Chart.js finishes async load, render any queued data
if (typeof Chart === 'undefined') {
  const cdnScript = document.querySelector('script[src*="chart.js"]');
  if (cdnScript) {
    cdnScript.addEventListener('load', () => {
      if (pendingData) {
        updateChart(pendingData);
        pendingData = null;
      }
    });
  }
}
