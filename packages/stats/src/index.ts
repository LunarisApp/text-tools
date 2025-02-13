import { clearCache, lruCache } from "./utils";
import cmudict from "@stdlib/datasets-cmudict";
import { TextHyphen } from "@lunaris/hyphen";

export class TextStats {
  private lang = "en_US";
  private rmApostrophe = true;
  private cmudict: Record<string, string> | null = null;
  private hyphen!: TextHyphen;

  constructor(props?: { lang?: string; rmApostrophe?: boolean }) {
    const { lang, rmApostrophe } = props ?? {};
    this.setLang(lang ?? this.lang);
    this.setRmApostrophe(rmApostrophe ?? this.rmApostrophe);
  }

  /**
   * Set the language for the text statistics.
   * @param lang
   */
  setLang(lang: string) {
    this.lang = lang;
    this.hyphen = new TextHyphen({ lang });
    if (lang.toLowerCase().startsWith("en")) {
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
  // @lruCache()
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
  // @lruCache()
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
  // @lruCache()
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
  // @lruCache()
  wordCount(text: string, removePunctuation = true) {
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
  // @lruCache()
  miniWordCount(text: string, maxSize = 3) {
    return this.removePunctuation(text)
      .split(/\s+/)
      .filter((word) => word.length <= maxSize).length;
  }

  /**
   * Count the number of syllables in text.
   * @param text
   */
  // @lruCache()
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
  // @lruCache()
  sentenceCount(text: string) {
    let ignoreCount = 0;
    const sentences = text.match(/\b[^.!?]+[.!?]*/g) || [];
    for (const sentence of sentences) {
      if (this.wordCount(sentence) <= 2) {
        ignoreCount += 1;
      }
    }
    return Math.max(1, sentences.length - ignoreCount);
  }

  /**
   * Calculate the average length of sentences in text.
   * @param text
   */
  // @lruCache()
  avgSentenceLength(text: string) {
    try {
      return this.wordCount(text) / this.sentenceCount(text);
    } catch {
      return 0;
    }
  }

  /**
   * Calculate the average number of syllables per word in text.
   * @param text
   * @param interval
   */
  // @lruCache()
  avgSyllablesPerWord(text: string, interval?: number) {
    const syllableCount = this.syllableCount(text);
    const lexiconCount = this.wordCount(text);
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
  // @lruCache()
  avgCharactersPerWord(text: string) {
    try {
      return this.charCount(text) / this.wordCount(text);
    } catch {
      return 0;
    }
  }

  /**
   * Calculate the average number of letters per word in text.
   * @param text
   */
  // @lruCache()
  avgLettersPerWord(text: string) {
    try {
      return this.letterCount(text) / this.wordCount(text);
    } catch {
      return 0;
    }
  }

  /**
   * Calculate the average number of sentences per word in text.
   * @param text
   */
  // @lruCache()
  avgSentencesPerWord(text: string) {
    try {
      return this.sentenceCount(text) / this.wordCount(text);
    } catch {
      return 0;
    }
  }

  /**
   * Calculate the average number of words per sentence in text.
   * @param text
   */
  // @lruCache()
  avgWordsPerSentence(text: string) {
    const sentencesCount = this.sentenceCount(text);
    if (sentencesCount < 1) {
      return 0;
    }
    return this.wordCount(text) / sentencesCount;
  }

  /**
   * Calculates the words in text with 3 or more syllables.
   * @param text
   */
  // @lruCache()
  polysyllablesCount(text: string) {
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
  // @lruCache()
  monosyllablesCount(text: string) {
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
  // @lruCache()
  longWordsCount(text: string, threshold = 6) {
    const words = this.removePunctuation(text).split(/\s+/);
    return words.filter((word) => word.length > threshold).length;
  }

  /**
   * Calculate the reading time for text.
   * @param text
   * @param msPerChar The time in milliseconds per character. Default is 14.69.
   */
  // @lruCache()
  readingTime(text: string, msPerChar = 14.69) {
    const words = text.split(/\s+/);
    const chars = words.map((word) => word.length);
    const rtPerWord = chars.map((char) => char * msPerChar);
    return rtPerWord.reduce((acc, curr) => acc + curr, 0) / 1000;
  }
}

export const textStats = new TextStats();
