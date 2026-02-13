// calculator.js – Simuleringsmotor (year-by-year loop)
import { calcTaxFrieMidler, calcTaxASK, calcTaxPension } from './tax.js';

/**
 * Simulerer en investering år-for-år.
 *
 * @param {Object} params
 * @param {number} params.startAmount      – Startbeløb (kr)
 * @param {number} params.monthlyDeposit   – Månedlig indbetaling (kr)
 * @param {number} params.period           – Antal år
 * @param {number} params.annualReturn     – Forventet afkast (decimal, f.eks. 0.07)
 * @param {number} params.annualCost       – Årlige omkostninger (decimal, f.eks. 0.005)
 * @param {number} params.inflation        – Inflation (decimal, f.eks. 0.02)
 * @param {string} params.accountType      – 'frieMidler' | 'ask' | 'pension'
 * @param {boolean} params.married         – Gift? (kun relevant for frie midler)
 *
 * @returns {Object} simulation results
 */
export function simulate({
  startAmount,
  monthlyDeposit,
  period,
  annualReturn,
  annualCost,
  inflation,
  accountType,
  married,
}) {
  const netReturn = annualReturn - annualCost; // netto-afkast efter ÅOP
  const years = [];

  let balance = startAmount;
  let totalDeposits = startAmount;
  let totalTaxPaid = 0;
  let lossCarry = 0;

  for (let year = 1; year <= period; year++) {
    const yearDeposits = monthlyDeposit * 12;
    const startOfYear = balance;

    // Tilføj månedlige indbetalinger jævnt over året (simplificeret: midtvejs)
    // For mere præcision: vi antager indbetalinger sker primo hver måned
    // Approksimation: beløb indbetalt ved årets start + halvdelen af årets indbetalinger får fuldt afkast
    // Bedre approksimation: compound monthly
    let endOfYear = startOfYear;
    for (let m = 0; m < 12; m++) {
      endOfYear = (endOfYear + monthlyDeposit) * (1 + netReturn / 12);
    }

    const yearGain = endOfYear - startOfYear - yearDeposits;
    totalDeposits += yearDeposits;

    let yearTax = 0;

    if (accountType === 'ask') {
      const result = calcTaxASK(yearGain, lossCarry);
      yearTax = result.tax;
      lossCarry = result.newLossCarry;
      endOfYear -= yearTax; // Skat trækkes fra kontoen
    } else if (accountType === 'pension') {
      const result = calcTaxPension(yearGain, lossCarry);
      yearTax = result.tax;
      lossCarry = result.newLossCarry;
      endOfYear -= yearTax; // Skat trækkes fra kontoen
    }
    // frieMidler: ingen skat undervejs

    totalTaxPaid += yearTax;
    balance = endOfYear;

    years.push({
      year,
      deposits: totalDeposits,
      yearGain,
      yearTax,
      balance: endOfYear,
    });
  }

  // Frie midler: beregn skat ved salg til sidst
  let finalTax = 0;
  if (accountType === 'frieMidler') {
    const totalGain = balance - totalDeposits;
    finalTax = calcTaxFrieMidler(totalGain, married);
    totalTaxPaid = finalTax;
  }

  const finalValueAfterTax = balance - finalTax;

  // Inflationsjusteret
  const inflationFactor = Math.pow(1 + inflation, period);
  const realValue = finalValueAfterTax / inflationFactor;

  // Beregn "tabt til omkostninger" – simuler uden omkostninger
  const noCostResult = simulateNoCost({
    startAmount,
    monthlyDeposit,
    period,
    annualReturn,
    inflation,
    accountType,
    married,
  });
  const costLoss = noCostResult - finalValueAfterTax;

  return {
    years,
    totalDeposits,
    finalBalance: balance,
    finalTax,
    totalTaxPaid,
    finalValueAfterTax,
    realValue,
    costLoss,
    inflationFactor,
  };
}

/**
 * Omvendt beregner: find den månedlige indbetaling der giver et givent målbeløb.
 * Bruger bisection (binary search) fordi lukket formel ikke findes med skat.
 *
 * @param {Object} params – samme som simulate(), men uden monthlyDeposit
 * @param {number} targetAfterTax – ønsket slutværdi efter skat
 * @returns {number} nødvendig månedlig indbetaling (afrundet til hele kr)
 */
export function solveMonthlyDeposit(params, targetAfterTax) {
  // Edge case: target is less than or equal to start amount grown
  const testZero = simulate({ ...params, monthlyDeposit: 0 });
  if (testZero.finalValueAfterTax >= targetAfterTax) return 0;

  let lo = 0;
  let hi = 1000000; // 1 mio pr. måned som øvre grænse

  // Expand upper bound if needed
  let testHi = simulate({ ...params, monthlyDeposit: hi });
  while (testHi.finalValueAfterTax < targetAfterTax && hi < 1e9) {
    hi *= 2;
    testHi = simulate({ ...params, monthlyDeposit: hi });
  }

  // Bisection: 50 iterations gives precision < 1 kr
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const result = simulate({ ...params, monthlyDeposit: mid });
    if (result.finalValueAfterTax < targetAfterTax) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return Math.ceil(hi);
}

/**
 * Simpel simulering uden omkostninger – bruges til at beregne "tabt til omkostninger".
 */
function simulateNoCost({ startAmount, monthlyDeposit, period, annualReturn, inflation, accountType, married }) {
  let balance = startAmount;
  let totalDeposits = startAmount;
  let lossCarry = 0;

  for (let year = 1; year <= period; year++) {
    const yearDeposits = monthlyDeposit * 12;
    const startOfYear = balance;

    let endOfYear = startOfYear;
    for (let m = 0; m < 12; m++) {
      endOfYear = (endOfYear + monthlyDeposit) * (1 + annualReturn / 12);
    }

    const yearGain = endOfYear - startOfYear - yearDeposits;
    totalDeposits += yearDeposits;

    if (accountType === 'ask') {
      const result = calcTaxASK(yearGain, lossCarry);
      lossCarry = result.newLossCarry;
      endOfYear -= result.tax;
    } else if (accountType === 'pension') {
      const result = calcTaxPension(yearGain, lossCarry);
      lossCarry = result.newLossCarry;
      endOfYear -= result.tax;
    }

    balance = endOfYear;
  }

  let finalTax = 0;
  if (accountType === 'frieMidler') {
    finalTax = calcTaxFrieMidler(balance - totalDeposits, married);
  }

  return balance - finalTax;
}
