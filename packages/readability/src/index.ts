import { clearCache, lruCache } from "./utils/utils";
import { TextStats } from "@lunarisapp/stats";
import { LangConfig, langs } from "./utils/config";
import {
  fleschReadingEase,
  mcalpineEflaw,
  wienerSachtextformel,
  WienerSachtextformelVariant,
  gulpeaseIndex,
  crawford,
  gutierrezPolini,
  linsearWriteFormula,
  automatedReadabilityIndex,
  smogIndex,
  fleschKincaidGrade,
  colemanLiauIndex,
} from "./formulas";

export * from "./formulas";

export class TextReadability {
  private lang = "en_US";
  private textStats!: TextStats;

  constructor(props?: { lang?: string }) {
    const { lang } = props ?? {};
    this.setLang(lang ?? this.lang);
  }

  private getCfg(key: keyof LangConfig) {
    const lang = this.lang.split("_")[0];
    return langs[lang][key]!;
  }

  /**
   * Set the language for the text statistics.
   * @param lang
   */
  setLang(lang: string) {
    this.lang = lang;
    this.textStats = new TextStats({ lang });
    clearCache();
  }

  /**
   * Calculate the Flesch reading ease test for text.
   * https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch_reading_ease
   * @param text
   */
  // @lruCache()
  fleschReadingEase(text: string) {
    if (this.lang === "pl") {
      throw new Error(
        "Flesch reading ease test does not support Polish language.",
      );
    }
    const sInterval = ["es", "it"].includes(this.lang) ? 100 : undefined;
    const sentences = this.textStats.avgSentenceLength(text);
    const syllablesPerWord = this.textStats.avgSyllablesPerWord(
      text,
      sInterval,
    );
    return fleschReadingEase({
      sentences,
      syllablesPerWord,
      coefficients: {
        base: this.getCfg("fre_base"),
        sentences: this.getCfg("fre_sentence_length"),
        syllablesPerWord: this.getCfg("fre_syllables_per_word"),
      },
    });
  }

  /**
   * Calculate the Flesch-Kincaid grade level for text.
   * https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch%E2%80%93Kincaid_grade_level
   * TODO: can we support multiple languages?
   * @param text
   */
  // @lruCache()
  fleschKincaidGrade(text: string) {
    if (this.lang === "pl") {
      throw new Error(
        "Flesch-Kincaid grade level does not support Polish language.",
      );
    }
    const sentences = this.textStats.avgSentenceLength(text);
    const syllablesPerWord = this.textStats.avgSyllablesPerWord(text);
    return fleschKincaidGrade({ sentences, syllablesPerWord });
  }

  /**
   * Calculate the SMOG index for text.
   * https://en.wikipedia.org/wiki/SMOG
   * @param text
   */
  // @lruCache()
  smogIndex(text: string) {
    const sentences = this.textStats.sentenceCount(text);
    if (sentences < 3) {
      return 0;
    }
    const polysyllables = this.textStats.polysyllableCount(text);
    return smogIndex({ sentences, polysyllables });
  }

  /**
   * Calculate the Coleman-Liau index for text.
   * https://en.wikipedia.org/wiki/Coleman%E2%80%93Liau_index
   * @param text
   */
  // @lruCache()
  colemanLiauIndex(text: string) {
    const letters = this.textStats.avgLettersPerWord(text) * 100;
    const sentences = this.textStats.avgSentencesPerWord(text) * 100;
    return colemanLiauIndex({ letters, sentences });
  }

  /**
   * Calculate the automated readability index for text.
   * https://en.wikipedia.org/wiki/Automated_readability_index
   * @param text
   */
  // @lruCache()
  automatedReadabilityIndex(text: string) {
    const chars = this.textStats.charCount(text);
    const words = this.textStats.wordCount(text);
    const sentences = this.textStats.sentenceCount(text);
    return automatedReadabilityIndex({ chars, words, sentences });
  }

  /**
   * Calculate the Linsear Write formula for text.
   * https://en.wikipedia.org/wiki/Linsear_Write
   * @param text
   * @param sample Number of words to sample from the text
   */
  // @lruCache()
  linsearWriteFormula(text: string, sample = 100) {
    const words = text
      .split(/\s+/)
      .slice(0, sample)
      .filter((word) => word);
    const newText = words.join(" ");
    const sentences = this.textStats.sentenceCount(newText);
    const syllablesPerWords = words.map((word) =>
      this.textStats.syllableCount(word),
    );
    return linsearWriteFormula({
      sentences,
      syllablesPerWords,
    });
  }

  /**
   * Calculate Gutierrez Polini's readability formula for text (Spanish only).
   * https://www.spanishreadability.com/gutierrez-de-polinis-readability-formula
   * @param text
   */
  // @lruCache()
  gutierrezPolini(text: string) {
    if (this.lang !== "es") {
      console.warn(`Gutierrez Polini's formula only supports Spanish language. 
                          Textstat language is set to '${this.lang}'.`);
    }
    if (!text) {
      return 0;
    }
    const words = this.textStats.wordCount(text);
    const sentences = this.textStats.sentenceCount(text);
    const letters = this.textStats.letterCount(text);
    return gutierrezPolini({ words, sentences, letters });
  }

  /**
   * Calculate Crawford's formula for text (Spanish only).
   * https://www.spanishreadability.com/the-crawford-score-for-spanish-texts
   * @param text
   */
  // @lruCache()
  crawford(text: string) {
    if (this.lang !== "es") {
      console.warn(`Crawford's formula only supports Spanish language. 
                          Textstat language is set to '${this.lang}'.`);
    }
    if (!text) {
      return 0;
    }
    const sentences = this.textStats.sentenceCount(text);
    const words = this.textStats.wordCount(text);
    const syllables = this.textStats.syllableCount(text);
    return crawford({ words, sentences, syllables });
  }

  /**
   * Calculate the Gulpease index for text (Italian only).
   * https://it.wikipedia.org/wiki/Indice_Gulpease
   * @param text
   */
  // @lruCache()
  gulpeaseIndex(text: string) {
    if (this.lang !== "it") {
      console.warn(`Gulpease index only supports Italian language. 
                          Textstat language is set to '${this.lang}'.`);
    }
    if (!text) {
      return 0;
    }
    return gulpeaseIndex({
      words: this.textStats.wordCount(text),
      sentences: this.textStats.sentenceCount(text),
      chars: this.textStats.charCount(text),
    });
  }

  /**
   * Calculate the Wiener Sachtextformel for text (german).
   * https://de.wikipedia.org/wiki/Lesbarkeitsindex#Wiener_Sachtextformel
   * @param text
   * @param variant
   */
  // @lruCache()
  wienerSachtextformel(text: string, variant: WienerSachtextformelVariant = 1) {
    if (this.lang !== "de") {
      console.warn(`Wiener Sachtextformel only supports German language. 
                          Textstat language is set to '${this.lang}'.`);
    }
    if (!text) {
      return 0;
    }
    return wienerSachtextformel({
      words: this.textStats.wordCount(text),
      sentences: this.textStats.sentenceCount(text),
      longWords: this.textStats.longWordCount(text),
      polysyllables: this.textStats.polysyllableCount(text),
      monosyllables: this.textStats.monosyllableCount(text),
      variant,
    });
  }

  /**
   * Calculate the McAlpine EFLAW score for text.
   * https://www.angelfire.com/nd/nirmaldasan/journalismonline/fpetge.html
   * @param text
   */
  // @lruCache()
  mcalpineEflaw(text: string) {
    if (!text) {
      return 0;
    }
    const words = this.textStats.wordCount(text);
    const sentences = this.textStats.sentenceCount(text);
    const miniWords = this.textStats.miniWordCount(text);
    return mcalpineEflaw({ words, sentences, miniWords });
  }
}
