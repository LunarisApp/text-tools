import { describe, it } from "node:test";
import { textstat } from "../src";
import {
  easySpanishText,
  emptyStr,
  italianText,
  longSpanishText,
  longTest,
} from "./data";
import assert from "node:assert";
import { assertDelta } from "../src/utils/utils";

describe("readability tests", () => {
  describe("flesch reading ease", () => {
    it("english config", () => {
      textstat.setLang("en");
      const score = textstat.fleschReadingEase(longTest);
      assertDelta(score, 57.71, 3); // TODO: check delta
    });
    it("german config", () => {
      textstat.setLang("de");
      const score = textstat.fleschReadingEase(longTest);
      assertDelta(score, 64.5, 3); // TODO: check delta
    });
    it("spanish config", () => {
      textstat.setLang("es");
      const score = textstat.fleschReadingEase(longTest);
      assertDelta(score, 86.76, 0.02); // TODO: check delta
    });
    it("french config", () => {
      textstat.setLang("fr");
      const score = textstat.fleschReadingEase(longTest);
      assertDelta(score, 81.73, 1); // TODO: check delta
    });
    it("italian config", () => {
      textstat.setLang("it");
      const score = textstat.fleschReadingEase(longTest);
      assertDelta(score, 91.57, 0.05); // TODO: check delta
    });
    it("dutch config", () => {
      textstat.setLang("nl");
      const score = textstat.fleschReadingEase(longTest);
      assertDelta(score, 63.27, 3); // TODO: check delta
    });
    it("russian config", () => {
      textstat.setLang("ru");
      const score = textstat.fleschReadingEase(longTest);
      assertDelta(score, 118.27, 0.02); // TODO: check delta
    });
    it("polish config should throw", () => {
      textstat.setLang("pl");
      assert.throws(() => textstat.fleschReadingEase(longTest));
    });
  });

  it("flesch-kincaid grade", () => {
    textstat.setLang("en");
    const score = textstat.fleschKincaidGrade(longTest);
    assertDelta(score, 10.7, 0.5); // TODO: check delta
  });

  it("smog index", () => {
    textstat.setLang("en");
    const score = textstat.smogIndex(longTest);
    assertDelta(score, 11.7, 0.1); // TODO: check delta
  });

  it("coleman-liau index", () => {
    textstat.setLang("en");
    const score = textstat.colemanLiauIndex(longTest);
    assertDelta(score, 8.99, 3); // TODO: check delta
  });

  it("automated readability index", () => {
    textstat.setLang("en");
    const score = textstat.automatedReadabilityIndex(longTest);
    assertDelta(score, 11.6, 0.05); // TODO: check delta
  });

  describe("linsear write formula", () => {
    it("long text", () => {
      textstat.setLang("en");
      const score = textstat.linsearWriteFormula(longTest);
      assertDelta(score, 15.25);
    });
    it("empty text", () => {
      textstat.setLang("en");
      const score = textstat.linsearWriteFormula(emptyStr);
      assertDelta(score, -1);
    });
  });

  describe("gutierrez polini formula (Spanish)", () => {
    it("long text", () => {
      textstat.setLang("es");
      const score = textstat.gutierrezPolini(easySpanishText);
      assertDelta(score, 64.35, 2);
    });
    it("empty text", () => {
      textstat.setLang("es");
      const score = textstat.gutierrezPolini(emptyStr);
      assertDelta(score, 0);
    });
  });

  describe("crawford formula (Spanish)", () => {
    it("long text", () => {
      textstat.setLang("es");
      const score = textstat.crawford(longSpanishText);
      assertDelta(score, 5.1, 0.3); // TODO: check delta
    });
    it("empty text", () => {
      textstat.setLang("es");
      const score = textstat.crawford(emptyStr);
      assertDelta(score, 0);
    });
  });

  it("gulpease index (Italian)", () => {
    textstat.setLang("it");
    const score = textstat.gulpeaseIndex(italianText);
    assertDelta(score, 40.1, 3); // TODO: check delta
  });

  describe("wiener sachtextformel (German)", () => {
    it("sample 1", () => {
      textstat.setLang("de");
      const text =
        "Alle meine Entchen schwimmen auf dem See, Köpfchen unters Wasser, Schwänzchen in die Höh.";
      const score = textstat.wienerSachtextformel(text);
      assertDelta(score, 3.8, 1.5); // TODO: check delta
    });
    it("sample 2", () => {
      textstat.setLang("de");
      const text =
        "Alle Parteien widmen dem Thema rein quantitativ betrachtet nennenswerte Aufmerksamkeit, die Grünen wenig überraschend am meisten.";
      const score = textstat.wienerSachtextformel(text);
      assertDelta(score, 13.9, 0.02);
    });
  });

  it("mcalpine eflaw", () => {
    textstat.setLang("en");
    const score = textstat.mcalpineEflaw(longTest);
    assertDelta(score, 30.8, 0.1);
  });
});
