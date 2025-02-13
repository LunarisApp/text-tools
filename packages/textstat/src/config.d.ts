export type LangConfig = {
  fre_base: number;
  fre_sentence_length: number;
  fre_syllables_per_word: number;
  syllable_threshold?: number;
};
export declare const langs: Record<string, LangConfig>;
