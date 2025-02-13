"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.textstat = exports.TextStatistics = void 0;
const utils_1 = require("./utils");
const datasets_cmudict_1 = __importDefault(require("@stdlib/datasets-cmudict"));
const config_1 = require("./config");
const hyphen_1 = require("@lunaris/hyphen");
class TextStatistics {
    constructor(props) {
        this.lang = "en_US";
        this.rmApostrophe = true;
        this.cmudict = null;
        const { lang, rmApostrophe } = props ?? {};
        this.setLang(lang ?? this.lang);
        this.setRmApostrophe(rmApostrophe ?? this.rmApostrophe);
    }
    getCfg(key) {
        return config_1.langs[this.lang][key];
    }
    setLang(lang) {
        this.lang = lang;
        this.hyphen = new hyphen_1.Hyphen({ lang });
        if (lang === "en") {
            this.cmudict = (0, datasets_cmudict_1.default)({ data: "dict" });
        }
        else {
            this.cmudict = null;
        }
        (0, utils_1.clearCache)();
    }
    setRmApostrophe(rmApostrophe) {
        this.rmApostrophe = rmApostrophe;
    }
    removePunctuation(text) {
        if (this.rmApostrophe) {
            return text.replace(/[^\w\s]/g, "");
        }
        else {
            text = text.replace(/'(?![tsd]\b|ve\b|ll\b|re\b)/g, '"');
            return text.replace(/[^\w\s']/g, "");
        }
    }
    charCount(text, ignoreSpaces = true) {
        if (ignoreSpaces) {
            text = text.replace(/\s/g, "");
        }
        return text.length;
    }
    letterCount(text, ignoreSpaces = true) {
        if (ignoreSpaces) {
            text = text.replace(/\s/g, "");
        }
        return this.removePunctuation(text).length;
    }
    lexiconCount(text, removePunctuation = true) {
        if (removePunctuation) {
            text = this.removePunctuation(text);
        }
        return text.split(/\s+/).length;
    }
    miniWordCount(text, maxSize = 3) {
        return this.removePunctuation(text)
            .split(/\s+/)
            .filter((word) => word.length <= maxSize).length;
    }
    syllableCount(text) {
        const formatted = this.removePunctuation(text).toLowerCase();
        if (!formatted)
            return 0;
        let count = 0;
        for (const word of formatted.split(/\s+/)) {
            try {
                count += this.cmudict[word.toUpperCase()].split(" ").filter((s) => s.match(/\d/g)).length;
            }
            catch {
                count += this.hyphen.positions(word).length + 1;
            }
        }
        return count;
    }
    sentenceCount(text) {
        let ignoreCount = 0;
        const sentences = text.match(/\b[^.!?]+[.!?]*/g) || [];
        for (const sentence of sentences) {
            if (this.lexiconCount(sentence) <= 2) {
                ignoreCount += 1;
            }
        }
        return Math.max(1, sentences.length - ignoreCount);
    }
    avgSentenceLength(text) {
        try {
            return this.lexiconCount(text) / this.sentenceCount(text);
        }
        catch {
            return 0;
        }
    }
    avgSyllablesPerWord(text, interval) {
        const syllableCount = this.syllableCount(text);
        const lexiconCount = this.lexiconCount(text);
        try {
            if (interval) {
                return (syllableCount * interval) / lexiconCount;
            }
            else {
                return syllableCount / lexiconCount;
            }
        }
        catch {
            return 0;
        }
    }
    avgCharactersPerWord(text) {
        try {
            return this.charCount(text) / this.lexiconCount(text);
        }
        catch {
            return 0;
        }
    }
    avgLettersPerWord(text) {
        try {
            return this.letterCount(text) / this.lexiconCount(text);
        }
        catch {
            return 0;
        }
    }
    avgSentencesPerWord(text) {
        try {
            return this.sentenceCount(text) / this.lexiconCount(text);
        }
        catch {
            return 0;
        }
    }
    avgWordsPerSentence(text) {
        const sentencesCount = this.sentenceCount(text);
        if (sentencesCount < 1) {
            return 0;
        }
        return this.lexiconCount(text) / sentencesCount;
    }
    polySyllablesCount(text) {
        let count = 0;
        for (const word of text.split(/\s+/)) {
            if (this.syllableCount(word) > 2) {
                count += 1;
            }
        }
        return count;
    }
    monoSyllablesCount(text) {
        const words = this.removePunctuation(text).split(/\s+/);
        let count = 0;
        for (const word of words) {
            if (this.syllableCount(word) === 1) {
                count += 1;
            }
        }
        return count;
    }
    longWordsCount(text, threshold = 6) {
        const words = this.removePunctuation(text).split(/\s+/);
        return words.filter((word) => word.length > threshold).length;
    }
    readingTime(text, msPerChar = 14.69) {
        const words = text.split(/\s+/);
        const chars = words.map((word) => word.length);
        const rtPerWord = chars.map((char) => char * msPerChar);
        return rtPerWord.reduce((acc, curr) => acc + curr, 0) / 1000;
    }
    fleschReadingEase(text) {
        if (this.lang === "pl") {
            throw new Error("Flesch reading ease test does not support Polish language.");
        }
        const sInterval = ["es", "it"].includes(this.lang) ? 100 : undefined;
        const sentenceLength = this.avgSentenceLength(text);
        const syllablesPerWord = this.avgSyllablesPerWord(text, sInterval);
        return (this.getCfg("fre_base") -
            this.getCfg("fre_sentence_length") * sentenceLength -
            this.getCfg("fre_syllables_per_word") * syllablesPerWord);
    }
    fleschKincaidGrade(text) {
        if (this.lang === "pl") {
            throw new Error("Flesch-Kincaid grade level does not support Polish language.");
        }
        const sentenceLength = this.avgSentenceLength(text);
        const syllablesPerWord = this.avgSyllablesPerWord(text);
        return 0.39 * sentenceLength + 11.8 * syllablesPerWord - 15.59;
    }
    smogIndex(text) {
        const sentences = this.sentenceCount(text);
        if (sentences < 3) {
            return 0;
        }
        const polySyllables = this.polySyllablesCount(text);
        return 1.043 * Math.sqrt((polySyllables * 30) / sentences) + 3.1291;
    }
    colemanLiauIndex(text) {
        const letters = this.avgLettersPerWord(text) * 100;
        const sentences = this.avgSentencesPerWord(text) * 100;
        return 0.058 * letters - 0.296 * sentences - 15.8;
    }
    automatedReadabilityIndex(text) {
        const chars = this.charCount(text);
        const words = this.lexiconCount(text);
        const sentences = this.sentenceCount(text);
        try {
            return 4.71 * (chars / words) + 0.5 * (words / sentences) - 21.43;
        }
        catch {
            return 0;
        }
    }
    linsearWriteFormula(text) {
        const words = text
            .split(/\s+/)
            .slice(0, 100)
            .filter((word) => word);
        let easyWords = 0;
        let difficultWords = 0;
        for (const word of words) {
            if (this.syllableCount(word) < 3) {
                easyWords += 1;
            }
            else {
                difficultWords += 1;
            }
        }
        const newText = words.join(" ");
        try {
            const score = (easyWords + difficultWords * 3) / this.sentenceCount(newText);
            if (score <= 20) {
                return (score - 2) / 2;
            }
            return score / 2;
        }
        catch {
            return 0;
        }
    }
    gutierrezPolini(text) {
        if (this.lang !== "es") {
            console.warn(`Gutierrez Polini's formula only supports Spanish language. 
                          Textstat language is set to '${this.lang}'.`);
        }
        if (!text) {
            return 0;
        }
        const words = this.lexiconCount(text);
        const sentences = this.sentenceCount(text);
        const letters = this.letterCount(text);
        try {
            return 95.2 - 9.7 * (letters / words) - 0.35 * (words / sentences);
        }
        catch {
            return 0;
        }
    }
    crawford(text) {
        if (this.lang !== "es") {
            console.warn(`Crawford's formula only supports Spanish language. 
                          Textstat language is set to '${this.lang}'.`);
        }
        if (!text) {
            return 0;
        }
        const sentences = this.sentenceCount(text);
        const words = this.lexiconCount(text);
        const syllables = this.syllableCount(text);
        try {
            const sentencesPerWords = 100 * (sentences / words);
            const syllablesPerWords = 100 * (syllables / words);
            return -0.205 * sentencesPerWords + 0.049 * syllablesPerWords - 3.407;
        }
        catch {
            return 0;
        }
    }
    gulpeaseIndex(text) {
        if (this.lang !== "it") {
            console.warn(`Gulpease index only supports Italian language. 
                          Textstat language is set to '${this.lang}'.`);
        }
        if (!text) {
            return 0;
        }
        return ((300 * this.sentenceCount(text) - 10 * this.charCount(text)) /
            this.lexiconCount(text) +
            89);
    }
    wienerSachtextformel(text, variant = 1) {
        if (this.lang !== "de") {
            console.warn(`Wiener Sachtextformel only supports German language. 
                          Textstat language is set to '${this.lang}'.`);
        }
        if (!text) {
            return 0;
        }
        const words = this.lexiconCount(text);
        const ms = (100 * this.polySyllablesCount(text)) / words;
        const sl = words / this.sentenceCount(text);
        const iw = (100 * this.longWordsCount(text)) / words;
        const es = (100 * this.monoSyllablesCount(text)) / words;
        switch (variant) {
            case 1:
                return 0.1935 * ms + 0.1672 * sl + 0.1297 * iw - 0.0327 * es - 0.875;
            case 2:
                return 0.2007 * ms + 0.1682 * sl + 0.1373 * iw - 2.779;
            case 3:
                return 0.2963 * ms + 0.1905 * sl - 1.1144;
            case 4:
                return 0.2744 * ms + 0.2656 * sl - 1.693;
        }
    }
    mcalpineEflaw(text) {
        if (!text) {
            return 0;
        }
        const words = this.lexiconCount(text);
        const sentences = this.sentenceCount(text);
        const miniWords = this.miniWordCount(text);
        return (words + miniWords) / sentences;
    }
}
exports.TextStatistics = TextStatistics;
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "removePunctuation", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "charCount", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "letterCount", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "lexiconCount", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "miniWordCount", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "syllableCount", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "sentenceCount", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "avgSentenceLength", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "avgSyllablesPerWord", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "avgCharactersPerWord", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "avgLettersPerWord", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "avgSentencesPerWord", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "avgWordsPerSentence", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "polySyllablesCount", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "monoSyllablesCount", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "longWordsCount", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "readingTime", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "fleschReadingEase", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "fleschKincaidGrade", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "smogIndex", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "colemanLiauIndex", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "automatedReadabilityIndex", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "linsearWriteFormula", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "gutierrezPolini", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "crawford", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "gulpeaseIndex", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "wienerSachtextformel", null);
__decorate([
    utils_1.lruCache,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TextStatistics.prototype, "mcalpineEflaw", null);
exports.textstat = new TextStatistics();
//# sourceMappingURL=index.js.map