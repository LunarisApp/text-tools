const BASE_COEF = 95.2;
const WORDS_PER_SENTENCES_COEF = -0.35;
const LETTERS_PER_WORDS_COEF = -9.7;

/**
 * Calculate Gutierrez Polini's readability formula for text (Spanish only).
 * https://www.spanishreadability.com/gutierrez-de-polinis-readability-formula
 */
export function gutierrezPolini(params: {
  words: number;
  sentences: number;
  letters: number;
}) {
  const { words, sentences, letters } = params;
  if (words === 0 || sentences === 0) {
    return 0;
  }
  const wordsPerSentences = words / sentences;
  const lettersPerWords = letters / words;
  return (
    BASE_COEF +
    WORDS_PER_SENTENCES_COEF * wordsPerSentences +
    LETTERS_PER_WORDS_COEF * lettersPerWords
  );
}
