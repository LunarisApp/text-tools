const BASE_COEF = 3.1291;
const POLY_COEF = 1.043;
const POLY_MULT = 30;

/**
 * Calculate the SMOG index for text.
 * https://en.wikipedia.org/wiki/SMOG
 */
export function smogIndex(params: {
  sentences: number;
  polysyllables: number;
}) {
  const { sentences, polysyllables } = params;
  return (
    POLY_COEF * Math.sqrt((polysyllables * POLY_MULT) / sentences) + BASE_COEF
  );
}
