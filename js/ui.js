// ui.js – DOM-opdatering, number formatting

/**
 * Formatér tal med dansk notation (punkt som tusindtalsseparator, komma som decimal).
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export function formatDKK(value, decimals = 0) {
  return Math.round(value).toLocaleString('da-DK', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formatér procent med komma-decimal.
 */
export function formatPct(value, decimals = 1) {
  return value.toLocaleString('da-DK', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) + ' %';
}

/**
 * Parsér dansk talformat (fjern punkter, erstat komma med punktum).
 * @param {string} str
 * @returns {number}
 */
export function parseDanishNumber(str) {
  if (!str) return 0;
  const cleaned = str.replace(/\./g, '').replace(/,/g, '.').replace(/[^\d.\-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Opdater et number-input felt med formateret visning.
 * @param {HTMLInputElement} input
 * @param {number} rawValue
 */
export function setNumberInput(input, rawValue) {
  input.dataset.raw = String(rawValue);
  // Don't format if input is focused (user is typing)
  if (document.activeElement !== input) {
    input.value = formatDKK(rawValue);
  }
}

/**
 * Opdater resultaterne i DOM'en.
 * @param {Object} result – fra simulate()
 * @param {string} accountType
 */
export function renderResults(result) {
  document.getElementById('res-total').textContent = formatDKK(result.finalValueAfterTax) + ' kr';
  document.getElementById('res-deposits').textContent = formatDKK(result.totalDeposits) + ' kr';
  document.getElementById('res-gain').textContent = formatDKK(result.finalValueAfterTax - result.totalDeposits) + ' kr';
  document.getElementById('res-tax').textContent = formatDKK(result.totalTaxPaid) + ' kr';
  document.getElementById('res-real').textContent = formatDKK(result.realValue) + ' kr';
  document.getElementById('res-cost').textContent = formatDKK(result.costLoss) + ' kr';

  // Farve på afkast
  const gainEl = document.getElementById('res-gain');
  const gainValue = result.finalValueAfterTax - result.totalDeposits;
  gainEl.className = 'value ' + (gainValue >= 0 ? 'positive' : 'negative');

  // Skat-undertekst
  const taxSub = document.getElementById('res-tax-sub');
  taxSub.textContent = result.finalTax > 0
    ? 'Betales ved salg (realisationsbeskatning)'
    : 'Trukket løbende (lagerbeskatning)';
}

/**
 * Opdater år-for-år tabellen.
 * @param {Array} years
 */
export function renderTable(years) {
  const tbody = document.getElementById('table-body');
  let html = '';

  for (const row of years) {
    html += `<tr>
      <td>${row.year}</td>
      <td>${formatDKK(row.deposits)} kr</td>
      <td>${formatDKK(row.yearGain)} kr</td>
      <td>${formatDKK(row.yearTax)} kr</td>
      <td>${formatDKK(row.balance)} kr</td>
    </tr>`;
  }

  tbody.innerHTML = html;
}

/**
 * Opdater slider-display.
 */
export function updateSliderDisplay(sliderId, displayId) {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(displayId);
  display.textContent = formatPct(parseFloat(slider.value));
}

/**
 * Vis/skjul married toggle baseret på kontotype.
 */
export function toggleMarriedVisibility(accountType) {
  const group = document.getElementById('married-group');
  group.style.display = accountType === 'frieMidler' ? '' : 'none';
}

/**
 * Vis/skjul ASK-advarsel.
 */
export function toggleASKWarning(accountType, totalDeposits) {
  const warning = document.getElementById('ask-warning');
  if (accountType === 'ask' && totalDeposits > 174200) {
    warning.classList.add('visible');
  } else {
    warning.classList.remove('visible');
  }
}
