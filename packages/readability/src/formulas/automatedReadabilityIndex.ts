const BASE_COEF = -21.43;
const CHARS_PER_WORDS_COEF = 4.71;
const WORDS_PER_SENTENCES_COEF = 0.5;

/**
 * Calculate the automated readability index for text.
 * https://en.wikipedia.org/wiki/Automated_readability_index
 */
export function automatedReadabilityIndex(params: {
  chars: number;
  words: number;
  sentences: number;
}) {
  const { chars, words, sentences } = params;
  try {
    return (
      CHARS_PER_WORDS_COEF * (chars / words) +
      WORDS_PER_SENTENCES_COEF * (words / sentences) +
      BASE_COEF
    );
  } catch {
    return 0;
  }
}
