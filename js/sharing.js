// sharing.js – URL-hash encoding, localStorage scenarios, email, clipboard
import { PARAM_KEYS, DEFAULTS } from './constants.js';

const STORAGE_KEY = 'investeringsberegner_scenarios';

// ============================================================
// URL Hash
// ============================================================

/**
 * Byg parametre ud fra current inputs.
 * @param {Function} getParams – returnerer current params object
 * @returns {string} hash string (uden #)
 */
export function buildHash(params) {
  const parts = [];
  for (const [key, short] of Object.entries(PARAM_KEYS)) {
    let val = params[key];
    if (val === undefined || val === null) continue;
    if (typeof val === 'boolean') val = val ? 1 : 0;
    parts.push(`${short}=${encodeURIComponent(val)}`);
  }
  return parts.join('&');
}

/**
 * Parsér URL-hash til params object.
 * @returns {Object|null} params eller null hvis intet hash
 */
export function parseHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;

  const map = {};
  for (const part of hash.split('&')) {
    const [k, v] = part.split('=');
    if (k && v !== undefined) map[k] = decodeURIComponent(v);
  }

  // Reverse mapping: short key -> full key
  const reverseKeys = {};
  for (const [full, short] of Object.entries(PARAM_KEYS)) {
    reverseKeys[short] = full;
  }

  const params = {};
  for (const [short, val] of Object.entries(map)) {
    const fullKey = reverseKeys[short];
    if (!fullKey) continue;

    if (fullKey === 'married') {
      params[fullKey] = val === '1' || val === 'true';
    } else if (fullKey === 'accountType') {
      params[fullKey] = val;
    } else {
      const num = parseFloat(val);
      if (!isNaN(num)) params[fullKey] = num;
    }
  }

  return Object.keys(params).length > 0 ? params : null;
}

/**
 * Opdater URL hash uden at trigge navigation.
 */
export function updateHash(params) {
  const hash = buildHash(params);
  history.replaceState(null, '', '#' + hash);
}

// ============================================================
// Clipboard
// ============================================================

/**
 * Kopiér aktuel URL til clipboard.
 * @param {HTMLButtonElement} btn – knappen der blev klikket (til feedback)
 */
export async function copyLink(btn) {
  try {
    await navigator.clipboard.writeText(window.location.href);
    const original = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Kopieret!`;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = original;
    }, 2000);
  } catch {
    // Fallback: select from a temporary input
    const input = document.createElement('input');
    input.value = window.location.href;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}

// ============================================================
// Email
// ============================================================

/**
 * Åbn email-klient med forudfyldt link.
 */
export function sendEmail() {
  const subject = encodeURIComponent('Min investeringsberegning');
  const body = encodeURIComponent(
    'Se min investeringsberegning:\n\n' + window.location.href
  );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// ============================================================
// localStorage Scenarios
// ============================================================

/**
 * Hent alle gemte scenarier.
 * @returns {Object} { name: params, ... }
 */
export function getScenarios() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Gem et scenario.
 * @param {string} name
 * @param {Object} params
 */
export function saveScenario(name, params) {
  const scenarios = getScenarios();
  scenarios[name] = params;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
}

/**
 * Slet et scenario.
 * @param {string} name
 */
export function deleteScenario(name) {
  const scenarios = getScenarios();
  delete scenarios[name];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
}

/**
 * Opdater <select> med gemte scenarier.
 */
export function refreshScenarioSelect() {
  const select = document.getElementById('scenario-select');
  const scenarios = getScenarios();
  const names = Object.keys(scenarios);

  // Keep first option, remove rest
  while (select.options.length > 1) select.remove(1);

  for (const name of names) {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  }
}
