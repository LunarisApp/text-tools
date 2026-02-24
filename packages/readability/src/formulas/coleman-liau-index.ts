const BASE_COEF = -15.8;
const LETTERS_COEF = 0.058;
const SENTENCES_COEF = -0.296;

/**
 * Calculate the Coleman-Liau index for text.
 * https://en.wikipedia.org/wiki/Coleman%E2%80%93Liau_index
 */
export function colemanLiauIndex(params: {
  letters: number;
  sentences: number;
}) {
  return (
    LETTERS_COEF * params.letters +
    SENTENCES_COEF * params.sentences +
    BASE_COEF
  );
}
