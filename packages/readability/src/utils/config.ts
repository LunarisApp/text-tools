export interface LangConfig {
  fre_base: number;
  fre_sentence_length: number;
  fre_syllables_per_word: number;
}

/**
 * Language specific configuration for the Flesch reading ease test.
 */
export const langs: Record<string, LangConfig> = {
  en: {
    fre_base: 206.835,
    fre_sentence_length: 1.015,
    fre_syllables_per_word: 84.6,
  },
  de: {
    fre_base: 180,
    fre_sentence_length: 1,
    fre_syllables_per_word: 58.5,
  },
  es: {
    fre_base: 206.84,
    fre_sentence_length: 1.02,
    fre_syllables_per_word: 0.6,
  },
  fr: {
    fre_base: 207,
    fre_sentence_length: 1.015,
    fre_syllables_per_word: 73.6,
  },
  it: {
    fre_base: 217,
    fre_sentence_length: 1.3,
    fre_syllables_per_word: 0.6,
  },
  nl: {
    fre_base: 206.835,
    fre_sentence_length: 0.93,
    fre_syllables_per_word: 77,
  },
  pl: {
    fre_base: 0,
    fre_sentence_length: 0,
    fre_syllables_per_word: 0,
  },
  ru: {
    fre_base: 206.835,
    fre_sentence_length: 1.3,
    fre_syllables_per_word: 60.1,
  },
  hu: {
    fre_base: 206.835,
    fre_sentence_length: 1.015,
    fre_syllables_per_word: 58.5,
  },
};
