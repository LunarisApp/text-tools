import { clearCache, lruCache } from "./utils";
import { TextStats } from '@lunaris/stats'
import { LangConfig, langs } from './config'

export class TextReadability {

  private lang = "en_US";
  private textStats!: TextStats

  constructor(props?: { lang?: string }) {
    const { lang } = props ?? {};
    this.setLang(lang ?? this.lang);
  }

  private getCfg(key: keyof LangConfig) {
    return langs[this.lang][key]!;
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
    const sentenceLength = this.textStats.avgSentenceLength(text);
    const syllablesPerWord = this.textStats.avgSyllablesPerWord(text, sInterval);
    return (
      this.getCfg("fre_base") -
      this.getCfg("fre_sentence_length") * sentenceLength -
      this.getCfg("fre_syllables_per_word") * syllablesPerWord
    );
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
    const sentenceLength = this.textStats.avgSentenceLength(text);
    const syllablesPerWord = this.textStats.avgSyllablesPerWord(text);
    return 0.39 * sentenceLength + 11.8 * syllablesPerWord - 15.59;
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
    const polySyllables = this.textStats.polySyllablesCount(text);
    return 1.043 * Math.sqrt((polySyllables * 30) / sentences) + 3.1291;
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
    return 0.058 * letters - 0.296 * sentences - 15.8;
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
    try {
      return 4.71 * (chars / words) + 0.5 * (words / sentences) - 21.43;
    } catch {
      return 0;
    }
  }

  /**
   * Calculate the Linsear Write formula for text.
   * https://en.wikipedia.org/wiki/Linsear_Write
   * @param text
   */
  // @lruCache()
  linsearWriteFormula(text: string) {
    const words = text
      .split(/\s+/)
      .slice(0, 100)
      .filter((word) => word);
    let easyWords = 0;
    let difficultWords = 0;

    for (const word of words) {
      if (this.textStats.syllableCount(word) < 3) {
        easyWords += 1;
      } else {
        difficultWords += 1;
      }
    }

    const newText = words.join(" ");

    try {
      const score =
        (easyWords + difficultWords * 3) / this.textStats.sentenceCount(newText);
      if (score <= 20) {
        return (score - 2) / 2;
      }
      return score / 2;
    } catch {
      return 0;
    }
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
    try {
      return 95.2 - 9.7 * (letters / words) - 0.35 * (words / sentences);
    } catch {
      return 0;
    }
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

    try {
      const sentencesPerWords = 100 * (sentences / words);
      const syllablesPerWords = 100 * (syllables / words);
      return -0.205 * sentencesPerWords + 0.049 * syllablesPerWords - 3.407;
    } catch {
      return 0;
    }
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
    return (
      (300 * this.textStats.sentenceCount(text) - 10 * this.textStats.charCount(text)) /
        this.textStats.wordCount(text) +
      89
    );
  }

  /**
   * Calculate the Wiener Sachtextformel for text (german).
   * https://de.wikipedia.org/wiki/Lesbarkeitsindex#Wiener_Sachtextformel
   * @param text
   * @param variant
   */
  // @lruCache()
  wienerSachtextformel(text: string, variant: 1 | 2 | 3 | 4 = 1) {
    if (this.lang !== "de") {
      console.warn(`Wiener Sachtextformel only supports German language. 
                          Textstat language is set to '${this.lang}'.`);
    }
    if (!text) {
      return 0;
    }

    const words = this.textStats.wordCount(text);
    const ms = (100 * this.textStats.polySyllablesCount(text)) / words;
    const sl = words / this.textStats.sentenceCount(text);
    const iw = (100 * this.textStats.longWordsCount(text)) / words;
    const es = (100 * this.textStats.monoSyllablesCount(text)) / words;

    switch (variant) {
      case 1:
        return 0.1935 * ms + 0.1672 * sl + 0.1297 * iw - 0.0327 * es - 0.875;
      case 2:
        return 0.2007 * ms + 0.1682 * sl + 0.1373 * iw - 2.779;
      case 3:
        return 0.2963 * ms + 0.1905 * sl - 1.1144;
      case 4:
        return 0.2744 * ms + 0.2656 * sl - 1.693;
    }
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
    return (words + miniWords) / sentences;
  }
}

export const textstat = new TextReadability();
