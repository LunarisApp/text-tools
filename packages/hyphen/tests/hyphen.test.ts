import { describe, it, expect } from "@jest/globals";
import { TextHyphen } from "../src";

describe("hyphen tests", () => {
  it("should correctly hyphenate words using inserted method", () => {
    const dic = new TextHyphen({ lang: "nl_NL" });
    expect(dic.inserted("lettergrepen")).toBe("let-ter-gre-pen");
  });

  it("should correctly wrap words", () => {
    const dic = new TextHyphen({ lang: "nl_NL" });
    const actual = dic.wrap("autobandventieldopje", 11);
    const expected = ["autoband-", "ventieldopje"];
    expect(actual).toStrictEqual(expected);
  });

  it("should iterate hyphenation positions correctly", () => {
    const dic = new TextHyphen({ lang: "nl_NL" });
    console.log(dic);
    const actual = dic.variants("Amsterdam");
    const expected = [
      ["Amster", "dam"],
      ["Am", "sterdam"],
    ];
    expect(actual).toStrictEqual(expected);
  });

  it("should use a fallback dictionary", () => {
    const dic = new TextHyphen({ lang: "nl_NL-variant" });
    const actual = dic.variants("Amsterdam");
    const expected = [
      ["Amster", "dam"],
      ["Am", "sterdam"],
    ];
    expect(actual).toStrictEqual(expected);
  });

  it("should throw an error for a missing dictionary", () => {
    expect(() => new TextHyphen({ lang: "mi_SS" })).toThrowError();
  });

  // it('should use a custom dictionary', () => {
  //   const dic = new Hyphen('fr');
  //   expect(dic.inserted('autobandventieldopje')).to.not.equal(
  //     'au-to-band-ven-tiel-dop-je'
  //   );
  //   Hyphen.LANGUAGES['fr'] = Hyphen.LANGUAGES['nl_NL'];
  //   const dicNew = new Hyphen('fr');
  //   expect(dicNew.inserted('autobandventieldopje')).to.equal(
  //     'au-to-band-ven-tiel-dop-je'
  //   );
  // });

  describe("should support left and right hyphenation constraints", () => {
    it("default", () => {
      const dic = new TextHyphen({ lang: "nl_NL" });
      expect(dic.inserted("lettergrepen")).toBe("let-ter-gre-pen");
    });
    it("left", () => {
      const dic = new TextHyphen({ lang: "nl_NL", left: 4 });
      expect(dic.inserted("lettergrepen")).toBe("letter-gre-pen");
    });
    it("right", () => {
      const dic = new TextHyphen({ lang: "nl_NL", right: 4 });
      expect(dic.inserted("lettergrepen")).toBe("let-ter-grepen");
    });
    it("both", () => {
      const dic = new TextHyphen({ lang: "nl_NL", left: 4, right: 4 });
      expect(dic.inserted("lettergrepen")).toBe("letter-grepen");
    });
  });

  // it("should support alternative parser for hyphenation", () => {
  //   const dic = new Hyphen({ lang: "hu", left: 1, right: 1 });
  //   assert.deepStrictEqual(
  //     [...dic.iterate("kulissza")],
  //     [
  //       ["kulisz", "sza"],
  //       ["ku", "lissza"],
  //     ],
  //   );
  //   assert.strictEqual(dic.inserted("kulissza"), "ku-lisz-sza");
  // });

  it("should handle uppercase words correctly", () => {
    const dic = new TextHyphen({ lang: "nl_NL" });
    expect(dic.inserted("LETTERGREPEN")).toBe("LET-TER-GRE-PEN");
  });

  // it("should support uppercase alternative parser", () => {
  //   const dic = new Hyphen({ lang: "hu", left: 1, right: 1 });
  //   assert.deepStrictEqual(dic.variants("KULISSZA"), [
  //     ["KULISZ", "SZA"],
  //     ["KU", "LISSZA"],
  //   ]);
  //   assert.strictEqual(dic.inserted("KULISSZA"), "KU-LISZ-SZA");
  // });

  it("should be able to load all dictionaries", () => {
    const hyp = new TextHyphen();
    const dictionaries = hyp.dictionaries;
    Object.keys(dictionaries).forEach((dict) => {
      new TextHyphen({ lang: dict });
    });
  });

  it("should correctly determine language fallbacks", () => {
    const hyp = new TextHyphen();
    expect(hyp.getLanguageFallback("en")).toBe("en");
    expect(hyp.getLanguageFallback("en_US")).toBe("en_US");
    expect(hyp.getLanguageFallback("en_FR")).toBe("en");
    expect(hyp.getLanguageFallback("sr-Latn")).toBe("sr_Latn");
    expect(hyp.getLanguageFallback("SR-LATN")).toBe("sr_Latn");
    expect(hyp.getLanguageFallback("sr-Cyrl")).toBe("sr");
    expect(hyp.getLanguageFallback("fr-Latn-FR")).toBe("fr");
    expect(hyp.getLanguageFallback("en-US_variant1-x")).toBe("en_US");
  });
});
