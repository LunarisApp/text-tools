import cmudict from "@lunarisapp/cmudict";
import { TextHyphen } from "@lunarisapp/hyphen";
import { getWords, type Language } from "@lunarisapp/language";
import { LRUCache } from "lru-cache";
import { TextStats } from ".";
import { chunkAndProcessText, lruCache } from "./utils";

export type { Language } from "@lunarisapp/language";

export class TextStatsSyllables extends TextStats {
  private readonly syllableCache = new LRUCache<string, number>({ max: 512 });
  private cmudict: Record<string, string[][]> | null = null;
  private hyphen!: TextHyphen;

  constructor(props?: { lang?: Language; cache?: boolean }) {
    super(props);
    this.setLang(this.lang);
  }

  /**
   * Set the language for syllable-aware text statistics.
   * @param lang
   */
  override setLang(lang: Language) {
    super.setLang(lang);
    this.hyphen = new TextHyphen({ lang });
    if (lang.toLowerCase().startsWith("en")) {
      this.cmudict = cmudict.dict();
    } else {
      this.cmudict = null;
    }
    this.syllableCache.clear();
  }

  /**
   * Count the number of syllables in text.
   * @param text
   */
  syllableCount(text: string) {
    return chunkAndProcessText(text, (text) =>
      lruCache(
        this.syllableCache,
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
   * Calculates the words in text with 3 or more syllables.
   * @param text
   */
  polysyllableCount(text: string) {
    return lruCache(
      this.syllableCache,
      "polysyllableCount",
      [text],
      (text) => this.computePolysyllableCount(text),
      this.cacheEnabled
    );
  }

  private computePolysyllableCount(text: string) {
    let count = 0;
    for (const word of getWords(text)) {
      if (this.computeSyllableCount(word) > 2) {
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
      this.syllableCache,
      "monosyllableCount",
      [text],
      (text) => this.computeMonosyllableCount(text),
      this.cacheEnabled
    );
  }

  private computeMonosyllableCount(text: string) {
    let count = 0;
    for (const word of getWords(text)) {
      if (this.computeSyllableCount(word) === 1) {
        count += 1;
      }
    }
    return count;
  }
}
