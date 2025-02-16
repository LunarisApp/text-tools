import { LRUCache } from "lru-cache";

/**
 * Wrapper around lru-cache for more convenient method caching.
 * @param cache
 * @param key
 * @param values
 * @param fn
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function lruCache<T extends {}, B extends unknown[]>(
  cache: LRUCache<string, T, unknown>,
  key: string,
  values: [...B],
  fn: (...args: [...B]) => T,
) {
  const valuesStr = JSON.stringify(values);
  const cacheKey = `${key}:${valuesStr}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  const result = fn(...values);
  cache.set(cacheKey, result);
  return result;
}

export function getGradeSuffix(grade: number) {
  const ordinalMap: Record<number, string> = { 1: "st", 2: "nd", 3: "rd" };
  const teensMap: Record<number, string> = { 11: "th", 12: "th", 13: "th" };
  return teensMap[grade % 100] || ordinalMap[grade % 10] || "th";
}
