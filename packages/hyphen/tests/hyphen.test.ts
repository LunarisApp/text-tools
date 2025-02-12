import { describe, it } from "node:test";
import * as assert from "node:assert";
import { Hyphen } from '../src';

describe("Hyphen Tests", () => {
  it("should correctly hyphenate words using inserted method", () => {
    const dic = new Hyphen({ lang: "nl_NL" });
    assert.strictEqual(dic.inserted("lettergrepen"), "let-ter-gre-pen");
  });

  it("should correctly wrap words", () => {
    const dic = new Hyphen({ lang: "nl_NL" });
    const actual = dic.wrap("autobandventieldopje", 11);
    const expected = ["autoband-", "ventieldopje"];
    assert.deepStrictEqual(actual, expected);
  });

  it("should iterate hyphenation positions correctly", () => {
    const dic = new Hyphen({ lang: "nl_NL" });
    const actual = [...dic.iterate("Amsterdam")];
    const expected = [
      ["Amster", "dam"],
      ["Am", "sterdam"],
    ];
    assert.deepStrictEqual(actual, expected);
  });

  it("should use a fallback dictionary", () => {
    const dic = new Hyphen({ lang: "nl_NL-variant" });
    const actual = [...dic.iterate("Amsterdam")];
    const expected = [
      ["Amster", "dam"],
      ["Am", "sterdam"],
    ];
    assert.deepStrictEqual(actual, expected);
  });

  it("should throw an error for a missing dictionary", () => {
    assert.throws(() => new Hyphen({ lang: "mi_SS" }), Error);
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
      const dic = new Hyphen({ lang: "nl_NL" });
      assert.strictEqual(dic.inserted("lettergrepen"), "let-ter-gre-pen");
    });
    it("left", () => {
      const dic = new Hyphen({ lang: "nl_NL", left: 4 });
      assert.strictEqual(dic.inserted("lettergrepen"), "letter-gre-pen");
    });
    it("right", () => {
      const dic = new Hyphen({ lang: "nl_NL", right: 4 });
      assert.strictEqual(dic.inserted("lettergrepen"), "let-ter-grepen");
    });
    it("both", () => {
      const dic = new Hyphen({ lang: "nl_NL", left: 4, right: 4 });
      assert.strictEqual(dic.inserted("lettergrepen"), "letter-grepen");
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
    const dic = new Hyphen({ lang: "nl_NL" });
    assert.strictEqual(dic.inserted("LETTERGREPEN"), "LET-TER-GRE-PEN");
  });

  // it("should support uppercase alternative parser", () => {
  //   const dic = new Hyphen({ lang: "hu", left: 1, right: 1 });
  //   assert.deepStrictEqual(
  //     [...dic.iterate("KULISSZA")],
  //     [
  //       ["KULISZ", "SZA"],
  //       ["KU", "LISSZA"],
  //     ],
  //   );
  //   assert.strictEqual(dic.inserted("KULISSZA"), "KU-LISZ-SZA");
  // });

  it("should correctly determine language fallbacks", () => {
    const hyp = new Hyphen();
    assert.strictEqual(hyp.getLanguageFallback("en"), "en");
    assert.strictEqual(hyp.getLanguageFallback("en_US"), "en_US");
    assert.strictEqual(hyp.getLanguageFallback("en_FR"), "en");
    assert.strictEqual(hyp.getLanguageFallback("sr-Latn"), "sr_Latn");
    assert.strictEqual(hyp.getLanguageFallback("SR-LATN"), "sr_Latn");
    assert.strictEqual(hyp.getLanguageFallback("sr-Cyrl"), "sr");
    assert.strictEqual(hyp.getLanguageFallback("fr-Latn-FR"), "fr");
    assert.strictEqual(hyp.getLanguageFallback("en-US_variant1-x"), "en_US");
  });
});
