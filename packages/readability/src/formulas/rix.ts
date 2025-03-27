/**
 * Calculate the RIX ratio.
 * https://readable.com/readability/lix-rix-readability-formulas/
 * @param params
 */
export function rix(params: { longWords: number; sentences: number }): number {
  const { longWords, sentences } = params;
  if (sentences === 0) {
    return 0;
  }
  return longWords / sentences;
}
