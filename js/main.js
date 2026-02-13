// main.js – Entry point: imports, event listeners, init
import { simulate, solveMonthlyDeposit } from './calculator.js';
import {
  formatDKK,
  parseDanishNumber,
  setNumberInput,
  renderResults,
  renderTable,
  updateSliderDisplay,
  toggleMarriedVisibility,
  toggleASKWarning,
} from './ui.js';
import { updateChart } from './chart.js';
import {
  parseHash,
  updateHash,
  copyLink,
  sendEmail,
  getScenarios,
  saveScenario,
  deleteScenario,
  refreshScenarioSelect,
} from './sharing.js';

// ============================================================
// DOM refs
// ============================================================
const inputStart    = document.getElementById('input-start');
const inputMonthly  = document.getElementById('input-monthly');
const inputPeriod   = document.getElementById('input-period');
const inputReturn   = document.getElementById('input-return');
const inputCost     = document.getElementById('input-cost');
const inputInflation = document.getElementById('input-inflation');
const inputMarried  = document.getElementById('input-married');
const inputGoal     = document.getElementById('input-goal');
const accountRadios = document.querySelectorAll('input[name="accountType"]');
const modeRadios    = document.querySelectorAll('input[name="calcMode"]');

// ============================================================
// State
// ============================================================
let debounceTimer = null;

function getAccountType() {
  for (const r of accountRadios) {
    if (r.checked) return r.value;
  }
  return 'frieMidler';
}

function getCalcMode() {
  for (const r of modeRadios) {
    if (r.checked) return r.value;
  }
  return 'return';
}

/**
 * Læs alle input-værdier og returner params object.
 */
function getParams() {
  return {
    startAmount:    parseFloat(inputStart.dataset.raw) || 0,
    monthlyDeposit: parseFloat(inputMonthly.dataset.raw) || 0,
    period:         parseFloat(inputPeriod.dataset.raw) || 1,
    annualReturn:   parseFloat(inputReturn.value) / 100,
    annualCost:     parseFloat(inputCost.value) / 100,
    inflation:      parseFloat(inputInflation.value) / 100,
    accountType:    getAccountType(),
    married:        inputMarried.checked,
  };
}

/**
 * Sæt alle inputs fra et params object.
 */
function setParams(params) {
  if (params.startAmount !== undefined) setNumberInput(inputStart, params.startAmount);
  if (params.monthlyDeposit !== undefined) setNumberInput(inputMonthly, params.monthlyDeposit);
  if (params.period !== undefined) setNumberInput(inputPeriod, params.period);
  if (params.annualReturn !== undefined) {
    inputReturn.value = params.annualReturn;
  }
  if (params.annualCost !== undefined) {
    inputCost.value = params.annualCost;
  }
  if (params.inflation !== undefined) {
    inputInflation.value = params.inflation;
  }
  if (params.accountType) {
    for (const r of accountRadios) {
      r.checked = r.value === params.accountType;
    }
  }
  if (params.married !== undefined) {
    inputMarried.checked = params.married;
  }

  // Update slider displays
  updateSliderDisplay('input-return', 'return-display');
  updateSliderDisplay('input-cost', 'cost-display');
  updateSliderDisplay('input-inflation', 'inflation-display');
}

// ============================================================
// Main calculation + render
// ============================================================
function recalculate() {
  const mode = getCalcMode();
  const params = getParams();

  // UI toggles
  toggleMarriedVisibility(params.accountType);
  toggleModeUI(mode);

  const goalResultEl = document.getElementById('goal-result');
  const goalValueEl = document.getElementById('goal-monthly-result');
  const goalSubEl = document.getElementById('goal-monthly-sub');

  if (mode === 'goal') {
    // Goal mode: solve for monthly deposit
    const target = parseFloat(inputGoal.dataset.raw) || 0;
    const monthly = solveMonthlyDeposit(params, target);

    // Show goal result
    goalResultEl.classList.add('visible');
    goalValueEl.textContent = formatDKK(monthly) + ' kr/md';
    goalSubEl.textContent = `for at nå ${formatDKK(target)} kr efter skat på ${Math.round(params.period)} år`;

    // Run full simulation with solved monthly for the chart/table/results
    const fullParams = { ...params, monthlyDeposit: monthly };
    const result = simulate(fullParams);

    const totalDeposits = fullParams.startAmount + monthly * 12 * fullParams.period;
    toggleASKWarning(fullParams.accountType, totalDeposits);

    renderResults(result);
    renderTable(result.years);
    updateChart(result.years);

    updateHash({
      startAmount:    params.startAmount,
      monthlyDeposit: monthly,
      period:         params.period,
      annualReturn:   parseFloat(inputReturn.value),
      annualCost:     parseFloat(inputCost.value),
      inflation:      parseFloat(inputInflation.value),
      accountType:    params.accountType,
      married:        params.married,
    });
  } else {
    // Normal mode
    goalResultEl.classList.remove('visible');

    const totalDeposits = params.startAmount + params.monthlyDeposit * 12 * params.period;
    toggleASKWarning(params.accountType, totalDeposits);

    const result = simulate(params);

    renderResults(result);
    renderTable(result.years);
    updateChart(result.years);

    updateHash({
      startAmount:    params.startAmount,
      monthlyDeposit: params.monthlyDeposit,
      period:         params.period,
      annualReturn:   parseFloat(inputReturn.value),
      annualCost:     parseFloat(inputCost.value),
      inflation:      parseFloat(inputInflation.value),
      accountType:    params.accountType,
      married:        params.married,
    });
  }
}

/**
 * Vis/skjul felter baseret på mode.
 */
function toggleModeUI(mode) {
  const goalGroup = document.getElementById('goal-group');
  const monthlyGroup = document.getElementById('monthly-group');
  if (mode === 'goal') {
    goalGroup.style.display = '';
    monthlyGroup.style.display = 'none';
  } else {
    goalGroup.style.display = 'none';
    monthlyGroup.style.display = '';
  }
}

function debouncedRecalculate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(recalculate, 50);
}

// ============================================================
// Number input handling
// ============================================================
function setupNumberInput(input) {
  // On focus: show raw number for editing
  input.addEventListener('focus', () => {
    const raw = parseFloat(input.dataset.raw) || 0;
    input.value = raw === 0 ? '' : String(raw);
    input.select();
  });

  // On blur: format back to Danish display
  input.addEventListener('blur', () => {
    const raw = parseDanishNumber(input.value);
    const min = input.dataset.min !== undefined ? parseFloat(input.dataset.min) : 0;
    const max = input.dataset.max ? parseFloat(input.dataset.max) : Infinity;
    const clamped = Math.max(min, Math.min(max, raw));
    setNumberInput(input, clamped);
    debouncedRecalculate();
  });

  // On input: update raw value live
  input.addEventListener('input', () => {
    const raw = parseDanishNumber(input.value);
    input.dataset.raw = String(raw);
    debouncedRecalculate();
  });

  // On Enter: blur
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur();
    }
  });
}

// Stepper buttons (+/-)
function setupStepperButtons() {
  document.querySelectorAll('.number-input-wrap button[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const step = parseFloat(btn.dataset.step) || 0;
      const raw = parseFloat(target.dataset.raw) || 0;
      const min = target.dataset.min !== undefined ? parseFloat(target.dataset.min) : 0;
      const max = target.dataset.max ? parseFloat(target.dataset.max) : Infinity;
      const newVal = Math.max(min, Math.min(max, raw + step));
      setNumberInput(target, newVal);
      debouncedRecalculate();
    });
  });
}

// ============================================================
// Slider handling
// ============================================================
function setupSliders() {
  const sliders = [
    { id: 'input-return', display: 'return-display' },
    { id: 'input-cost', display: 'cost-display' },
    { id: 'input-inflation', display: 'inflation-display' },
  ];

  for (const { id, display } of sliders) {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      updateSliderDisplay(id, display);
      debouncedRecalculate();
    });
  }
}

// ============================================================
// Account type & married toggle
// ============================================================
function setupAccountType() {
  accountRadios.forEach(r => {
    r.addEventListener('change', debouncedRecalculate);
  });

  inputMarried.addEventListener('change', debouncedRecalculate);
}

// ============================================================
// Share & Scenario buttons
// ============================================================
function setupSharing() {
  document.getElementById('btn-copy-link').addEventListener('click', (e) => {
    copyLink(e.currentTarget);
  });

  document.getElementById('btn-email').addEventListener('click', sendEmail);

  // Save scenario
  document.getElementById('btn-save-scenario').addEventListener('click', () => {
    const name = prompt('Navngiv dette scenario:');
    if (!name || !name.trim()) return;

    saveScenario(name.trim(), {
      startAmount:    parseFloat(inputStart.dataset.raw) || 0,
      monthlyDeposit: parseFloat(inputMonthly.dataset.raw) || 0,
      period:         parseFloat(inputPeriod.dataset.raw) || 1,
      annualReturn:   parseFloat(inputReturn.value),
      annualCost:     parseFloat(inputCost.value),
      inflation:      parseFloat(inputInflation.value),
      accountType:    getAccountType(),
      married:        inputMarried.checked,
    });

    refreshScenarioSelect();
  });

  // Delete scenario
  document.getElementById('btn-delete-scenario').addEventListener('click', () => {
    const select = document.getElementById('scenario-select');
    const name = select.value;
    if (!name) return;
    deleteScenario(name);
    refreshScenarioSelect();
  });

  // Load scenario
  document.getElementById('scenario-select').addEventListener('change', (e) => {
    const name = e.target.value;
    if (!name) return;
    const scenarios = getScenarios();
    if (scenarios[name]) {
      setParams(scenarios[name]);
      recalculate();
    }
  });
}

// ============================================================
// Dark mode toggle
// ============================================================
function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (window.__themeToggleReady) {
    // Inline script already handles theme switching; just re-render chart on click
    btn.addEventListener('click', () => recalculate());
  } else {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      recalculate();
    });
  }
}

// ============================================================
// Init
// ============================================================
function init() {
  // Setup number inputs
  setupNumberInput(inputStart);
  setupNumberInput(inputMonthly);
  setupNumberInput(inputPeriod);
  setupNumberInput(inputGoal);

  // Setup sliders
  setupSliders();

  // Setup mode toggle
  modeRadios.forEach(r => {
    r.addEventListener('change', debouncedRecalculate);
  });

  // Setup account type and married
  setupAccountType();

  // Setup stepper buttons
  setupStepperButtons();

  // Setup sharing
  setupSharing();
  refreshScenarioSelect();

  // Setup theme toggle
  setupThemeToggle();

  // Load from URL hash if present
  const hashParams = parseHash();
  if (hashParams) {
    setParams(hashParams);
  }

  // Initial calculation
  recalculate();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
