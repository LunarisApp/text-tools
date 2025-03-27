/**
 * Calculate the LIX ratio.
 * https://readable.com/readability/lix-rix-readability-formulas/
 * @param params
 */
export function lix(params: {
  words: number;
  longWords: number;
  wordsPerSentence: number;
}): number {
  const { words, longWords, wordsPerSentence } = params;
  if (words === 0) {
    return 0;
  }
  const ratio = (longWords * 100) / words;
  return wordsPerSentence + ratio;
}
