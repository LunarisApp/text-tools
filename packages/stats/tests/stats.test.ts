import { describe, expect, it } from "@jest/globals";
import { type Language, TextStats } from "../src";
import {
  emptyStr,
  longRussianTextGuillemets,
  longTest,
  shortTest,
  testSyllableCountCases,
} from "./data";

function assertDelta(actual: number, expected: number, delta = 0.1) {
  return expect(Math.abs(actual - expected)).toBeLessThanOrEqual(delta);
}

describe("stats tests", () => {
  const textStats = new TextStats();
  describe("counts", () => {
    it("char count", () => {
      textStats.setLang("en");
      const count = textStats.charCount(longTest);
      const countSpaces = textStats.charCount(longTest, false);
      expect(count).toBe(1748);
      expect(countSpaces).toBe(2123);
    });

    it("letter count", () => {
      textStats.setLang("en");
      const count = textStats.letterCount(longTest);
      const countSpaces = textStats.letterCount(longTest, false);
      expect(count).toBe(1686);
      expect(countSpaces).toBe(2061);
    });

    it("vowel count", () => {
      textStats.setLang("en");
      const count = textStats.vowelCount("abcde, f");
      expect(count).toBe(2);
    });

    it("consonant count", () => {
      textStats.setLang("en");
      const count = textStats.consonantCount("abcde, f");
      expect(count).toBe(4);
    });

    it("lexicon count", () => {
      textStats.setLang("en");
      const count = textStats.wordCount(longTest);
      const countPunct = textStats.wordCount(longTest, false);
      expect(count).toBe(372);
      expect(countPunct).toBe(376);
    });

    it("sentence count", () => {
      textStats.setLang("en");
      const count = textStats.sentenceCount(longTest);
      expect(count).toBe(17);
    });

    it("sentence count russian", () => {
      textStats.setLang("ru");
      const count = textStats.sentenceCount(longRussianTextGuillemets);
      expect(count).toBe(16);
    });

    describe("syllable count", () => {
      for (const testCase of testSyllableCountCases) {
        const [lang, text, expected, delta] = testCase;
        it(`syllable count: ${(text as string).slice(0, 10)}${(text as string).length >= 10 ? "..." : ""}`, () => {
          textStats.setLang(lang as Language);
          const actual = textStats.syllableCount(text as string);
          assertDelta(actual, expected as number, delta as number);
        });
      }
    });

    it("polysyllable count", () => {
      textStats.setLang("en");
      const count = textStats.polysyllableCount(longTest);
      expect(count).toBeGreaterThan(0);
    });

    it("monosyllable count", () => {
      textStats.setLang("en");
      const count = textStats.monosyllableCount(longTest);
      expect(count).toBeGreaterThan(0);
    });

    it("mini word count", () => {
      textStats.setLang("en");
      const count = textStats.miniWordCount(shortTest);
      expect(count).toBe(1); // "da"
    });

    it("long word count", () => {
      textStats.setLang("en");
      const count = textStats.longWordCount(shortTest);
      expect(count).toBe(1); // "sunglasses"
    });
  });

  describe("averages", () => {
    it("avg sentence length", () => {
      textStats.setLang("en");
      const avg = textStats.avgSentenceLength(longTest);
      assertDelta(avg, 21.9, 0.05); // TODO: check delta
    });

    it("avg syllables per word", () => {
      textStats.setLang("en");
      const avg = textStats.avgSyllablesPerWord(longTest);
      assertDelta(avg, 1.5, 0.05); // TODO: check delta
    });

    it("avg characters per word", () => {
      textStats.setLang("en");
      const avg = textStats.avgCharactersPerWord(longTest);
      assertDelta(avg, 4.7);
    });

    it("avg letters per word", () => {
      textStats.setLang("en");
      const avg = textStats.avgLettersPerWord(longTest);
      assertDelta(avg, 4.53);
    });

    it("avg sentence per word", () => {
      textStats.setLang("en");
      const avg = textStats.avgSentencesPerWord(longTest);
      assertDelta(avg, 0.05);
    });

    it("avg words per sentence", () => {
      textStats.setLang("en");
      const avg = textStats.avgWordsPerSentence(longTest);
      assertDelta(avg, 21.9, 0.05);
    });
  });

  describe("empty text", () => {
    it("all count methods return 0", () => {
      textStats.setLang("en");
      expect(textStats.charCount(emptyStr)).toBe(0);
      expect(textStats.letterCount(emptyStr)).toBe(0);
      expect(textStats.vowelCount(emptyStr)).toBe(0);
      expect(textStats.consonantCount(emptyStr)).toBe(0);
      expect(textStats.wordCount(emptyStr)).toBe(0);
      expect(textStats.sentenceCount(emptyStr)).toBe(0);
      expect(textStats.syllableCount(emptyStr)).toBe(0);
      expect(textStats.polysyllableCount(emptyStr)).toBe(0);
      expect(textStats.monosyllableCount(emptyStr)).toBe(0);
      expect(textStats.miniWordCount(emptyStr)).toBe(0);
      expect(textStats.longWordCount(emptyStr)).toBe(0);
    });

    it("all average methods return 0", () => {
      textStats.setLang("en");
      expect(textStats.avgSentenceLength(emptyStr)).toBe(0);
      expect(textStats.avgSyllablesPerWord(emptyStr)).toBe(0);
      expect(textStats.avgCharactersPerWord(emptyStr)).toBe(0);
      expect(textStats.avgLettersPerWord(emptyStr)).toBe(0);
      expect(textStats.avgSentencesPerWord(emptyStr)).toBe(0);
      expect(textStats.avgWordsPerSentence(emptyStr)).toBe(0);
    });
  });

  describe("parameter variations", () => {
    it("avg syllables per word with interval", () => {
      textStats.setLang("en");
      const base = textStats.avgSyllablesPerWord(longTest);
      const withInterval = textStats.avgSyllablesPerWord(longTest, 10);
      assertDelta(withInterval, base * 10, 0.01);
    });

    it("mini word count with custom maxSize", () => {
      textStats.setLang("en");
      const count = textStats.miniWordCount(shortTest, 4);
      expect(count).toBe(4); // "Cool", "dogs", "wear", "da"
    });

    it("long word count with custom threshold", () => {
      textStats.setLang("en");
      const count = textStats.longWordCount(shortTest, 3);
      expect(count).toBe(4); // "Cool", "dogs", "wear", "sunglasses" — words > 3 chars
    });

    it("reading time with custom msPerChar", () => {
      textStats.setLang("en");
      const time = textStats.readingTime(longTest, 20);
      expect(time).toBeGreaterThan(0);
    });
  });

  describe("setLang", () => {
    it("switches language without throwing", () => {
      expect(() => textStats.setLang("es")).not.toThrow();
      expect(() => textStats.setLang("en")).not.toThrow();
    });
  });

  describe("cache disabled", () => {
    it("basic operations work with cache disabled", () => {
      const noCacheStats = new TextStats({ cache: false });
      noCacheStats.setLang("en");
      expect(noCacheStats.sentenceCount(longTest)).toBe(17);
      expect(noCacheStats.wordCount(longTest)).toBe(372);
      assertDelta(noCacheStats.avgSyllablesPerWord(longTest), 1.5, 0.05);
    });
  });

  it("reading time", () => {
    textStats.setLang("en");
    const time = textStats.readingTime(longTest);
    assertDelta(time, 25.68);
  });
});
