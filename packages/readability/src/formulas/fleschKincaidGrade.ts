const BASE_COEF = -15.59;
const SENTENCES_COEF = 0.39;
const SYLLABLES_COEF = 11.8;

/**
 * Calculate the Flesch-Kincaid grade level for text.
 * https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch%E2%80%93Kincaid_grade_level
 * TODO: can we support multiple languages?
 */
export function fleschKincaidGrade(params: {
    sentences: number
    syllablesPerWord: number
}) {
    const { sentences, syllablesPerWord } = params;
    return SENTENCES_COEF * sentences + SYLLABLES_COEF * syllablesPerWord + BASE_COEF;
}