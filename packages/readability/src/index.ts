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
import { LRUCache } from "lru-cache";
import { lruCache } from "./utils/utils";
import { type Language } from "@lunarisapp/language";

export * from "./formulas";
export { type Language };

export class TextReadability {
  private readonly cache = new LRUCache<string, number>({ max: 512 });
  private readonly cacheEnabled: boolean;
  private lang: Language = "en_US";
  private textStats!: TextStats;

  constructor(props?: { lang?: Language; cache?: boolean }) {
    const { lang, cache } = props ?? {};
    this.cacheEnabled = cache ?? true;
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
  setLang(lang: Language) {
    this.lang = lang;
    this.textStats = new TextStats({ lang });
    this.cache.clear();
  }

  /**
   * Calculate the Flesch reading ease test for text.
   * https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch_reading_ease
   * @param text
   */
  fleschReadingEase(text: string) {
    return lruCache(
      this.cache,
      "fleschReadingEase",
      [text],
      (text) => this.computeFleschReadingEase(text),
      this.cacheEnabled,
    );
  }

  private computeFleschReadingEase(text: string) {
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
  fleschKincaidGrade(text: string) {
    return lruCache(
      this.cache,
      "fleschKincaidGrade",
      [text],
      (text) => this.computeFleschKincaidGrade(text),
      this.cacheEnabled,
    );
  }

  private computeFleschKincaidGrade(text: string) {
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
  smogIndex(text: string) {
    return lruCache(
      this.cache,
      "smogIndex",
      [text],
      (text) => this.computeSmogIndex(text),
      this.cacheEnabled,
    );
  }

  private computeSmogIndex(text: string) {
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
  colemanLiauIndex(text: string) {
    return lruCache(
      this.cache,
      "colemanLiauIndex",
      [text],
      (text) => this.computeColemanLiauIndex(text),
      this.cacheEnabled,
    );
  }

  private computeColemanLiauIndex(text: string) {
    const letters = this.textStats.avgLettersPerWord(text) * 100;
    const sentences = this.textStats.avgSentencesPerWord(text) * 100;
    return colemanLiauIndex({ letters, sentences });
  }

  /**
   * Calculate the automated readability index for text.
   * https://en.wikipedia.org/wiki/Automated_readability_index
   * @param text
   */
  automatedReadabilityIndex(text: string) {
    return lruCache(
      this.cache,
      "automatedReadabilityIndex",
      [text],
      (text) => this.computeAutomatedReadabilityIndex(text),
      this.cacheEnabled,
    );
  }

  private computeAutomatedReadabilityIndex(text: string) {
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
  linsearWriteFormula(text: string, sample = 100) {
    return lruCache(
      this.cache,
      "linsearWriteFormula",
      [text, sample],
      (text, sample) => this.computeLinsearWriteFormula(text, sample),
      this.cacheEnabled,
    );
  }

  private computeLinsearWriteFormula(text: string, sample: number) {
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
  gutierrezPolini(text: string) {
    return lruCache(
      this.cache,
      "gutierrezPolini",
      [text],
      (text) => this.computeGutierrezPolini(text),
      this.cacheEnabled,
    );
  }

  private computeGutierrezPolini(text: string) {
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
  crawford(text: string) {
    return lruCache(
      this.cache,
      "crawford",
      [text],
      (text) => this.computeCrawford(text),
      this.cacheEnabled,
    );
  }

  private computeCrawford(text: string) {
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
  gulpeaseIndex(text: string) {
    return lruCache(
      this.cache,
      "gulpeaseIndex",
      [text],
      (text) => this.computeGulpeaseIndex(text),
      this.cacheEnabled,
    );
  }

  private computeGulpeaseIndex(text: string) {
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
  wienerSachtextformel(text: string, variant: WienerSachtextformelVariant = 1) {
    return lruCache(
      this.cache,
      "wienerSachtextformel",
      [text, variant],
      (text, variant) => this.computeWienerSachtextformel(text, variant),
      this.cacheEnabled,
    );
  }

  private computeWienerSachtextformel(
    text: string,
    variant: WienerSachtextformelVariant,
  ) {
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
  mcalpineEflaw(text: string) {
    return lruCache(
      this.cache,
      "mcalpineEflaw",
      [text],
      (text) => this.computeMcalpineEflaw(text),
      this.cacheEnabled,
    );
  }

  private computeMcalpineEflaw(text: string) {
    if (!text) {
      return 0;
    }
    const words = this.textStats.wordCount(text);
    const sentences = this.textStats.sentenceCount(text);
    const miniWords = this.textStats.miniWordCount(text);
    return mcalpineEflaw({ words, sentences, miniWords });
  }
}
