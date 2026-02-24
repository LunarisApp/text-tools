import { describe, expect, it } from "@jest/globals";
import { TextReadability } from "../src";
import {
  easySpanishText,
  emptyStr,
  italianText,
  longRussianTextGuillemets,
  longSpanishText,
  longTest,
  shortText,
} from "./data";

function assertDelta(actual: number, expected: number, delta = 0.1) {
  if (Number.isNaN(actual)) {
    throw new Error(`actual is NaN; expected=${expected}`);
  }
  const diff = Math.abs(actual - expected);
  if (diff > delta) {
    throw new Error(
      `actual=${actual}; expected=${expected}; allowed error=${delta}`
    );
  }
}

describe("readability tests", () => {
  const textReadability = new TextReadability();
  it("support full locale lang", () => {
    textReadability.setLang("en_US");
    const score = textReadability.fleschReadingEase(longTest);
    assertDelta(score, 57.71, 3); // TODO: check delta
  });
  describe("flesch reading ease", () => {
    it("english config", () => {
      textReadability.setLang("en");
      const score = textReadability.fleschReadingEase(longTest);
      assertDelta(score, 57.71, 3); // TODO: check delta
    });
    it("german config", () => {
      textReadability.setLang("de");
      const score = textReadability.fleschReadingEase(longTest);
      assertDelta(score, 64.5, 3); // TODO: check delta
    });
    it("spanish config", () => {
      textReadability.setLang("es");
      const score = textReadability.fleschReadingEase(longTest);
      assertDelta(score, 86.76, 0.02); // TODO: check delta
    });
    it("french config", () => {
      textReadability.setLang("fr");
      const score = textReadability.fleschReadingEase(longTest);
      assertDelta(score, 81.73, 1); // TODO: check delta
    });
    it("italian config", () => {
      textReadability.setLang("it");
      const score = textReadability.fleschReadingEase(longTest);
      assertDelta(score, 91.57, 0.05); // TODO: check delta
    });
    it("dutch config", () => {
      textReadability.setLang("nl");
      const score = textReadability.fleschReadingEase(longTest);
      assertDelta(score, 63.27, 3); // TODO: check delta
    });
    it("russian config", () => {
      textReadability.setLang("ru");
      const score = textReadability.fleschReadingEase(longTest);
      assertDelta(score, 118.27, 0.02); // TODO: check delta
    });
    it("spanish config with spanish text", () => {
      textReadability.setLang("es");
      const score = textReadability.fleschReadingEase(longSpanishText);
      assertDelta(score, 65.97, 0.5);
    });
    it("italian config with italian text", () => {
      textReadability.setLang("it");
      const score = textReadability.fleschReadingEase(italianText);
      assertDelta(score, 26.93, 0.5);
    });
    it("russian config with russian text", () => {
      textReadability.setLang("ru");
      const score = textReadability.fleschReadingEase(
        longRussianTextGuillemets
      );
      assertDelta(score, 53.6, 1);
    });
    it("empty text", () => {
      textReadability.setLang("en");
      const score = textReadability.fleschReadingEase(emptyStr);
      assertDelta(score, 0);
    });
    it("polish config should throw", () => {
      textReadability.setLang("pl");
      expect(() => textReadability.fleschReadingEase(longTest)).toThrow();
    });
  });

  describe("flesch-kincaid grade", () => {
    it("long text", () => {
      textReadability.setLang("en");
      const score = textReadability.fleschKincaidGrade(longTest);
      assertDelta(score, 10.7, 0.5); // TODO: check delta
    });
    it("empty text", () => {
      textReadability.setLang("en");
      const score = textReadability.fleschKincaidGrade(emptyStr);
      assertDelta(score, 0);
    });
  });

  describe("smog index", () => {
    it("long text", () => {
      textReadability.setLang("en");
      const score = textReadability.smogIndex(longTest);
      assertDelta(score, 11.7, 0.1); // TODO: check delta
    });
    it("empty text", () => {
      textReadability.setLang("en");
      const score = textReadability.smogIndex(emptyStr);
      assertDelta(score, 0);
    });
  });

  describe("coleman-liau index", () => {
    it("long text", () => {
      textReadability.setLang("en");
      const score = textReadability.colemanLiauIndex(longTest);
      assertDelta(score, 8.99, 3); // TODO: check delta
    });
    it("empty text", () => {
      textReadability.setLang("en");
      const score = textReadability.colemanLiauIndex(emptyStr);
      assertDelta(score, 0);
    });
  });

  describe("automated readability index", () => {
    it("long text", () => {
      textReadability.setLang("en");
      const score = textReadability.automatedReadabilityIndex(longTest);
      assertDelta(score, 11.6, 0.05); // TODO: check delta
    });
    it("empty text", () => {
      textReadability.setLang("en");
      const score = textReadability.automatedReadabilityIndex(emptyStr);
      assertDelta(score, 0);
    });
  });

  describe("linsear write formula", () => {
    it("long text", () => {
      textReadability.setLang("en");
      const score = textReadability.linsearWriteFormula(longTest);
      assertDelta(score, 15.25);
    });
    it("empty text", () => {
      textReadability.setLang("en");
      const score = textReadability.linsearWriteFormula(emptyStr);
      assertDelta(score, 0);
    });
  });

  describe("gutierrez polini formula (Spanish)", () => {
    it("long text", () => {
      textReadability.setLang("es");
      const score = textReadability.gutierrezPolini(easySpanishText);
      assertDelta(score, 64.35, 2);
    });
    it("empty text", () => {
      textReadability.setLang("es");
      const score = textReadability.gutierrezPolini(emptyStr);
      assertDelta(score, 0);
    });
  });

  describe("rix", () => {
    it("empty text", () => {
      textReadability.setLang("en");
      const score = textReadability.rix(emptyStr);
      assertDelta(score, 0);
    });
    it("short text", () => {
      textReadability.setLang("en");
      const score = textReadability.rix(shortText);
      assertDelta(score, 1);
    });
    it("long text", () => {
      textReadability.setLang("en");
      const score = textReadability.rix(longTest);
      assertDelta(score, 4.529);
    });
  });

  describe("lix", () => {
    it("empty text", () => {
      textReadability.setLang("en");
      const score = textReadability.lix(emptyStr);
      assertDelta(score, 0);
    });
    it("short text", () => {
      textReadability.setLang("en");
      const score = textReadability.lix(shortText);
      assertDelta(score, 25);
    });
    it("long text", () => {
      textReadability.setLang("en");
      const score = textReadability.lix(longTest);
      assertDelta(score, 42.581, 0.5); // TODO: check delta
    });
  });

  describe("crawford formula (Spanish)", () => {
    it("long text", () => {
      textReadability.setLang("es");
      const score = textReadability.crawford(longSpanishText);
      assertDelta(score, 5.1, 0.3); // TODO: check delta
    });
    it("empty text", () => {
      textReadability.setLang("es");
      const score = textReadability.crawford(emptyStr);
      assertDelta(score, 0);
    });
  });

  it("gulpease index (Italian)", () => {
    textReadability.setLang("it");
    const score = textReadability.gulpeaseIndex(italianText);
    assertDelta(score, 40.1, 3); // TODO: check delta
  });

  describe("wiener sachtextformel (German)", () => {
    const wsSimple =
      "Alle meine Entchen schwimmen auf dem See, Köpfchen unters Wasser, Schwänzchen in die Höh.";
    const wsComplex =
      "Alle Parteien widmen dem Thema rein quantitativ betrachtet nennenswerte Aufmerksamkeit, die Grünen wenig überraschend am meisten.";

    it("variant 1 - simple", () => {
      textReadability.setLang("de");
      const score = textReadability.wienerSachtextformel(wsSimple, 1);
      assertDelta(score, 3.77, 1.5); // TODO: check delta
    });
    it("variant 1 - complex", () => {
      textReadability.setLang("de");
      const score = textReadability.wienerSachtextformel(wsComplex, 1);
      assertDelta(score, 13.91, 0.02);
    });
    it("variant 2 - simple", () => {
      textReadability.setLang("de");
      const score = textReadability.wienerSachtextformel(wsSimple, 2);
      assertDelta(score, 3.5, 1.5);
    });
    it("variant 2 - complex", () => {
      textReadability.setLang("de");
      const score = textReadability.wienerSachtextformel(wsComplex, 2);
      assertDelta(score, 13.45, 0.02);
    });
    it("variant 3 - simple", () => {
      textReadability.setLang("de");
      const score = textReadability.wienerSachtextformel(wsSimple, 3);
      assertDelta(score, 1.55, 1.5);
    });
    it("variant 3 - complex", () => {
      textReadability.setLang("de");
      const score = textReadability.wienerSachtextformel(wsComplex, 3);
      assertDelta(score, 13.04, 0.02);
    });
    it("variant 4 - simple", () => {
      textReadability.setLang("de");
      const score = textReadability.wienerSachtextformel(wsSimple, 4);
      assertDelta(score, 2.03, 1.5);
    });
    it("variant 4 - complex", () => {
      textReadability.setLang("de");
      const score = textReadability.wienerSachtextformel(wsComplex, 4);
      assertDelta(score, 12.85, 0.02);
    });
  });

  it("mcalpine eflaw", () => {
    textReadability.setLang("en");
    const score = textReadability.mcalpineEflaw(longTest);
    assertDelta(score, 30.8, 0.1);
  });
});
