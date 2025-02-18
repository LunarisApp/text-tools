import { vowels, consonants } from "./data";
import cmudict from "@lunarisapp/cmudict";
import { Language, TextHyphen } from "@lunarisapp/hyphen";
import { LRUCache } from "lru-cache";
import { chunkAndProcessText, lruCache } from "./utils";

export { Language };
export { vowels, consonants };

export class TextStats {
  private readonly cache = new LRUCache<string, number>({ max: 512 });
  private lang: Language = "en_US";
  private rmApostrophe = true;
  private readonly cacheEnabled;
  private cmudict: Record<string, string[][]> | null = null;
  private hyphen!: TextHyphen;

  constructor(props?: {
    lang?: Language;
    rmApostrophe?: boolean;
    cache?: boolean;
  }) {
    const { lang, rmApostrophe } = props ?? {};
    this.cacheEnabled = props?.cache ?? true;
    this.setLang(lang ?? this.lang);
    this.setRmApostrophe(rmApostrophe ?? this.rmApostrophe);
  }

  /**
   * Set the language for the text statistics.
   * @param lang
   */
  setLang(lang: Language) {
    this.lang = lang;
    this.hyphen = new TextHyphen({ lang });
    if (lang.toLowerCase().startsWith("en")) {
      this.cmudict = cmudict.dict();
    } else {
      this.cmudict = null;
    }
    this.cache.clear();
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
  removePunctuation(text: string) {
    if (this.rmApostrophe) {
      return text.replace(/[^\p{L}\p{N}\s\u00A0]/gu, "");
    } else {
      text = text.replace(/'(?![tsd]\b|ve\b|ll\b|re\b)/g, '"'); // english contractions.
      return text.replace(/[^\p{L}\p{N}\s\u00A0']/gu, "");
    }
  }

  /**
   * Count the number of characters in text (incl. punctuation).
   * @param text The text to count characters in.
   * @param ignoreSpaces Whether to ignore spaces in text.
   */
  charCount(text: string, ignoreSpaces = true) {
    if (ignoreSpaces) {
      text = text.replace(/[\s\u00A0]+/g, "");
    }
    return text.length;
  }

  /**
   * Count the number of letters in text (excl. punctuation).
   * @param text The text to count letters in.
   * @param ignoreSpaces Whether to ignore spaces in text.
   */
  letterCount(text: string, ignoreSpaces = true) {
    if (ignoreSpaces) {
      text = text.replace(/[\s\u00A0]+/g, "");
    }
    return this.removePunctuation(text).length;
  }

  /**
   * Count the number of vowels in text.
   * @param text
   */
  vowelCount(text: string) {
    const formatted = this.removePunctuation(text)
      .replace(/[\s\u00A0]+/g, "")
      .toLowerCase();
    if (!formatted) return 0;

    const dict = vowels[this.lang];
    return formatted.split("").filter((char) => dict.includes(char)).length;
  }

  /**
   * Count the number of consonants in text.
   * @param text
   */
  consonantCount(text: string) {
    const formatted = this.removePunctuation(text)
      .replace(/[\s\u00A0]+/g, "")
      .toLowerCase();
    if (!formatted) return 0;

    const dict = consonants[this.lang];
    return formatted.split("").filter((char) => dict.includes(char)).length;
  }

  /**
   * Count the number of words in text.
   * @param text The text to count words in.
   * @param removePunctuation Whether to remove punctuation from text.
   */
  wordCount(text: string, removePunctuation = true) {
    if (removePunctuation) {
      text = this.removePunctuation(text);
    }
    return text.split(/[\s\u00A0]+/g).length;
  }

  /**
   * Count he number of common words with [maxSize] characters or less in text.
   * @param text The text to count common words in.
   * @param maxSize The maximum size of the common words to count. Default is 3.
   */
  miniWordCount(text: string, maxSize = 3) {
    return this.removePunctuation(text)
      .split(/[\s\u00A0]+/g)
      .filter((word) => word.length <= maxSize).length;
  }

  /**
   * Count the number of syllables in text.
   * @param text
   */
  syllableCount(text: string) {
    return chunkAndProcessText(text, (text) =>
      lruCache(
        this.cache,
        "syllableCount",
        [text],
        (text) => this.computeSyllableCount(text),
        this.cacheEnabled,
      ),
    );
  }

  private computeSyllableCount(text: string) {
    const formatted = this.removePunctuation(text).toLowerCase();
    if (!formatted) return 0;

    let count = 0;
    for (const word of formatted.split(/[\s\u00A0]+/g)) {
      try {
        count += this.cmudict![word]![0].filter((s) => s.match(/\d/g)).length;
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
  sentenceCount(text: string) {
    return lruCache(
      this.cache,
      "sentenceCount",
      [text],
      (text) => this.computeSentenceCount(text),
      this.cacheEnabled,
    );
  }

  private computeSentenceCount(text: string) {
    let ignoreCount = 0;
    const sentences =
      text.match(/[^.!?。！？\n\r]+[.!?。！？]*[\n\r]*/gu) || [];
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
  polysyllableCount(text: string) {
    return lruCache(
      this.cache,
      "polysyllableCount",
      [text],
      (text) => this.computePolysyllableCount(text),
      this.cacheEnabled,
    );
  }

  private computePolysyllableCount(text: string) {
    let count = 0;
    for (const word of text.split(/[\s\u00A0]+/g)) {
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
  monosyllableCount(text: string) {
    return lruCache(
      this.cache,
      "monosyllableCount",
      [text],
      (text) => this.computeMonosyllableCount(text),
      this.cacheEnabled,
    );
  }

  private computeMonosyllableCount(text: string) {
    const words = this.removePunctuation(text).split(/[\s\u00A0]+/g);
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
  longWordCount(text: string, threshold = 6) {
    const words = this.removePunctuation(text).split(/[\s\u00A0]+/g);
    return words.filter((word) => word.length > threshold).length;
  }

  /**
   * Calculate the reading time for text.
   * @param text
   * @param msPerChar The time in milliseconds per character. Default is 14.69.
   */
  readingTime(text: string, msPerChar = 14.69) {
    const words = text.split(/[\s\u00A0]+/g);
    const chars = words.map((word) => word.length);
    const rtPerWord = chars.map((char) => char * msPerChar);
    return rtPerWord.reduce((acc, curr) => acc + curr, 0) / 1000;
  }
}
