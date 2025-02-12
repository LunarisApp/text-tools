"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const assert = __importStar(require("node:assert"));
const src_1 = require("../src");
(0, node_test_1.describe)("Hyphen Tests", () => {
    (0, node_test_1.it)("should correctly hyphenate words using inserted method", () => {
        const dic = new src_1.Hyphen({ lang: "nl_NL" });
        assert.strictEqual(dic.inserted("lettergrepen"), "let-ter-gre-pen");
    });
    (0, node_test_1.it)("should correctly wrap words", () => {
        const dic = new src_1.Hyphen({ lang: "nl_NL" });
        const actual = dic.wrap("autobandventieldopje", 11);
        const expected = ["autoband-", "ventieldopje"];
        assert.deepStrictEqual(actual, expected);
    });
    (0, node_test_1.it)("should iterate hyphenation positions correctly", () => {
        const dic = new src_1.Hyphen({ lang: "nl_NL" });
        const actual = [...dic.iterate("Amsterdam")];
        const expected = [
            ["Amster", "dam"],
            ["Am", "sterdam"],
        ];
        assert.deepStrictEqual(actual, expected);
    });
    (0, node_test_1.it)("should use a fallback dictionary", () => {
        const dic = new src_1.Hyphen({ lang: "nl_NL-variant" });
        const actual = [...dic.iterate("Amsterdam")];
        const expected = [
            ["Amster", "dam"],
            ["Am", "sterdam"],
        ];
        assert.deepStrictEqual(actual, expected);
    });
    (0, node_test_1.it)("should throw an error for a missing dictionary", () => {
        assert.throws(() => new src_1.Hyphen({ lang: "mi_SS" }), Error);
    });
    (0, node_test_1.describe)("should support left and right hyphenation constraints", () => {
        (0, node_test_1.it)("default", () => {
            const dic = new src_1.Hyphen({ lang: "nl_NL" });
            assert.strictEqual(dic.inserted("lettergrepen"), "let-ter-gre-pen");
        });
        (0, node_test_1.it)("left", () => {
            const dic = new src_1.Hyphen({ lang: "nl_NL", left: 4 });
            assert.strictEqual(dic.inserted("lettergrepen"), "letter-gre-pen");
        });
        (0, node_test_1.it)("right", () => {
            const dic = new src_1.Hyphen({ lang: "nl_NL", right: 4 });
            assert.strictEqual(dic.inserted("lettergrepen"), "let-ter-grepen");
        });
        (0, node_test_1.it)("both", () => {
            const dic = new src_1.Hyphen({ lang: "nl_NL", left: 4, right: 4 });
            assert.strictEqual(dic.inserted("lettergrepen"), "letter-grepen");
        });
    });
    (0, node_test_1.it)("should handle uppercase words correctly", () => {
        const dic = new src_1.Hyphen({ lang: "nl_NL" });
        assert.strictEqual(dic.inserted("LETTERGREPEN"), "LET-TER-GRE-PEN");
    });
    (0, node_test_1.it)("should correctly determine language fallbacks", () => {
        const hyp = new src_1.Hyphen();
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
//# sourceMappingURL=hyphen.test.js.map