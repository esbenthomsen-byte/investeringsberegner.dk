// constants.js – Skattesatser, defaults, labels (2026-tal)

export const TAX = {
  // Frie midler – aktieindkomst (realisationsbeskatning)
  frieMidler: {
    lowRate: 0.27,          // 27 % op til progressionsgrænsen
    highRate: 0.42,         // 42 % over progressionsgrænsen
    thresholdSingle: 79400, // 2026-progressionsgrænse, enlig
    thresholdMarried: 158800, // 2026-progressionsgrænse, gift (dobbelt)
  },

  // Aktiesparekonto – lagerbeskatning
  ask: {
    rate: 0.17,             // 17 % flat
    ceiling: 174200,        // Maks indskud 2026
  },

  // Pensionsmidler – PAL-skat
  pension: {
    rate: 0.153,            // 15,3 % flat
  },
};

export const DEFAULTS = {
  startAmount: 25000,       // Startbeløb (kr)
  monthlyDeposit: 2500,     // Månedlig indbetaling (kr)
  period: 15,               // Investeringsperiode (år)
  annualReturn: 7,          // Forventet afkast (% p.a.)
  annualCost: 0.5,          // Årlige omkostninger (%)
  inflation: 2,             // Inflation (%)
  accountType: 'frieMidler',// Kontotype
  married: false,           // Gift/single (kun frie midler)
};

export const ACCOUNT_LABELS = {
  frieMidler: 'Frie midler',
  ask: 'Aktiesparekonto (ASK)',
  pension: 'Pension (PAL)',
};

export const PARAM_KEYS = {
  startAmount:    's',
  monthlyDeposit: 'm',
  period:         't',
  annualReturn:   'r',
  annualCost:     'c',
  inflation:      'i',
  accountType:    'a',
  married:        'g',
};
