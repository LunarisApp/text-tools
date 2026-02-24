import { describe, expect, it } from "@jest/globals";
import cmudict from "../src";

describe("cmudict tests", () => {
  const cmuDict = cmudict.dict();
  const cmuPhones = cmudict.phones();
  const cmuVp = cmudict.vp();
  const cmuSymbols = cmudict.symbols();

  // Files contain empty lines at the end, so just to be sure it's not included.
  // P.S. I'm reversing, coz just nicer to log; the problem is usually at the end.
  describe("no empty strings", () => {
    it("dictionary", () => {
      const keys = Object.keys(cmuDict).reverse();
      expect(keys).not.toContain("");

      const entries = Object.entries(cmuDict).reverse();
      expect(entries).not.toContainEqual(["", []]);
      expect(entries).not.toContainEqual(["", [""]]);
    });
    it("phones", () => {
      const rev = cmuPhones.reverse();
      expect(rev).not.toContainEqual(["", []]);
      expect(rev).not.toContainEqual(["", [""]]);
    });
    it("vp", () => {
      const keys = Object.keys(cmuVp).reverse();
      expect(keys).not.toContain("");

      const entries = Object.entries(cmuVp).reverse();
      expect(entries).not.toContainEqual(["", []]);
      expect(entries).not.toContainEqual(["", [""]]);
    });
    it("symbols", () => {
      expect(cmuSymbols.reverse()).not.toContainEqual("");
    });
  });

  it("dictionary should return expected pronunciations", () => {
    const cases = {
      "d'artagnan": [["D", "AH0", "R", "T", "AE1", "NG", "Y", "AH0", "N"]],
      danglar: [["D", "AH0", "NG", "L", "AA1", "R"]],
      danglars: [["D", "AH0", "NG", "L", "AA1", "R", "Z"]],
      gdp: [["G", "IY1", "D", "IY1", "P", "IY1"]],
      hiv: [["EY1", "CH", "AY1", "V", "IY1"]],
      porthos: [["P", "AO0", "R", "T", "AO1", "S"]],
      spieth: [
        ["S", "P", "IY1", "TH"],
        ["S", "P", "AY1", "AH0", "TH"],
      ],
    };
    for (const [word, expected] of Object.entries(cases)) {
      expect(cmuDict[word]).toEqual(expected);
    }
  });

  it("phones should return known phone-to-type mappings", () => {
    const phonesMap = new Map(cmuPhones);
    expect(phonesMap.get("AA")).toEqual(["vowel"]);
    expect(phonesMap.get("B")).toEqual(["stop"]);
    expect(phonesMap.get("CH")).toEqual(["affricate"]);
    expect(phonesMap.get("DH")).toEqual(["fricative"]);
    expect(phonesMap.get("HH")).toEqual(["aspirate"]);
    expect(phonesMap.get("L")).toEqual(["liquid"]);
    expect(phonesMap.get("M")).toEqual(["nasal"]);
    expect(phonesMap.get("NG")).toEqual(["nasal"]);
    expect(phonesMap.get("R")).toEqual(["liquid"]);
    expect(phonesMap.get("W")).toEqual(["semivowel"]);
  });

  it("symbols should contain known symbols", () => {
    expect(cmuSymbols).toContain("AA");
    expect(cmuSymbols).toContain("AA0");
    expect(cmuSymbols).toContain("AA1");
    expect(cmuSymbols).toContain("AA2");
    expect(cmuSymbols).toContain("ZH");
    expect(cmuSymbols.length).toBeGreaterThan(70);
  });

  it("entries should return [word, phonemes] tuples consistent with dict", () => {
    const cmuEntries = cmudict.entries();
    expect(cmuEntries.length).toBeGreaterThan(100_000);
    // Each entry should be a [string, string[]] tuple
    const [word, phonemes] = cmuEntries[0];
    expect(typeof word).toBe("string");
    expect(Array.isArray(phonemes)).toBe(true);
    // The word should exist in the dict with a matching pronunciation
    expect(cmuDict[word]).toBeDefined();
    expect(cmuDict[word]).toContainEqual(phonemes);
  });

  it("words should return the same words as entries", () => {
    const cmuWords = cmudict.words();
    const cmuEntries = cmudict.entries();
    expect(cmuWords).toEqual(cmuEntries.map(([w]) => w));
  });

  it("dict should collapse variant suffixes into multiple pronunciations", () => {
    // "a" has a(2) and a(3) variants in the dictionary
    expect(cmuDict.a.length).toBeGreaterThanOrEqual(2);
    // aalborg has aalborg and aalborg(2)
    expect(cmuDict.aalborg).toEqual([
      ["AO1", "L", "B", "AO0", "R", "G"],
      ["AA1", "L", "B", "AO0", "R", "G"],
    ]);
  });

  it("vp should return expected pronunciations", () => {
    const cases = {
      "!exclamation-point": [
        [
          "EH2",
          "K",
          "S",
          "K",
          "L",
          "AH0",
          "M",
          "EY1",
          "SH",
          "AH0",
          "N",
          "P",
          "OY2",
          "N",
          "T",
        ],
      ],
      '"close-quote': [["K", "L", "OW1", "Z", "K", "W", "OW1", "T"]],
      '"double-quote': [["D", "AH1", "B", "AH0", "L", "K", "W", "OW1", "T"]],
      '"end-of-quote': [["EH1", "N", "D", "AH0", "V", "K", "W", "OW1", "T"]],
      '"end-quote': [["EH1", "N", "D", "K", "W", "OW1", "T"]],
      '"in-quotes': [["IH1", "N", "K", "W", "OW1", "T", "S"]],
      '"quote': [["K", "W", "OW1", "T"]],
      '"unquote': [["AH1", "N", "K", "W", "OW1", "T"]],
      "#sharp-sign": [["SH", "AA1", "R", "P", "S", "AY1", "N"]],
      "%percent": [["P", "ER0", "S", "EH1", "N", "T"]],
      "&ampersand": [["AE1", "M", "P", "ER0", "S", "AE2", "N", "D"]],
      "(begin-parens": [
        ["B", "IH0", "G", "IH1", "N", "P", "ER0", "EH1", "N", "Z"],
      ],
      "(in-parentheses": [
        ["IH1", "N", "P", "ER0", "EH1", "N", "TH", "AH0", "S", "IY2", "Z"],
      ],
      "(left-paren": [["L", "EH1", "F", "T", "P", "ER0", "EH1", "N"]],
      "(open-parentheses": [
        [
          "OW1",
          "P",
          "AH0",
          "N",
          "P",
          "ER0",
          "EH1",
          "N",
          "TH",
          "AH0",
          "S",
          "IY2",
          "Z",
        ],
      ],
      "(paren": [["P", "ER0", "EH1", "N"]],
      "(parens": [["P", "ER0", "EH1", "N", "Z"]],
      "(parentheses": [["P", "ER0", "EH1", "N", "TH", "AH0", "S", "IY2", "Z"]],
      ")close-paren": [["K", "L", "OW1", "Z", "P", "ER0", "EH1", "N"]],
      ")close-parentheses": [
        [
          "K",
          "L",
          "OW1",
          "Z",
          "P",
          "ER0",
          "EH1",
          "N",
          "TH",
          "AH0",
          "S",
          "IY2",
          "Z",
        ],
      ],
      ")end-paren": [["EH1", "N", "D", "P", "ER0", "EH1", "N"]],
      ")end-parens": [["EH1", "N", "D", "P", "ER0", "EH1", "N", "Z"]],
      ")end-parentheses": [
        ["EH1", "N", "D", "P", "ER0", "EH1", "N", "TH", "AH0", "S", "IY2", "Z"],
      ],
      ")end-the-paren": [
        ["EH1", "N", "D", "DH", "AH0", "P", "ER0", "EH1", "N"],
      ],
      ")paren": [["P", "ER0", "EH1", "N"]],
      ")parens": [["P", "ER0", "EH1", "N", "Z"]],
      ")right-paren": [
        ["R", "AY1", "T", "P", "ER0", "EH1", "N"],
        ["R", "AY1", "T", "P", "EH1", "R", "AH0", "N"],
      ],
      ")un-parentheses": [
        ["AH1", "N", "P", "ER0", "EH1", "N", "TH", "AH0", "S", "IY1", "Z"],
      ],
      ",comma": [["K", "AA1", "M", "AH0"]],
      "-dash": [["D", "AE1", "SH"]],
      "-hyphen": [["HH", "AY1", "F", "AH0", "N"]],
      "...ellipsis": [["IH0", "L", "IH1", "P", "S", "IH0", "S"]],
      ".decimal": [["D", "EH1", "S", "AH0", "M", "AH0", "L"]],
      ".dot": [["D", "AA1", "T"]],
      ".full-stop": [["F", "UH1", "L", "S", "T", "AA1", "P"]],
      ".period": [["P", "IH1", "R", "IY0", "AH0", "D"]],
      ".point": [["P", "OY1", "N", "T"]],
      "/slash": [["S", "L", "AE1", "SH"]],
      ":colon": [["K", "OW1", "L", "AH0", "N"]],
      ";semi-colon": [
        ["S", "EH1", "M", "IY0", "K", "OW1", "L", "AH0", "N"],
        ["S", "EH1", "M", "IH0", "K", "OW2", "L", "AH0", "N"],
      ],
      "?question-mark": [
        ["K", "W", "EH1", "S", "CH", "AH0", "N", "M", "AA1", "R", "K"],
      ],
      "{brace": [["B", "R", "EY1", "S"]],
      "{left-brace": [["L", "EH1", "F", "T", "B", "R", "EY1", "S"]],
      "{open-brace": [["OW1", "P", "EH0", "N", "B", "R", "EY1", "S"]],
      "}close-brace": [["K", "L", "OW1", "Z", "B", "R", "EY1", "S"]],
      "}right-brace": [["R", "AY1", "T", "B", "R", "EY1", "S"]],
      "'end-inner-quote": [
        ["EH1", "N", "D", "IH1", "N", "ER0", "K", "W", "OW1", "T"],
      ],
      "'end-quote": [["EH1", "N", "D", "K", "W", "OW1", "T"]],
      "'inner-quote": [["IH1", "N", "ER0", "K", "W", "OW1", "T"]],
      "'single-quote": [
        ["S", "IH1", "NG", "G", "AH0", "L", "K", "W", "OW1", "T"],
      ],
      "'quote": [["K", "W", "OW1", "T"]],
      "'apostrophe": [["AH0", "P", "AA1", "S", "T", "R", "AH0", "F", "IY0"]],
    };
    for (const [word, expected] of Object.entries(cases)) {
      expect(cmuVp[word]).toEqual(expected);
    }
  });
});
