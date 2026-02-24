import cmudict from "@lunarisapp/cmudict";
import { TextHyphen } from "@lunarisapp/hyphen";
import {
  consonants,
  getSentences,
  getWords,
  type Language,
  removePunctuation,
  vowels,
} from "@lunarisapp/language";
import { LRUCache } from "lru-cache";
import { chunkAndProcessText, lruCache } from "./utils";

// biome-ignore lint/performance/noBarrelFile: library entry point
export { consonants, type Language, vowels } from "@lunarisapp/language";

export class TextStats {
  private readonly cache = new LRUCache<string, number>({ max: 512 });
  private lang: Language = "en_US";
  private readonly cacheEnabled;
  private cmudict: Record<string, string[][]> | null = null;
  private hyphen!: TextHyphen;

  constructor(props?: { lang?: Language; cache?: boolean }) {
    const { lang } = props ?? {};
    this.cacheEnabled = props?.cache ?? true;
    this.setLang(lang ?? this.lang);
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
   * Count the number of characters in text (incl. punctuation).
   * @param text The text to count characters in.
   * @param ignoreSpaces Whether to ignore spaces in text.
   */
  charCount(text: string, ignoreSpaces = true) {
    const processedText = ignoreSpaces ? text.replace(/\s+/g, "") : text;
    return processedText.length;
  }

  /**
   * Count the number of letters in text (excl. punctuation).
   * @param text The text to count letters in.
   * @param ignoreSpaces Whether to ignore spaces in text.
   */
  letterCount(text: string, ignoreSpaces = true) {
    const processedText = ignoreSpaces ? text.replace(/\s+/g, "") : text;
    return removePunctuation(processedText).length;
  }

  /**
   * Count the number of vowels in text.
   * @param text
   */
  vowelCount(text: string) {
    const seq = getWords(text).join("");
    if (!seq) {
      return 0;
    }

    const dict = vowels[this.lang];
    return seq.split("").filter((char) => dict.includes(char)).length;
  }

  /**
   * Count the number of consonants in text.
   * @param text
   */
  consonantCount(text: string) {
    const seq = getWords(text).join("");
    if (!seq) {
      return 0;
    }

    const dict = consonants[this.lang];
    return seq.split("").filter((char) => dict.includes(char)).length;
  }

  /**
   * Count the number of words in text.
   * @param text The text to count words in.
   * @param isRemovePunctuation Whether to remove punctuation from text.
   */
  wordCount(text: string, isRemovePunctuation = true) {
    return getWords(text, isRemovePunctuation).length;
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
        this.cacheEnabled
      )
    );
  }

  private computeSyllableCount(text: string) {
    let count = 0;
    for (const word of getWords(text)) {
      try {
        const pronunciations = this.cmudict?.[word]?.[0];
        if (!pronunciations) {
          throw new Error(`Word not found in CMU dictionary: ${word}`);
        }
        count += pronunciations.filter((s) => s.match(/\d/g)).length;
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
      this.cacheEnabled
    );
  }

  private computeSentenceCount(text: string) {
    const sentences = getSentences(text);
    if (sentences.length === 0) {
      return 0;
    }
    let ignoreCount = 0;
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
    const sentenceCount = this.sentenceCount(text);
    if (sentenceCount === 0) {
      return 0;
    }
    return this.wordCount(text) / sentenceCount;
  }

  /**
   * Calculate the average number of syllables per word in text.
   * @param text
   * @param interval
   */
  avgSyllablesPerWord(text: string, interval?: number) {
    const syllableCount = this.syllableCount(text);
    const wordCount = this.wordCount(text);
    if (wordCount === 0) {
      return 0;
    }
    if (interval) {
      return (syllableCount * interval) / wordCount;
    }
    return syllableCount / wordCount;
  }

  /**
   * Calculate the average number of characters per word in text.
   * @param text
   */
  avgCharactersPerWord(text: string) {
    const wordCount = this.wordCount(text);
    if (wordCount === 0) {
      return 0;
    }
    return this.charCount(text) / wordCount;
  }

  /**
   * Calculate the average number of letters per word in text.
   * @param text
   */
  avgLettersPerWord(text: string) {
    const wordCount = this.wordCount(text);
    if (wordCount === 0) {
      return 0;
    }
    return this.letterCount(text) / wordCount;
  }

  /**
   * Calculate the average number of sentences per word in text.
   * @param text
   */
  avgSentencesPerWord(text: string) {
    const wordCount = this.wordCount(text);
    if (wordCount === 0) {
      return 0;
    }
    return this.sentenceCount(text) / wordCount;
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
      this.cacheEnabled
    );
  }

  private computePolysyllableCount(text: string) {
    let count = 0;
    for (const word of getWords(text)) {
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
      this.cacheEnabled
    );
  }

  private computeMonosyllableCount(text: string) {
    let count = 0;
    for (const word of getWords(text)) {
      if (this.syllableCount(word) === 1) {
        count += 1;
      }
    }
    return count;
  }

  /**
   * Count the number of common words with [maxSize] characters or less in text.
   * @param text The text to count common words in.
   * @param maxSize The maximum size of the common words to count. Default is 3.
   */
  miniWordCount(text: string, maxSize = 3) {
    return getWords(text).filter((word) => word.length <= maxSize).length;
  }

  /**
   * Calculate the number of long words in text.
   * @param text
   * @param threshold
   */
  longWordCount(text: string, threshold = 6) {
    return getWords(text).filter((word) => word.length > threshold).length;
  }

  /**
   * Calculate the reading time for text.
   * @param text
   * @param msPerChar The time in milliseconds per character. Default is 14.69.
   */
  readingTime(text: string, msPerChar = 14.69) {
    const chars = getWords(text, false).map((word) => word.length);
    const rtPerWord = chars.map((char) => char * msPerChar);
    return rtPerWord.reduce((acc, curr) => acc + curr, 0) / 1000;
  }
}
