const DEFAULT_BASE_COEF = 206.835;
const DEFAULT_SENTENCES_COEF = 1.015;
const DEFAULT_SYLLABLES_PER_WORD_COEF = 84.6;

/**
 * Calculate the Flesch reading ease test for text.
 * https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch_reading_ease
 */
export function fleschReadingEase(params: {
  sentences: number;
  syllablesPerWord: number;
  coefficients?: {
    base?: number;
    sentences?: number;
    syllablesPerWord?: number;
  };
}) {
  const { sentences, syllablesPerWord, coefficients } = params;
  const {
    base: baseCoef = DEFAULT_BASE_COEF,
    sentences: sentencesCoef = DEFAULT_SENTENCES_COEF,
    syllablesPerWord: syllablesPerWordCoef = DEFAULT_SYLLABLES_PER_WORD_COEF,
  } = coefficients ?? {};
  return (
    baseCoef -
    sentencesCoef * sentences -
    syllablesPerWordCoef * syllablesPerWord
  );
}
