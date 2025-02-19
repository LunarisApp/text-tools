import { LRUCache } from "lru-cache";

/**
 * Wrapper around lru-cache for more convenient method caching.
 * @param cache
 * @param key
 * @param values
 * @param fn
 * @param enabled
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function lruCache<T extends {}, B extends unknown[]>(
  cache: LRUCache<string, T, unknown>,
  key: string,
  values: [...B],
  fn: (...args: [...B]) => T,
  enabled = true,
) {
  const valuesStr = JSON.stringify(values);
  const cacheKey = `${key}:${valuesStr}`;
  if (enabled && cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  const result = fn(...values);
  cache.set(cacheKey, result);
  return result;
}

/**
 * Chunk text input into smaller parts and aggregate the results.
 */
export function chunkAndProcessText(
  text: string,
  fn: (text: string) => number,
  opts?: {
    chunkSize?: number;
    regex?: RegExp;
  },
) {
  const { chunkSize = 100, regex = /\s+/g } = opts ?? {};
  const words = text.split(regex);
  let result = 0;

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    result += fn(chunk);
  }

  return result;
}
