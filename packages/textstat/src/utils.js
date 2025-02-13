"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lruCache = lruCache;
exports.clearCache = clearCache;
exports.getGradeSuffix = getGradeSuffix;
exports.assertDelta = assertDelta;
const lru_cache_1 = require("lru-cache");
const node_assert_1 = __importDefault(require("node:assert"));
const caches = {};
function lruCache(target, name, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const key = JSON.stringify(args);
        if (!caches[name]) {
            caches[name] = new lru_cache_1.LRUCache({ max: 128 });
        }
        const cache = caches[name];
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = originalMethod.apply(this, args);
        cache.set(key, result);
        return result;
    };
    return descriptor;
}
function clearCache() {
    for (const cache of Object.values(caches)) {
        cache.clear();
    }
}
function getGradeSuffix(grade) {
    const ordinalMap = { 1: "st", 2: "nd", 3: "rd" };
    const teensMap = { 11: "th", 12: "th", 13: "th" };
    return teensMap[grade % 100] || ordinalMap[grade % 10] || "th";
}
function assertDelta(actual, expected, delta = 0.01) {
    node_assert_1.default.ok(Math.abs(expected - actual) <= delta, `Expected ${expected}, got ${actual}`);
}
//# sourceMappingURL=utils.js.map