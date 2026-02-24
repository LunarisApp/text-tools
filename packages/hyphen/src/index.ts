import { dictionaries, enUS, type Language } from "./dicts";

// biome-ignore lint/performance/noBarrelFile: library entry point
export * from "./dicts";

// export function getDictionary(lang: string) {
//   return import(`./dictionaries/hyph_${lang}.dic`);
// }

const IGNORED = [
  "%",
  "#",
  "LEFTHYPHENMIN",
  "RIGHTHYPHENMIN",
  "COMPOUNDLEFTHYPHENMIN",
  "COMPOUNDRIGHTHYPHENMIN",
];

class DataInt {
  value: number;
  data?: [string, number, number];

  constructor(value: number, data?: [string, number, number]) {
    this.value = value;
    this.data = data;
  }
}

class HyphenDictParser {
  patterns: Map<string, [number, number[]]> = new Map();
  cache: Map<string, DataInt[]> = new Map();
  maxLen = 0;

  constructor(content: string) {
    const lines = content.split("\n");
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || IGNORED.some((i) => trimmedLine.startsWith(i))) {
        continue;
      }

      const pattern = trimmedLine.replace(
        /\^{2}([0-9a-f]{2})/g,
        (_match, hex) => String.fromCharCode(Number.parseInt(hex, 16))
      );

      const parts = Array.from(pattern.matchAll(/(\d?)(\D?)/g));
      const tags: string[] = [];
      const values: number[] = [];

      for (const [, num, char] of parts) {
        tags.push(char ?? "");
        values.push(num ? Number.parseInt(num, 10) : 0);
      }

      if (Math.max(...values) === 0) {
        continue;
      }

      let start = 0,
        end = values.length;
      while (!values[start]) {
        start++;
      }
      while (!values[end - 1]) {
        end--;
      }

      this.patterns.set(tags.join(""), [start, values.slice(start, end)]);
    }

    const lengths = Array.from(this.patterns.keys()).map((k) => k.length);
    this.maxLen = lengths.length > 0 ? Math.max(...lengths) : 0;
  }

  positions(word: string): DataInt[] {
    const lowerWord = word.toLowerCase();
    if (this.cache.has(lowerWord)) {
      return this.cache.get(lowerWord) as DataInt[];
    }

    const references = new Array(lowerWord.length + 2).fill(0);
    const extendedWord = `.${lowerWord}.`;

    for (let i = 0; i < extendedWord.length - 1; i++) {
      for (
        let j = i + 1;
        j < Math.min(i + this.maxLen, extendedWord.length) + 1;
        j++
      ) {
        const pattern = this.patterns.get(extendedWord.slice(i, j));
        if (!pattern) {
          continue;
        }

        const [offset, values] = pattern;
        for (let idx = 0; idx < values.length; idx++) {
          references[i + offset + idx] = Math.max(
            values[idx],
            references[i + offset + idx]
          );
        }
      }
    }

    const positions = references
      .map((val, idx) => (val % 2 ? new DataInt(idx - 1) : null))
      .filter(Boolean) as DataInt[];
    this.cache.set(lowerWord, positions);
    return positions;
  }
}

export class TextHyphen {
  private readonly left: number;
  private readonly right: number;
  private readonly hd!: HyphenDictParser;

  constructor(props?: { lang?: Language; left?: number; right?: number }) {
    const { lang = "en", left = 2, right = 2 } = props || {};
    this.left = left;
    this.right = right;
    const dict = dictionaries[lang] || enUS;
    // const dictStr = new TextDecoder().decode(dict);
    this.hd = new HyphenDictParser(dict);
  }

  private filteredPositions(word: string): DataInt[] {
    const rightLimit = word.length - this.right;
    return this.hd
      .positions(word)
      .filter((pos) => this.left <= pos.value && pos.value <= rightLimit);
  }

  /**
   * Get the positions of possible hyphenation points in a word
   * @param word
   */
  positions(word: string): number[] {
    return this.filteredPositions(word).map((pos) => pos.value);
  }

  /**
   * Get iterator for all possible variants of hyphenating the word.
   * @param word
   */
  *iterate(word: string): Generator<[string, string]> {
    for (const position of this.filteredPositions(word).reverse()) {
      if (position.data) {
        const [change, index, cut] = position.data;
        const updatedIndex = index + position.value;
        let ch = change;
        if (word === word.toUpperCase()) {
          ch = change.toUpperCase();
        }
        const [c1, c2] = ch.split("=");
        yield [
          word.slice(0, updatedIndex) + c1,
          c2 + word.slice(updatedIndex + cut),
        ];
      } else {
        yield [word.slice(0, position.value), word.slice(position.value)];
      }
    }
  }

  /**
   * Get all possible variants for hyphenating the word.
   * @param word
   */
  variants(word: string): string[][] {
    return Array.from(this.iterate(word));
  }

  /**
   * Wrap a word at a given width with a hyphen.
   * @param word
   * @param width
   * @param hyphen
   */
  wrap(word: string, width: number, hyphen = "-") {
    const effectiveWidth = width - hyphen.length;
    for (const [w1, w2] of this.iterate(word)) {
      if (w1.length <= effectiveWidth) {
        return [w1 + hyphen, w2];
      }
    }
    return null;
  }

  /**
   * Insert hyphens into a word at possible positions.
   * @param word
   * @param hyphen
   */
  inserted(word: string, hyphen = "-"): string {
    const letters = [...word];
    for (const pos of this.positions(word).reverse()) {
      letters.splice(pos, 0, hyphen);
    }
    return letters.join("");
  }
}
