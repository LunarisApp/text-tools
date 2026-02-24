export const VARIANTS = {
  1: {
    ms: 0.1935,
    sl: 0.1672,
    iw: 0.1297,
    es: -0.0327,
    base: -0.875,
  },
  2: {
    ms: 0.2007,
    sl: 0.1682,
    iw: 0.1373,
    es: 0,
    base: -2.779,
  },
  3: {
    ms: 0.2963,
    sl: 0.1905,
    iw: 0,
    es: 0,
    base: -1.1144,
  },
  4: {
    ms: 0.2744,
    sl: 0.2656,
    iw: 0,
    es: 0,
    base: -1.693,
  },
};

export type WienerSachtextformelVariant = keyof typeof VARIANTS;

/**
 * Calculate the Wiener Sachtextformel for text (german).
 * https://de.wikipedia.org/wiki/Lesbarkeitsindex#Wiener_Sachtextformel
 */
export function wienerSachtextformel(params: {
  words: number;
  sentences: number;
  longWords: number;
  polysyllables: number;
  monosyllables: number;
  variant: WienerSachtextformelVariant;
}) {
  const { words, sentences, longWords, polysyllables, monosyllables, variant } =
    params;
  const { ms, sl, iw, es, base } = VARIANTS[variant];

  const msVal = (100 * polysyllables) / words;
  const slVal = words / sentences;
  const iwVal = (100 * longWords) / words;
  const esVal = (100 * monosyllables) / words;

  return base + ms * msVal + sl * slVal + iw * iwVal + es * esVal;
}
