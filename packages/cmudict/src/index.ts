import cmuDict from "./data/cmudict.dict";
import cmuPhones from "./data/cmudict.phones";
import cmuSymbols from "./data/cmudict.symbols";
import cmuVp from "./data/cmudict.vp";

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
export function dict(): Record<string, string[][]> {
  const entries = parseEntries(cmuDict.split("\n"), "#");
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
 * Returns the CMU dictionary phones.
 */
export function phones(): [string, string[]][] {
  return cmuPhones
    .split("\n")
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
export function symbols(): string[] {
  return cmuSymbols
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Returns the CMU dictionary vowel phonemes.
 */
export function vp(): Record<string, string[][]> {
  const entries = parseEntries(cmuVp.split("\n"));
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
export function entries(): [string, string[]][] {
  return parseEntries(cmuDict.split("\n"), "#");
}

/**
 * Returns the CMU dictionary as an array of words.
 */
export function words(): string[] {
  return entries().map(([word]) => word);
}

const cmudict = {
  dict,
  phones,
  symbols,
  vp,
  entries,
  words,
};

export default cmudict;
