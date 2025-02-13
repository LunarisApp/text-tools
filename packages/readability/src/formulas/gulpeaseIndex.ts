const BASE_COEF = 89;
const SENTENCES_COEF = 300;
const CHARS_COEF = 10;

/**
 * Calculate the Gulpease index for text (Italian only).
 * https://it.wikipedia.org/wiki/Indice_Gulpease
 */
export function gulpeaseIndex(params: {
    sentences: number;
    chars: number;
    words: number;
}) {
    const { sentences, chars, words, } = params;
    return (SENTENCES_COEF * sentences - CHARS_COEF * chars) / words + BASE_COEF;
}