import { describe, it } from "node:test";
import { textstat } from "../src";
import {
  longTest,
  punctText,
  punctTextResultWApostr,
  punctTextResultWoApostr,
  testSyllableCountCases,
} from "./data";
import { assertDelta } from "../src/utils";
import assert from 'node:assert'

describe("basic stats", () => {
  describe("counts", () => {
    it("char count", () => {
      textstat.setLang("en");
      const count = textstat.charCount(longTest);
      const countSpaces = textstat.charCount(longTest, false);
      assert.strictEqual(count, 1748);
      assert.strictEqual(countSpaces, 2123);
    });

    it("letter count", () => {
      textstat.setLang("en");
      const count = textstat.letterCount(longTest);
      const countSpaces = textstat.letterCount(longTest, false);
      assert.strictEqual(count, 1686);
      assert.strictEqual(countSpaces, 2061);
    });

    it("lexicon count", () => {
      textstat.setLang("en");
      const count = textstat.lexiconCount(longTest);
      const countPunct = textstat.lexiconCount(longTest, false);
      assert.strictEqual(count, 372);
      assert.strictEqual(countPunct, 376);
    });

    it("sentence count", () => {
      textstat.setLang("en");
      const count = textstat.sentenceCount(longTest);
      assert.strictEqual(count, 17);
    });

    // it('sentence count russian', () => {
    //     textstat.setLang('ru_RU')
    //     const count = textstat.sentenceCount(longRussianTextGuillemets)
    //     assert.strictEqual(count, 16)
    // })

    describe("syllable count", () => {
      testSyllableCountCases.forEach((testCase) => {
        const [lang, text, expected, delta] = testCase;
        it(`syllable count: ${(text as string).slice(0, 10)}${(text as string).length >= 10 ? "..." : ""}`, () => {
          textstat.setLang(lang as string);
          const actual = textstat.syllableCount(text as string);
          assertDelta(actual, expected as number, delta as number);
        });
      });
    });
  });

  describe("remove punctuation", () => {
    it("incl. apostrophe", () => {
      textstat.setLang("en");
      textstat.setRmApostrophe(true);
      const text = textstat.removePunctuation(punctText);
      textstat.setRmApostrophe(false);
      assert.strictEqual(text, punctTextResultWoApostr);
    });

    it("excl. apostrophe", () => {
      textstat.setLang("en");
      const text = textstat.removePunctuation(punctText);
      assert.strictEqual(text, punctTextResultWApostr);
    });
  });

  describe("averages", () => {
    it("avg sentence length", () => {
      textstat.setLang("en");
      const avg = textstat.avgSentenceLength(longTest);
      assertDelta(avg, 21.9, 0.05); // TODO: check delta
    });

    it("avg syllables per word", () => {
      textstat.setLang("en");
      const avg = textstat.avgSyllablesPerWord(longTest);
      assertDelta(avg, 1.5, 0.05); // TODO: check delta
    });

    it("avg letters per word", () => {
      textstat.setLang("en");
      const avg = textstat.avgLettersPerWord(longTest);
      assertDelta(avg, 4.53);
    });

    it("avg sentence per word", () => {
      textstat.setLang("en");
      const avg = textstat.avgSentencesPerWord(longTest);
      assertDelta(avg, 0.05);
    });
  });

  it("reading time", () => {
    textstat.setLang("en");
    const time = textstat.readingTime(longTest);
    assertDelta(time, 25.68);
  });
});
