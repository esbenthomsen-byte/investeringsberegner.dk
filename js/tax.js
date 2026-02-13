// tax.js – Skatteberegning for alle 3 kontotyper
import { TAX } from './constants.js';

/**
 * Frie midler – realisationsbeskatning.
 * Skat betales som lump-sum ved salg (slutningen af perioden).
 * @param {number} totalGain – samlet gevinst (slutværdi minus samlede indskud)
 * @param {boolean} married – gift? (dobbelt progressionsgrænse)
 * @returns {number} skat i kr
 */
export function calcTaxFrieMidler(totalGain, married = false) {
  if (totalGain <= 0) return 0;

  const threshold = married
    ? TAX.frieMidler.thresholdMarried
    : TAX.frieMidler.thresholdSingle;

  if (totalGain <= threshold) {
    return totalGain * TAX.frieMidler.lowRate;
  }

  return (
    threshold * TAX.frieMidler.lowRate +
    (totalGain - threshold) * TAX.frieMidler.highRate
  );
}

/**
 * ASK – lagerbeskatning, 17 % flat.
 * Returnerer skattebeløb for ét år.
 * @param {number} yearGain – årets værdistigning (kan være negativ)
 * @param {number} lossCarryForward – fremført tab fra tidligere år (positiv værdi)
 * @returns {{ tax: number, newLossCarry: number }}
 */
export function calcTaxASK(yearGain, lossCarryForward = 0) {
  const taxableGain = yearGain - lossCarryForward;

  if (taxableGain <= 0) {
    return {
      tax: 0,
      newLossCarry: Math.abs(taxableGain),
    };
  }

  return {
    tax: taxableGain * TAX.ask.rate,
    newLossCarry: 0,
  };
}

/**
 * Pension – PAL-skat, 15,3 % lagerbeskatning.
 * Samme mekanik som ASK, blot lavere sats.
 * @param {number} yearGain – årets værdistigning
 * @param {number} lossCarryForward – fremført tab
 * @returns {{ tax: number, newLossCarry: number }}
 */
export function calcTaxPension(yearGain, lossCarryForward = 0) {
  const taxableGain = yearGain - lossCarryForward;

  if (taxableGain <= 0) {
    return {
      tax: 0,
      newLossCarry: Math.abs(taxableGain),
    };
  }

  return {
    tax: taxableGain * TAX.pension.rate,
    newLossCarry: 0,
  };
}
