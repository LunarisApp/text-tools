import { describe, expect, it } from "@jest/globals";
import {
  consonants,
  getSentences,
  getWords,
  languages,
  removePunctuation,
  vowels,
} from "../src";

const punctText = `I said: 'This is a test sentence to test the remove_punctuation function.
It's short and not the work of a singer-songwriter. But it'll suffice.'
Your answer was: "I don't know. If I were you I'd write a test; just to make
sure, you're really just removing the characters you want to remove!" Didn't`;

const punctTextResultWApostr = `I said This is a test sentence to test the removepunctuation function
It's short and not the work of a singersongwriter But it'll suffice
Your answer was I don't know If I were you I'd write a test just to make
sure you're really just removing the characters you want to remove Didn't`;

const punctTextResultWoApostr = `I said This is a test sentence to test the removepunctuation function
Its short and not the work of a singersongwriter But itll suffice
Your answer was I dont know If I were you Id write a test just to make
sure youre really just removing the characters you want to remove Didnt`;

const simpleText =
  "This is a simple sentence. It has nothing special, but it has words. It has punctuation!";

describe("language tests", () => {
  describe("remove punctuation", () => {
    it("incl. apostr in contractions", () => {
      const text = removePunctuation(punctText);
      expect(text).toBe(punctTextResultWoApostr);
    });

    it("ignore contractions", () => {
      const text = removePunctuation(punctText, true);
      expect(text).toBe(punctTextResultWApostr);
    });

    it("should return empty string for empty input", () => {
      expect(removePunctuation("")).toBe("");
    });

    it("should return empty string for punctuation-only input", () => {
      expect(removePunctuation("!@#$%^&*()")).toBe("");
    });

    it("should preserve unicode text", () => {
      expect(removePunctuation("Привет, мир!")).toBe("Привет мир");
    });
  });

  describe("getWords", () => {
    it("should get words", () => {
      const words = getWords(punctText);
      expect(words).toHaveLength(53);
    });

    it("should return empty array for empty string", () => {
      expect(getWords("")).toEqual([]);
    });

    it("should return empty array for whitespace-only input", () => {
      expect(getWords("   ")).toEqual([]);
    });

    it("should handle single word", () => {
      expect(getWords("Hello")).toEqual(["hello"]);
    });

    it("should handle leading and trailing whitespace", () => {
      expect(getWords("  hello world  ")).toEqual(["hello", "world"]);
    });

    it("should return correct word content", () => {
      expect(getWords("Hello World")).toEqual(["hello", "world"]);
    });

    it("should keep punctuation when isRemovePunctuation is false", () => {
      const words = getWords("Hello, world!", false);
      expect(words).toEqual(["hello,", "world!"]);
    });
  });

  describe("getSentences", () => {
    it("should get sentences", () => {
      const sentences = getSentences(simpleText);
      expect(sentences).toHaveLength(3);
    });

    it("should return correct sentence content", () => {
      const sentences = getSentences(simpleText);
      expect(sentences).toEqual([
        "This is a simple sentence.",
        "It has nothing special, but it has words.",
        "It has punctuation!",
      ]);
    });

    it("should return empty array for empty string", () => {
      expect(getSentences("")).toEqual([]);
    });

    it("should handle text without punctuation", () => {
      const sentences = getSentences("Hello world");
      expect(sentences).toEqual(["Hello world"]);
    });

    it("should not have leading whitespace in sentences", () => {
      const sentences = getSentences("First. Second. Third.");
      for (const s of sentences) {
        expect(s).toBe(s.trim());
      }
    });

    it("should handle multiple consecutive punctuation marks", () => {
      const sentences = getSentences("Really?! Yes.");
      expect(sentences).toHaveLength(2);
    });
  });

  describe("vowels and consonants data validation", () => {
    it("every language should have vowels defined", () => {
      for (const lang of languages) {
        expect(vowels[lang]).toBeDefined();
        expect(vowels[lang].length).toBeGreaterThan(0);
      }
    });

    it("every language should have consonants defined", () => {
      for (const lang of languages) {
        expect(consonants[lang]).toBeDefined();
        expect(consonants[lang].length).toBeGreaterThan(0);
      }
    });

    it("no vowel should appear in consonants for the same language", () => {
      for (const lang of languages) {
        const langVowels = new Set(vowels[lang]);
        const langConsonants = consonants[lang];
        for (const c of langConsonants) {
          expect(langVowels.has(c)).toBe(false);
        }
      }
    });
  });
});
