import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, expect, it } from "@jest/globals";
import { type Language, TextStats } from "../src";
import { TextStatsSyllables } from "../src/syllables";
import {
  emptyStr,
  italianText,
  longRussianTextGuillemets,
  longSpanishText,
  longTest,
  shortTest,
  testSyllableCountCases,
} from "./data";

function assertDelta(actual: number, expected: number, delta = 0.1) {
  return expect(Math.abs(actual - expected)).toBeLessThanOrEqual(delta);
}

describe("stats tests", () => {
  const textStats = new TextStats();
  const syllableStats = new TextStatsSyllables();
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
          syllableStats.setLang(lang as Language);
          const actual = syllableStats.syllableCount(text as string);
          assertDelta(actual, expected as number, delta as number);
        });
      }
    });

    it("polysyllable count", () => {
      syllableStats.setLang("en");
      const count = syllableStats.polysyllableCount(longTest);
      expect(count).toBe(38);
    });

    it("monosyllable count", () => {
      syllableStats.setLang("en");
      const count = syllableStats.monosyllableCount(longTest);
      expect(count).toBe(249);
    });

    it("polysyllable count single word", () => {
      syllableStats.setLang("en");
      expect(syllableStats.polysyllableCount("interesting")).toBe(1);
      expect(syllableStats.polysyllableCount("dog")).toBe(0);
    });

    it("monosyllable count single word", () => {
      syllableStats.setLang("en");
      expect(syllableStats.monosyllableCount("dog")).toBe(1);
      expect(syllableStats.monosyllableCount("interesting")).toBe(0);
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
      assertDelta(avg, 21.88, 0.01);
    });

    it("avg syllables per word", () => {
      syllableStats.setLang("en");
      const avg = syllableStats.avgSyllablesPerWord(longTest);
      assertDelta(avg, 1.48, 0.01);
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
      assertDelta(avg, 21.88, 0.01);
    });
  });

  describe("empty text", () => {
    it("all lightweight count methods return 0", () => {
      textStats.setLang("en");
      expect(textStats.charCount(emptyStr)).toBe(0);
      expect(textStats.letterCount(emptyStr)).toBe(0);
      expect(textStats.vowelCount(emptyStr)).toBe(0);
      expect(textStats.consonantCount(emptyStr)).toBe(0);
      expect(textStats.wordCount(emptyStr)).toBe(0);
      expect(textStats.sentenceCount(emptyStr)).toBe(0);
      expect(textStats.miniWordCount(emptyStr)).toBe(0);
      expect(textStats.longWordCount(emptyStr)).toBe(0);
    });

    it("all lightweight average methods return 0", () => {
      textStats.setLang("en");
      expect(textStats.avgSentenceLength(emptyStr)).toBe(0);
      expect(textStats.avgCharactersPerWord(emptyStr)).toBe(0);
      expect(textStats.avgLettersPerWord(emptyStr)).toBe(0);
      expect(textStats.avgSentencesPerWord(emptyStr)).toBe(0);
      expect(textStats.avgWordsPerSentence(emptyStr)).toBe(0);
    });

    it("all syllable methods return 0", () => {
      syllableStats.setLang("en");
      expect(syllableStats.syllableCount(emptyStr)).toBe(0);
      expect(syllableStats.polysyllableCount(emptyStr)).toBe(0);
      expect(syllableStats.monosyllableCount(emptyStr)).toBe(0);
      expect(syllableStats.avgSyllablesPerWord(emptyStr)).toBe(0);
    });
  });

  describe("parameter variations", () => {
    it("avg syllables per word with interval", () => {
      syllableStats.setLang("en");
      const base = syllableStats.avgSyllablesPerWord(longTest);
      const withInterval = syllableStats.avgSyllablesPerWord(longTest, 10);
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

  describe("reading time", () => {
    it("normal text", () => {
      textStats.setLang("en");
      const time = textStats.readingTime(longTest);
      assertDelta(time, 25.68);
    });

    it("empty text returns 0", () => {
      textStats.setLang("en");
      expect(textStats.readingTime("")).toBe(0);
    });

    it("single word", () => {
      textStats.setLang("en");
      const time = textStats.readingTime("Hello");
      assertDelta(time, 0.073, 0.001);
    });
  });

  describe("multilingual", () => {
    it("spanish word and sentence counts", () => {
      textStats.setLang("es");
      expect(textStats.wordCount(longSpanishText)).toBe(162);
      expect(textStats.sentenceCount(longSpanishText)).toBe(6);
    });

    it("spanish vowel and consonant counts", () => {
      textStats.setLang("es");
      expect(textStats.vowelCount(longSpanishText)).toBe(352);
      expect(textStats.consonantCount(longSpanishText)).toBe(419);
    });

    it("spanish syllable count", () => {
      syllableStats.setLang("es");
      assertDelta(syllableStats.syllableCount(longSpanishText), 306, 10);
    });

    it("italian counts", () => {
      textStats.setLang("it");
      expect(textStats.wordCount(italianText)).toBe(18);
      expect(textStats.sentenceCount(italianText)).toBe(1);
      expect(textStats.vowelCount(italianText)).toBe(54);
      expect(textStats.consonantCount(italianText)).toBe(57);
    });

    it("russian vowel and consonant counts", () => {
      textStats.setLang("ru");
      expect(textStats.vowelCount(longRussianTextGuillemets)).toBe(674);
      expect(textStats.consonantCount(longRussianTextGuillemets)).toBe(891);
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
    });

    it("syllable operations work with cache disabled", () => {
      const noCacheStats = new TextStatsSyllables({ cache: false });
      noCacheStats.setLang("en");
      assertDelta(noCacheStats.avgSyllablesPerWord(longTest), 1.48, 0.01);
    });
  });

  describe("build output", () => {
    it("root ESM does not reference syllable dictionaries", () => {
      const distPath = join(process.cwd(), "dist/index.mjs");
      if (!existsSync(distPath)) {
        return;
      }
      const seen = new Set<string>();
      const readImportGraph = (path: string): string => {
        if (seen.has(path)) {
          return "";
        }
        seen.add(path);
        const source = readFileSync(path, "utf8");
        const imports = Array.from(
          source.matchAll(/from\s+["'](\.\/[^"']+)["']/g)
        ).map((match) => match[1]);
        return [
          source,
          ...imports.map((specifier) =>
            readImportGraph(join(dirname(path), specifier))
          ),
        ].join("\n");
      };
      const output = readImportGraph(distPath);
      expect(output).not.toContain("@lunarisapp/cmudict");
      expect(output).not.toContain("@lunarisapp/hyphen");
    });
  });
});
