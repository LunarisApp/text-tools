import { describe, expect, it } from "@jest/globals";
import { TextHyphen } from "../src";

describe("hyphen tests", () => {
  it("should correctly hyphenate words using inserted method", () => {
    const dic = new TextHyphen({ lang: "nl" });
    expect(dic.inserted("lettergrepen")).toBe("let-ter-gre-pen");
  });

  it("should correctly wrap words", () => {
    const dic = new TextHyphen({ lang: "nl" });
    const actual = dic.wrap("autobandventieldopje", 11);
    const expected = ["autoband-", "ventieldopje"];
    expect(actual).toStrictEqual(expected);
  });

  it("should iterate hyphenation positions correctly", () => {
    const dic = new TextHyphen({ lang: "nl" });
    const actual = dic.variants("Amsterdam");
    const expected = [
      ["Amster", "dam"],
      ["Am", "sterdam"],
    ];
    expect(actual).toStrictEqual(expected);
  });

  describe("should support left and right hyphenation constraints", () => {
    it("default", () => {
      const dic = new TextHyphen({ lang: "nl" });
      expect(dic.inserted("lettergrepen")).toBe("let-ter-gre-pen");
    });
    it("left", () => {
      const dic = new TextHyphen({ lang: "nl", left: 4 });
      expect(dic.inserted("lettergrepen")).toBe("letter-gre-pen");
    });
    it("right", () => {
      const dic = new TextHyphen({ lang: "nl", right: 4 });
      expect(dic.inserted("lettergrepen")).toBe("let-ter-grepen");
    });
    it("both", () => {
      const dic = new TextHyphen({ lang: "nl", left: 4, right: 4 });
      expect(dic.inserted("lettergrepen")).toBe("letter-grepen");
    });
  });

  it("should handle uppercase words correctly", () => {
    const dic = new TextHyphen({ lang: "nl" });
    expect(dic.inserted("LETTERGREPEN")).toBe("LET-TER-GRE-PEN");
  });

  describe("positions()", () => {
    it("returns positions for a Dutch word", () => {
      const dic = new TextHyphen({ lang: "nl" });
      const positions = dic.positions("lettergrepen");
      expect(positions).toStrictEqual([3, 6, 9]);
    });

    it("returns positions for an English word", () => {
      const dic = new TextHyphen({ lang: "en" });
      const positions = dic.positions("hyphenation");
      expect(positions.length).toBeGreaterThan(0);
      for (const pos of positions) {
        expect(pos).toBeGreaterThanOrEqual(2);
        expect(pos).toBeLessThanOrEqual("hyphenation".length - 2);
      }
    });

    it("respects left/right constraints", () => {
      const dic = new TextHyphen({ lang: "nl", left: 4, right: 4 });
      const positions = dic.positions("lettergrepen");
      for (const pos of positions) {
        expect(pos).toBeGreaterThanOrEqual(4);
        expect(pos).toBeLessThanOrEqual("lettergrepen".length - 4);
      }
    });

    it("returns empty for short words", () => {
      const dic = new TextHyphen({ lang: "nl" });
      expect(dic.positions("be")).toStrictEqual([]);
    });

    it("returns empty for empty string", () => {
      const dic = new TextHyphen({ lang: "nl" });
      expect(dic.positions("")).toStrictEqual([]);
    });
  });

  describe("iterate()", () => {
    it("yields split pairs", () => {
      const dic = new TextHyphen({ lang: "nl" });
      const pairs = [...dic.iterate("lettergrepen")];
      expect(pairs.length).toBeGreaterThan(0);
      for (const [left, right] of pairs) {
        expect(left + right).toBe("lettergrepen");
      }
    });

    it("respects left/right constraints", () => {
      const dic = new TextHyphen({ lang: "nl", left: 4, right: 4 });
      const pairs = [...dic.iterate("lettergrepen")];
      for (const [left, right] of pairs) {
        expect(left.length).toBeGreaterThanOrEqual(4);
        expect(right.length).toBeGreaterThanOrEqual(4);
      }
    });

    it("yields nothing for unhyphenatable words", () => {
      const dic = new TextHyphen({ lang: "nl" });
      const pairs = [...dic.iterate("ab")];
      expect(pairs).toStrictEqual([]);
    });
  });

  describe("variants() with constraints", () => {
    it("respects left constraint", () => {
      const dic = new TextHyphen({ lang: "nl", left: 4 });
      const variants = dic.variants("lettergrepen");
      for (const [left] of variants) {
        expect(left.length).toBeGreaterThanOrEqual(4);
      }
    });

    it("respects right constraint", () => {
      const dic = new TextHyphen({ lang: "nl", right: 4 });
      const variants = dic.variants("lettergrepen");
      for (const [, right] of variants) {
        expect(right.length).toBeGreaterThanOrEqual(4);
      }
    });

    it("respects both constraints", () => {
      const dic = new TextHyphen({ lang: "nl", left: 4, right: 4 });
      const variants = dic.variants("lettergrepen");
      for (const [left, right] of variants) {
        expect(left.length).toBeGreaterThanOrEqual(4);
        expect(right.length).toBeGreaterThanOrEqual(4);
      }
    });
  });

  describe("wrap() edge cases", () => {
    it("returns null for unhyphenatable words", () => {
      const dic = new TextHyphen({ lang: "nl" });
      expect(dic.wrap("ab", 10)).toBeNull();
    });

    it("returns null when width is too small for any split", () => {
      const dic = new TextHyphen({ lang: "nl" });
      expect(dic.wrap("lettergrepen", 2)).toBeNull();
    });

    it("respects left/right constraints", () => {
      const dic = new TextHyphen({ lang: "nl", left: 4, right: 4 });
      const result = dic.wrap("lettergrepen", 8);
      if (result) {
        const [left] = result;
        const leftWord = left.slice(0, -1); // strip hyphen char
        expect(leftWord.length).toBeGreaterThanOrEqual(4);
      }
    });

    it("supports custom hyphen character", () => {
      const dic = new TextHyphen({ lang: "nl" });
      const result = dic.wrap("lettergrepen", 12, "~");
      expect(result).not.toBeNull();
      expect(result?.[0]).toContain("~");
      expect(result?.[0]).not.toContain("-");
    });
  });

  describe("inserted() custom hyphen", () => {
    it("supports custom single char", () => {
      const dic = new TextHyphen({ lang: "nl" });
      expect(dic.inserted("lettergrepen", "|")).toBe("let|ter|gre|pen");
    });

    it("supports multi-char separator", () => {
      const dic = new TextHyphen({ lang: "nl" });
      expect(dic.inserted("lettergrepen", "··")).toBe("let··ter··gre··pen");
    });
  });

  describe("constructor defaults", () => {
    it("defaults to English with no args", () => {
      const dic = new TextHyphen();
      const positions = dic.positions("hyphenation");
      expect(positions.length).toBeGreaterThan(0);
    });

    it("defaults to English with empty object", () => {
      const dic = new TextHyphen({});
      const positions = dic.positions("hyphenation");
      expect(positions.length).toBeGreaterThan(0);
    });

    it("defaults left=2 and right=2", () => {
      const dic = new TextHyphen({ lang: "nl" });
      const positions = dic.positions("lettergrepen");
      for (const pos of positions) {
        expect(pos).toBeGreaterThanOrEqual(2);
        expect(pos).toBeLessThanOrEqual("lettergrepen".length - 2);
      }
    });
  });

  describe("edge cases", () => {
    it("empty string returns empty on all methods", () => {
      const dic = new TextHyphen({ lang: "nl" });
      expect(dic.positions("")).toStrictEqual([]);
      expect(dic.inserted("")).toBe("");
      expect(dic.variants("")).toStrictEqual([]);
      expect(dic.wrap("", 10)).toBeNull();
    });

    it("single character returns empty/unchanged on all methods", () => {
      const dic = new TextHyphen({ lang: "nl" });
      expect(dic.positions("a")).toStrictEqual([]);
      expect(dic.inserted("a")).toBe("a");
      expect(dic.variants("a")).toStrictEqual([]);
      expect(dic.wrap("a", 10)).toBeNull();
    });
  });
});
