import { clearCache, lruCache } from "./utils";
import cmudict from "@stdlib/datasets-cmudict";
import { LangConfig, langs } from "./config";
import { Hyphen } from "@lunaris/hyphen";

export class TextStatistics {
  private lang = "en_US";
  private rmApostrophe = true;
  private cmudict: Record<string, string> | null = null;
  private hyphen!: Hyphen;

  constructor(props?: { lang?: string; rmApostrophe?: boolean }) {
    const { lang, rmApostrophe } = props ?? {};
    this.setLang(lang ?? this.lang);
    this.setRmApostrophe(rmApostrophe ?? this.rmApostrophe);
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
    this.hyphen = new Hyphen({ lang });
    if (lang === "en") {
      this.cmudict = cmudict({ data: "dict" }) as Record<string, string>;
    } else {
      this.cmudict = null;
    }
    clearCache();
  }

  /**
   * Set whether to remove apostrophes from text.
   * @param rmApostrophe
   */
  setRmApostrophe(rmApostrophe: boolean) {
    this.rmApostrophe = rmApostrophe;
  }

  /**
   * Remove punctuation from text.
   * @param text
   */
  // @lruCache
  removePunctuation(text: string) {
    if (this.rmApostrophe) {
      return text.replace(/[^\w\s]/g, "");
    } else {
      text = text.replace(/'(?![tsd]\b|ve\b|ll\b|re\b)/g, '"');
      return text.replace(/[^\w\s']/g, ""); // remove all punctuation except apostrophes
    }
  }

  /**
   * Count the number of characters in text (incl. punctuation).
   * @param text The text to count characters in.
   * @param ignoreSpaces Whether to ignore spaces in text.
   */
  // @lruCache
  charCount(text: string, ignoreSpaces = true) {
    if (ignoreSpaces) {
      text = text.replace(/\s/g, "");
    }
    return text.length;
  }

  /**
   * Count the number of letters in text (excl. punctuation).
   * @param text The text to count letters in.
   * @param ignoreSpaces Whether to ignore spaces in text.
   */
  // @lruCache
  letterCount(text: string, ignoreSpaces = true) {
    if (ignoreSpaces) {
      text = text.replace(/\s/g, "");
    }
    return this.removePunctuation(text).length;
  }

  /**
   * Count the number of words in text.
   * @param text The text to count words in.
   * @param removePunctuation Whether to remove punctuation from text.
   */
  // @lruCache
  lexiconCount(text: string, removePunctuation = true) {
    if (removePunctuation) {
      text = this.removePunctuation(text);
    }
    return text.split(/\s+/).length;
  }

  /**
   * Count he number of common words with [maxSize] characters or less in text.
   * @param text The text to count common words in.
   * @param maxSize The maximum size of the common words to count. Default is 3.
   */
  // @lruCache
  miniWordCount(text: string, maxSize = 3) {
    return this.removePunctuation(text)
      .split(/\s+/)
      .filter((word) => word.length <= maxSize).length;
  }

  /**
   * Count the number of syllables in text.
   * @param text
   */
  // @lruCache
  syllableCount(text: string) {
    const formatted = this.removePunctuation(text).toLowerCase();
    if (!formatted) return 0;

    let count = 0;
    for (const word of formatted.split(/\s+/)) {
      try {
        count += this.cmudict![word.toUpperCase()]!.split(" ").filter((s) =>
          s.match(/\d/g),
        ).length;
      } catch {
        count += this.hyphen.positions(word).length + 1;
      }
    }
    return count;
  }

  /**
   * Count the number of sentences in text.
   * @param text
   */
  // @lruCache
  sentenceCount(text: string) {
    let ignoreCount = 0;
    const sentences = text.match(/\b[^.!?]+[.!?]*/g) || [];
    for (const sentence of sentences) {
      if (this.lexiconCount(sentence) <= 2) {
        ignoreCount += 1;
      }
    }
    return Math.max(1, sentences.length - ignoreCount);
  }

  /**
   * Calculate the average length of sentences in text.
   * @param text
   */
  // @lruCache
  avgSentenceLength(text: string) {
    try {
      return this.lexiconCount(text) / this.sentenceCount(text);
    } catch {
      return 0;
    }
  }

  /**
   * Calculate the average number of syllables per word in text.
   * @param text
   * @param interval
   */
  // @lruCache
  avgSyllablesPerWord(text: string, interval?: number) {
    const syllableCount = this.syllableCount(text);
    const lexiconCount = this.lexiconCount(text);
    try {
      if (interval) {
        return (syllableCount * interval) / lexiconCount;
      } else {
        return syllableCount / lexiconCount;
      }
    } catch {
      return 0;
    }
  }

  /**
   * Calculate the average number of characters per word in text.
   * @param text
   */
  // @lruCache
  avgCharactersPerWord(text: string) {
    try {
      return this.charCount(text) / this.lexiconCount(text);
    } catch {
      return 0;
    }
  }

  /**
   * Calculate the average number of letters per word in text.
   * @param text
   */
  // @lruCache
  avgLettersPerWord(text: string) {
    try {
      return this.letterCount(text) / this.lexiconCount(text);
    } catch {
      return 0;
    }
  }

  /**
   * Calculate the average number of sentences per word in text.
   * @param text
   */
  // @lruCache
  avgSentencesPerWord(text: string) {
    try {
      return this.sentenceCount(text) / this.lexiconCount(text);
    } catch {
      return 0;
    }
  }

  /**
   * Calculate the average number of words per sentence in text.
   * @param text
   */
  // @lruCache
  avgWordsPerSentence(text: string) {
    const sentencesCount = this.sentenceCount(text);
    if (sentencesCount < 1) {
      return 0;
    }
    return this.lexiconCount(text) / sentencesCount;
  }

  /**
   * Calculates the words in text with 3 or more syllables.
   * @param text
   */
  // @lruCache
  polySyllablesCount(text: string) {
    let count = 0;
    for (const word of text.split(/\s+/)) {
      if (this.syllableCount(word) > 2) {
        count += 1;
      }
    }
    return count;
  }

  /**
   * Calculate the number of monosyllable words in text.
   * @param text
   */
  // @lruCache
  monoSyllablesCount(text: string) {
    const words = this.removePunctuation(text).split(/\s+/);
    let count = 0;
    for (const word of words) {
      if (this.syllableCount(word) === 1) {
        count += 1;
      }
    }
    return count;
  }

  /**
   * Calculate the number of long words in text.
   * @param text
   * @param threshold
   */
  // @lruCache
  longWordsCount(text: string, threshold = 6) {
    const words = this.removePunctuation(text).split(/\s+/);
    return words.filter((word) => word.length > threshold).length;
  }

  /**
   * Calculate the reading time for text.
   * @param text
   * @param msPerChar The time in milliseconds per character. Default is 14.69.
   */
  // @lruCache
  readingTime(text: string, msPerChar = 14.69) {
    const words = text.split(/\s+/);
    const chars = words.map((word) => word.length);
    const rtPerWord = chars.map((char) => char * msPerChar);
    return rtPerWord.reduce((acc, curr) => acc + curr, 0) / 1000;
  }

  /**
   * Calculate the Flesch reading ease test for text.
   * https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch_reading_ease
   * @param text
   */
  // @lruCache
  fleschReadingEase(text: string) {
    if (this.lang === "pl") {
      throw new Error(
        "Flesch reading ease test does not support Polish language.",
      );
    }
    const sInterval = ["es", "it"].includes(this.lang) ? 100 : undefined;
    const sentenceLength = this.avgSentenceLength(text);
    const syllablesPerWord = this.avgSyllablesPerWord(text, sInterval);
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
  // @lruCache
  fleschKincaidGrade(text: string) {
    if (this.lang === "pl") {
      throw new Error(
        "Flesch-Kincaid grade level does not support Polish language.",
      );
    }
    const sentenceLength = this.avgSentenceLength(text);
    const syllablesPerWord = this.avgSyllablesPerWord(text);
    return 0.39 * sentenceLength + 11.8 * syllablesPerWord - 15.59;
  }

  /**
   * Calculate the SMOG index for text.
   * https://en.wikipedia.org/wiki/SMOG
   * @param text
   */
  // @lruCache
  smogIndex(text: string) {
    const sentences = this.sentenceCount(text);
    if (sentences < 3) {
      return 0;
    }
    const polySyllables = this.polySyllablesCount(text);
    return 1.043 * Math.sqrt((polySyllables * 30) / sentences) + 3.1291;
  }

  /**
   * Calculate the Coleman-Liau index for text.
   * https://en.wikipedia.org/wiki/Coleman%E2%80%93Liau_index
   * @param text
   */
  // @lruCache
  colemanLiauIndex(text: string) {
    const letters = this.avgLettersPerWord(text) * 100;
    const sentences = this.avgSentencesPerWord(text) * 100;
    return 0.058 * letters - 0.296 * sentences - 15.8;
  }

  /**
   * Calculate the automated readability index for text.
   * https://en.wikipedia.org/wiki/Automated_readability_index
   * @param text
   */
  // @lruCache
  automatedReadabilityIndex(text: string) {
    const chars = this.charCount(text);
    const words = this.lexiconCount(text);
    const sentences = this.sentenceCount(text);
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
  // @lruCache
  linsearWriteFormula(text: string) {
    const words = text
      .split(/\s+/)
      .slice(0, 100)
      .filter((word) => word);
    let easyWords = 0;
    let difficultWords = 0;

    for (const word of words) {
      if (this.syllableCount(word) < 3) {
        easyWords += 1;
      } else {
        difficultWords += 1;
      }
    }

    const newText = words.join(" ");

    try {
      const score =
        (easyWords + difficultWords * 3) / this.sentenceCount(newText);
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
  // @lruCache
  gutierrezPolini(text: string) {
    if (this.lang !== "es") {
      console.warn(`Gutierrez Polini's formula only supports Spanish language. 
                          Textstat language is set to '${this.lang}'.`);
    }
    if (!text) {
      return 0;
    }

    const words = this.lexiconCount(text);
    const sentences = this.sentenceCount(text);
    const letters = this.letterCount(text);
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
  // @lruCache
  crawford(text: string) {
    if (this.lang !== "es") {
      console.warn(`Crawford's formula only supports Spanish language. 
                          Textstat language is set to '${this.lang}'.`);
    }
    if (!text) {
      return 0;
    }

    const sentences = this.sentenceCount(text);
    const words = this.lexiconCount(text);
    const syllables = this.syllableCount(text);

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
  // @lruCache
  gulpeaseIndex(text: string) {
    if (this.lang !== "it") {
      console.warn(`Gulpease index only supports Italian language. 
                          Textstat language is set to '${this.lang}'.`);
    }
    if (!text) {
      return 0;
    }
    return (
      (300 * this.sentenceCount(text) - 10 * this.charCount(text)) /
        this.lexiconCount(text) +
      89
    );
  }

  /**
   * Calculate the Wiener Sachtextformel for text (german).
   * https://de.wikipedia.org/wiki/Lesbarkeitsindex#Wiener_Sachtextformel
   * @param text
   * @param variant
   */
  // @lruCache
  wienerSachtextformel(text: string, variant: 1 | 2 | 3 | 4 = 1) {
    if (this.lang !== "de") {
      console.warn(`Wiener Sachtextformel only supports German language. 
                          Textstat language is set to '${this.lang}'.`);
    }
    if (!text) {
      return 0;
    }

    const words = this.lexiconCount(text);
    const ms = (100 * this.polySyllablesCount(text)) / words;
    const sl = words / this.sentenceCount(text);
    const iw = (100 * this.longWordsCount(text)) / words;
    const es = (100 * this.monoSyllablesCount(text)) / words;

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
  // @lruCache
  mcalpineEflaw(text: string) {
    if (!text) {
      return 0;
    }

    const words = this.lexiconCount(text);
    const sentences = this.sentenceCount(text);
    const miniWords = this.miniWordCount(text);
    return (words + miniWords) / sentences;
  }
}

export const textstat = new TextStatistics();
