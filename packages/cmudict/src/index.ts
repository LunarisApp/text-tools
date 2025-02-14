import { readFileSync } from "fs";
import { join } from "path";

const CMUDICT_DICT = "data/cmudict.dict";
const CMUDICT_PHONES = "data/cmudict.phones";
const CMUDICT_SYMBOLS = "data/cmudict.symbols";
const CMUDICT_VP = "data/cmudict.vp";
const CMUDICT_LICENSE = "data/LICENSE";

function readFileString(filePath: string): string {
  return readFileSync(join(__dirname, filePath), "utf-8");
}

function readFileLines(filePath: string): string[] {
  return readFileString(filePath).split("\n");
}

function parseEntries(
  lines: string[],
  commentChar?: string,
): [string, string[]][] {
  return lines
    .map((line) => {
      // There are a few lines in the dictionary that contain comment at the end of the line.
      if (commentChar) line = line.split(commentChar)[0];
      const parts = line.trim().split(/\s+/);
      if (parts.length < 2) {
        return null;
      }
      const word = parts[0].replace(/\(\d+\)$/, "");
      return [word.toLowerCase(), parts.slice(1)];
    })
    .filter(Boolean) as [string, string[]][];
}

/**
 * Returns the CMU dictionary as a dictionary object.
 */
function dict(): Record<string, string[][]> {
  const entries = parseEntries(readFileLines(CMUDICT_DICT), "#");
  return entries.reduce(
    (dict, [word, pron]) => {
      if (!Array.isArray(dict[word])) dict[word] = [];
      dict[word].push(pron);
      return dict;
    },
    {} as Record<string, string[][]>,
  );
}

/**
 * Returns the CMU dictionary license.
 */
function license(): string {
  return readFileString(CMUDICT_LICENSE);
}

/**
 * Returns the CMU dictionary phones.
 */
function phones(): [string, string[]][] {
  return readFileLines(CMUDICT_PHONES)
    .map((line) => {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 2) {
        return null;
      }
      return [parts[0], parts.slice(1)];
    })
    .filter(Boolean) as [string, string[]][];
}

/**
 * Returns the CMU dictionary symbols.
 */
function symbols(): string[] {
  return readFileLines(CMUDICT_SYMBOLS)
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Returns the CMU dictionary vowel phonemes.
 */
function vp(): Record<string, string[][]> {
  const entries = parseEntries(readFileLines(CMUDICT_VP));
  return entries.reduce(
    (dict, [word, pron]) => {
      if (!dict[word]) dict[word] = [];
      dict[word].push(pron);
      return dict;
    },
    {} as Record<string, string[][]>,
  );
}

/**
 * Returns the CMU dictionary as an array of entries.
 */
function entries(): [string, string[]][] {
  return parseEntries(readFileLines(CMUDICT_DICT), "#");
}

/**
 * Returns the CMU dictionary as an array of words.
 */
function words(): string[] {
  return entries().map(([word]) => word);
}

const cmudict = {
  dict,
  license,
  phones,
  symbols,
  vp,
  entries,
  words,
};

export default cmudict;
