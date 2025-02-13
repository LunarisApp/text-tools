"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const src_1 = require("../src");
const data_1 = require("./data");
const utils_1 = require("../src/utils");
const node_assert_1 = __importDefault(require("node:assert"));
(0, node_test_1.describe)("basic stats", () => {
    (0, node_test_1.describe)("counts", () => {
        (0, node_test_1.it)("char count", () => {
            src_1.textstat.setLang("en");
            const count = src_1.textstat.charCount(data_1.longTest);
            const countSpaces = src_1.textstat.charCount(data_1.longTest, false);
            node_assert_1.default.strictEqual(count, 1748);
            node_assert_1.default.strictEqual(countSpaces, 2123);
        });
        (0, node_test_1.it)("letter count", () => {
            src_1.textstat.setLang("en");
            const count = src_1.textstat.letterCount(data_1.longTest);
            const countSpaces = src_1.textstat.letterCount(data_1.longTest, false);
            node_assert_1.default.strictEqual(count, 1686);
            node_assert_1.default.strictEqual(countSpaces, 2061);
        });
        (0, node_test_1.it)("lexicon count", () => {
            src_1.textstat.setLang("en");
            const count = src_1.textstat.lexiconCount(data_1.longTest);
            const countPunct = src_1.textstat.lexiconCount(data_1.longTest, false);
            node_assert_1.default.strictEqual(count, 372);
            node_assert_1.default.strictEqual(countPunct, 376);
        });
        (0, node_test_1.it)("sentence count", () => {
            src_1.textstat.setLang("en");
            const count = src_1.textstat.sentenceCount(data_1.longTest);
            node_assert_1.default.strictEqual(count, 17);
        });
        (0, node_test_1.describe)("syllable count", () => {
            data_1.testSyllableCountCases.forEach((testCase) => {
                const [lang, text, expected, delta] = testCase;
                (0, node_test_1.it)(`syllable count: ${text.slice(0, 10)}${text.length >= 10 ? "..." : ""}`, () => {
                    src_1.textstat.setLang(lang);
                    const actual = src_1.textstat.syllableCount(text);
                    (0, utils_1.assertDelta)(actual, expected, delta);
                });
            });
        });
    });
    (0, node_test_1.describe)("remove punctuation", () => {
        (0, node_test_1.it)("incl. apostrophe", () => {
            src_1.textstat.setLang("en");
            src_1.textstat.setRmApostrophe(true);
            const text = src_1.textstat.removePunctuation(data_1.punctText);
            src_1.textstat.setRmApostrophe(false);
            node_assert_1.default.strictEqual(text, data_1.punctTextResultWoApostr);
        });
        (0, node_test_1.it)("excl. apostrophe", () => {
            src_1.textstat.setLang("en");
            const text = src_1.textstat.removePunctuation(data_1.punctText);
            node_assert_1.default.strictEqual(text, data_1.punctTextResultWApostr);
        });
    });
    (0, node_test_1.describe)("averages", () => {
        (0, node_test_1.it)("avg sentence length", () => {
            src_1.textstat.setLang("en");
            const avg = src_1.textstat.avgSentenceLength(data_1.longTest);
            (0, utils_1.assertDelta)(avg, 21.9, 0.05);
        });
        (0, node_test_1.it)("avg syllables per word", () => {
            src_1.textstat.setLang("en");
            const avg = src_1.textstat.avgSyllablesPerWord(data_1.longTest);
            (0, utils_1.assertDelta)(avg, 1.5, 0.05);
        });
        (0, node_test_1.it)("avg letters per word", () => {
            src_1.textstat.setLang("en");
            const avg = src_1.textstat.avgLettersPerWord(data_1.longTest);
            (0, utils_1.assertDelta)(avg, 4.53);
        });
        (0, node_test_1.it)("avg sentence per word", () => {
            src_1.textstat.setLang("en");
            const avg = src_1.textstat.avgSentencesPerWord(data_1.longTest);
            (0, utils_1.assertDelta)(avg, 0.05);
        });
    });
    (0, node_test_1.it)("reading time", () => {
        src_1.textstat.setLang("en");
        const time = src_1.textstat.readingTime(data_1.longTest);
        (0, utils_1.assertDelta)(time, 25.68);
    });
});
//# sourceMappingURL=stats.test.js.map