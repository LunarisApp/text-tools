import { enUS, dictionaries, Language } from "./dicts";

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
  maxLen: number = 0;

  constructor(content: string) {
    const lines = content.split("\n");
    lines.forEach((line) => {
      line = line.trim();
      if (!line || IGNORED.some((i) => line.startsWith(i))) return;

      const pattern = line.replace(/\^{2}([0-9a-f]{2})/g, (match, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      );

      const parts = Array.from(pattern.matchAll(/(\d?)(\D?)/g));
      const tags: string[] = [];
      const values: number[] = [];

      parts.forEach(([, num, char]) => {
        tags.push(char!);
        values.push(num ? parseInt(num) : 0);
      });

      if (Math.max(...values) === 0) return;

      let start = 0,
        end = values.length;
      while (!values[start]) start++;
      while (!values[end - 1]) end--;

      this.patterns.set(tags.join(""), [start, values.slice(start, end)]);
    });

    this.maxLen = Math.max(
      ...Array.from(this.patterns.keys()).map((k) => k.length),
    );
  }

  positions(word: string): DataInt[] {
    word = word.toLowerCase();
    if (this.cache.has(word)) return this.cache.get(word)!;

    const references = new Array(word.length + 2).fill(0);
    const extendedWord = `.${word}.`;

    for (let i = 0; i < extendedWord.length - 1; i++) {
      for (
        let j = i + 1;
        j < Math.min(i + this.maxLen, extendedWord.length) + 1;
        j++
      ) {
        const pattern = this.patterns.get(extendedWord.slice(i, j));
        if (!pattern) continue;

        const [offset, values] = pattern;
        values.forEach((val, idx) => {
          references[i + offset + idx] = Math.max(
            val,
            references[i + offset + idx],
          );
        });
      }
    }

    const positions = references
      .map((val, idx) => (val % 2 ? new DataInt(idx - 1) : null))
      .filter(Boolean) as DataInt[];
    this.cache.set(word, positions);
    return positions;
  }
}

export class TextHyphen {
  private readonly left: number;
  private readonly right: number;
  private hd!: HyphenDictParser;

  constructor(props?: { lang?: Language; left?: number; right?: number }) {
    const { lang = "en", left = 2, right = 2 } = props || {};
    this.left = left;
    this.right = right;
    const dict = dictionaries[lang] || enUS;
    // const dictStr = new TextDecoder().decode(dict);
    this.hd = new HyphenDictParser(dict);
  }

  /**
   * Get the positions of possible hyphenation points in a word
   * @param word
   */
  positions(word: string): number[] {
    const rightLimit = word.length - this.right;
    return this.hd
      .positions(word)
      .map((pos) => pos.value)
      .filter((pos) => this.left <= pos && pos <= rightLimit);
  }

  /**
   * Get iterator for all possible variants of hyphenating the word.
   * @param word
   */
  *iterate(word: string): Generator<[string, string]> {
    for (const position of this.hd.positions(word).reverse()) {
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
    width -= hyphen.length;
    for (const [w1, w2] of this.iterate(word)) {
      if (w1.length <= width) {
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
    this.positions(word)
      .reverse()
      .forEach((pos) => {
        letters.splice(pos, 0, hyphen);
      });
    return letters.join("");
  }
}
