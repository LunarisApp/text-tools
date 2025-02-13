"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const textstat_1 = require("@lunaris/textstat");
const data_1 = require("./data");
const node_assert_1 = __importDefault(require("node:assert"));
const utils_1 = require("../src/utils");
(0, node_test_1.describe)("scores", () => {
    (0, node_test_1.describe)("flesch reading ease", () => {
        (0, node_test_1.it)("english config", () => {
            textstat_1.textstat.setLang("en");
            const score = textstat_1.textstat.fleschReadingEase(data_1.longTest);
            (0, utils_1.assertDelta)(score, 57.71, 3);
        });
        (0, node_test_1.it)("german config", () => {
            textstat_1.textstat.setLang("de");
            const score = textstat_1.textstat.fleschReadingEase(data_1.longTest);
            (0, utils_1.assertDelta)(score, 64.5, 3);
        });
        (0, node_test_1.it)("spanish config", () => {
            textstat_1.textstat.setLang("es");
            const score = textstat_1.textstat.fleschReadingEase(data_1.longTest);
            (0, utils_1.assertDelta)(score, 86.76, 0.02);
        });
        (0, node_test_1.it)("french config", () => {
            textstat_1.textstat.setLang("fr");
            const score = textstat_1.textstat.fleschReadingEase(data_1.longTest);
            (0, utils_1.assertDelta)(score, 81.73, 1);
        });
        (0, node_test_1.it)("italian config", () => {
            textstat_1.textstat.setLang("it");
            const score = textstat_1.textstat.fleschReadingEase(data_1.longTest);
            (0, utils_1.assertDelta)(score, 91.57, 0.05);
        });
        (0, node_test_1.it)("dutch config", () => {
            textstat_1.textstat.setLang("nl");
            const score = textstat_1.textstat.fleschReadingEase(data_1.longTest);
            (0, utils_1.assertDelta)(score, 63.27, 3);
        });
        (0, node_test_1.it)("russian config", () => {
            textstat_1.textstat.setLang("ru");
            const score = textstat_1.textstat.fleschReadingEase(data_1.longTest);
            (0, utils_1.assertDelta)(score, 118.27, 0.02);
        });
        (0, node_test_1.it)("polish config should throw", () => {
            textstat_1.textstat.setLang("pl");
            node_assert_1.default.throws(() => textstat_1.textstat.fleschReadingEase(data_1.longTest));
        });
    });
    (0, node_test_1.it)("flesch-kincaid grade", () => {
        textstat_1.textstat.setLang("en");
        const score = textstat_1.textstat.fleschKincaidGrade(data_1.longTest);
        (0, utils_1.assertDelta)(score, 10.7, 0.5);
    });
    (0, node_test_1.it)("smog index", () => {
        textstat_1.textstat.setLang("en");
        const score = textstat_1.textstat.smogIndex(data_1.longTest);
        (0, utils_1.assertDelta)(score, 11.7, 0.1);
    });
    (0, node_test_1.it)("coleman-liau index", () => {
        textstat_1.textstat.setLang("en");
        const score = textstat_1.textstat.colemanLiauIndex(data_1.longTest);
        (0, utils_1.assertDelta)(score, 8.99, 3);
    });
    (0, node_test_1.it)("automated readability index", () => {
        textstat_1.textstat.setLang("en");
        const score = textstat_1.textstat.automatedReadabilityIndex(data_1.longTest);
        (0, utils_1.assertDelta)(score, 11.6, 0.05);
    });
    (0, node_test_1.describe)("linsear write formula", () => {
        (0, node_test_1.it)("long text", () => {
            textstat_1.textstat.setLang("en");
            const score = textstat_1.textstat.linsearWriteFormula(data_1.longTest);
            (0, utils_1.assertDelta)(score, 15.25);
        });
        (0, node_test_1.it)("empty text", () => {
            textstat_1.textstat.setLang("en");
            const score = textstat_1.textstat.linsearWriteFormula(data_1.emptyStr);
            (0, utils_1.assertDelta)(score, -1);
        });
    });
    (0, node_test_1.describe)("gutierrez polini formula (Spanish)", () => {
        (0, node_test_1.it)("long text", () => {
            textstat_1.textstat.setLang("es");
            const score = textstat_1.textstat.gutierrezPolini(data_1.easySpanishText);
            (0, utils_1.assertDelta)(score, 64.35, 2);
        });
        (0, node_test_1.it)("empty text", () => {
            textstat_1.textstat.setLang("es");
            const score = textstat_1.textstat.gutierrezPolini(data_1.emptyStr);
            (0, utils_1.assertDelta)(score, 0);
        });
    });
    (0, node_test_1.describe)("crawford formula (Spanish)", () => {
        (0, node_test_1.it)("long text", () => {
            textstat_1.textstat.setLang("es");
            const score = textstat_1.textstat.crawford(data_1.longSpanishText);
            (0, utils_1.assertDelta)(score, 5.1, 0.3);
        });
        (0, node_test_1.it)("empty text", () => {
            textstat_1.textstat.setLang("es");
            const score = textstat_1.textstat.crawford(data_1.emptyStr);
            (0, utils_1.assertDelta)(score, 0);
        });
    });
    (0, node_test_1.it)("gulpease index (Italian)", () => {
        textstat_1.textstat.setLang("it");
        const score = textstat_1.textstat.gulpeaseIndex(data_1.italianText);
        (0, utils_1.assertDelta)(score, 40.1, 3);
    });
    (0, node_test_1.describe)("wiener sachtextformel (German)", () => {
        (0, node_test_1.it)("sample 1", () => {
            textstat_1.textstat.setLang("de");
            const text = "Alle meine Entchen schwimmen auf dem See, Köpfchen unters Wasser, Schwänzchen in die Höh.";
            const score = textstat_1.textstat.wienerSachtextformel(text);
            (0, utils_1.assertDelta)(score, 3.8, 1.5);
        });
        (0, node_test_1.it)("sample 2", () => {
            textstat_1.textstat.setLang("de");
            const text = "Alle Parteien widmen dem Thema rein quantitativ betrachtet nennenswerte Aufmerksamkeit, die Grünen wenig überraschend am meisten.";
            const score = textstat_1.textstat.wienerSachtextformel(text);
            (0, utils_1.assertDelta)(score, 13.9, 0.02);
        });
    });
    (0, node_test_1.it)("mcalpine eflaw", () => {
        textstat_1.textstat.setLang("en");
        const score = textstat_1.textstat.mcalpineEflaw(data_1.longTest);
        (0, utils_1.assertDelta)(score, 30.8, 0.1);
    });
});
//# sourceMappingURL=scores.test.js.map