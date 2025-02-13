import { LRUCache } from "lru-cache";
import assert from "node:assert";

const caches: Record<string, LRUCache<{}, {}, unknown>> = {};

/**
 * Method decorator to cache results using the Least Recently Used algorithm.
 */
export function lruCache(maxSize=128): MethodDecorator {
  return (target, key, descriptor: TypedPropertyDescriptor<any>) => {
    const keyStr = key.toString();
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const body = JSON.stringify(args);
      if (!caches[keyStr]) {
        caches[keyStr] = new LRUCache({ max: maxSize });
      }
      const cache = caches[keyStr];
      if (cache.has(body)) {
        return cache.get(body);
      }
      const result = originalMethod.apply(this, args);
      cache.set(body, result);
      return result;
    };
    return descriptor;
  }
}

export function clearCache() {
  for (const cache of Object.values(caches)) {
    cache.clear();
  }
}

export function getGradeSuffix(grade: number) {
  const ordinalMap: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" };
  const teensMap: Record<number, string> = { 11: "th", 12: "th", 13: "th" };
  return teensMap[grade % 100] || ordinalMap[grade % 10] || "th";
}

export function assertDelta(actual: number, expected: number, delta = 0.01) {
  assert.ok(
    Math.abs(expected - actual) <= delta,
    `Expected ${expected}, got ${actual}`,
  );
}
