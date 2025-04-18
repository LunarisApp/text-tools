import { describe, expect, it } from "@jest/globals";
import {
  longRussianTextGuillemets,
  longTest,
  testSyllableCountCases,
} from "./data";
import { Language, TextStats } from "../src";

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
      testSyllableCountCases.forEach((testCase) => {
        const [lang, text, expected, delta] = testCase;
        it(`syllable count: ${(text as string).slice(0, 10)}${(text as string).length >= 10 ? "..." : ""}`, () => {
          textStats.setLang(lang as Language);
          const actual = textStats.syllableCount(text as string);
          assertDelta(actual, expected as number, delta as number);
        });
      });
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
  });

  it("reading time", () => {
    textStats.setLang("en");
    const time = textStats.readingTime(longTest);
    assertDelta(time, 25.68);
  });
});
