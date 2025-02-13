import fs from "fs";
import { join } from "path";

const DICTIONARY_PATH = join(__dirname, "dictionaries");

class DataInt {
  value: number;
  data?: [string, number, number];

  constructor(value: number, data?: [string, number, number]) {
    this.value = value;
    this.data = data;
  }
}

class HyphDict {
  patterns: Map<string, [number, number[]]> = new Map();
  cache: Map<string, DataInt[]> = new Map();
  maxlen: number = 0;

  constructor(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Dictionary file not found: ${filePath}`);
    }

    const lines = fs.readFileSync(filePath, "utf-8").split("\n");
    lines.forEach((line) => {
      line = line.trim();
      if (!line || line.startsWith("%") || line.startsWith("#")) return;

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

    this.maxlen = Math.max(
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
        j < Math.min(i + this.maxlen, extendedWord.length) + 1;
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

export class Hyphen {
  private readonly left: number;
  private readonly right: number;
  private hd: HyphDict;
  readonly dictionaries: Record<string, string>;
  private readonly lowercaseLangs: Record<string, string>;

  constructor(props?: { lang?: string; left?: number; right?: number }) {
    const { lang = "en_US", left = 2, right = 2 } = props || {};
    this.left = left;
    this.right = right;
    this.dictionaries = this.loadDicts();
    this.lowercaseLangs = Object.keys(this.dictionaries).reduce(
      (acc, lang) => {
        acc[lang.toLowerCase()] = lang;
        return acc;
      },
      {} as Record<string, string>,
    );
    const fallback = this.getLanguageFallback(lang);
    if (!fallback) {
      throw new Error(`Language not found: ${lang}`);
    }
    this.hd = new HyphDict(join(DICTIONARY_PATH, this.dictionaries[fallback]!));
  }

  private loadDicts() {
    const dicts: Record<string, string> = {};
    for (const file of fs.readdirSync(DICTIONARY_PATH).sort()) {
      const [name, ext] = file.split(".");
      const lang = name!.replace("hyph_", "").replace("-", "_");
      const shortLang = lang.split("_")[0];
      if (ext === "dic") {
        dicts[lang] = file;
        if (!dicts[shortLang!]) {
          dicts[shortLang!] = file;
        }
      }
    }
    return dicts;
  }

  positions(word: string): number[] {
    const rightLimit = word.length - this.right;
    return this.hd
      .positions(word)
      .map((pos) => pos.value)
      .filter((pos) => this.left <= pos && pos <= rightLimit);
  }

  // Generator function to iterate over all hyphenation possibilities, the longest first
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

  // Get the longest possible first part and the last part of a word
  wrap(word: string, width: number, hyphen = "-") {
    width -= hyphen.length;
    for (const [w1, w2] of this.iterate(word)) {
      if (w1.length <= width) {
        return [w1 + hyphen, w2];
      }
    }
    return null;
  }

  inserted(word: string, hyphen = "-"): string {
    const letters = [...word];
    this.positions(word)
      .reverse()
      .forEach((pos) => {
        letters.splice(pos, 0, hyphen);
      });
    return letters.join("");
  }

  getLanguageFallback(language: string) {
    const parts = language.replace("-", "_").toLowerCase().split("_");
    while (parts.length) {
      const currentLanguage = parts.join("_");
      if (this.lowercaseLangs[currentLanguage]) {
        return this.lowercaseLangs[currentLanguage];
      }
      parts.pop();
    }
    return undefined;
  }
}
