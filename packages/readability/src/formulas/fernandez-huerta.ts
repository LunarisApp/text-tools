const BASE = 206.84;
const SYLLABLES_PER_WORD_COEF = -60;
const WORDS_PER_SENTENCE_COEF = -1.02;

/**
 * Calculate the Fernandez Huerta readability formula for text (Spanish only).
 * https://www.spanishreadability.com/the-fernandez-huerta-readability-formula
 */
export function fernandezHuerta(params: {
  words: number;
  sentences: number;
  syllables: number;
}) {
  const { words, sentences, syllables } = params;
  if (words === 0) {
    return 0;
  }
  const avgSyllablesPerWord = syllables / words;
  const avgWordsPerSentence = words / sentences;
  return (
    BASE +
    SYLLABLES_PER_WORD_COEF * avgSyllablesPerWord +
    WORDS_PER_SENTENCE_COEF * avgWordsPerSentence
  );
}
