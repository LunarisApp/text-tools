const BASE_COEF = -3.407;
const SENTENCE_PER_WORDS_COEF = -0.205;
const SYLLABLES_PER_WORDS_COEF = 0.049;

/**
 * Calculate Crawford's formula for text (Spanish only).
 * https://www.spanishreadability.com/the-crawford-score-for-spanish-texts
 */
export function crawford(params: {
  words: number;
  sentences: number;
  syllables: number;
}) {
  const { words, sentences, syllables } = params;
  try {
    const sentencesPerWords = 100 * (sentences / words);
    const syllablesPerWords = 100 * (syllables / words);
    return (
      SENTENCE_PER_WORDS_COEF * sentencesPerWords +
      SYLLABLES_PER_WORDS_COEF * syllablesPerWords +
      BASE_COEF
    );
  } catch {
    return 0;
  }
}
