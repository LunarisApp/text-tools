import { Language } from "./languages";

export const contractionsRegexSeq: Readonly<Partial<Record<Language, string>>> =
  {
    en: "[tsd]\\b|ve\\b|ll\\b|re\\b", // it's, don't, you've, I'll
    fr: "\\b[cjntlsd]'\\b", // c', j', n', l', d' (e.g., c'est, j'aime)
    es: "\\b(pa')\\b", // pa' (e.g., pa'lante)
    it: "\\b(l'|un'|da')\\b", // l', un', da' (e.g., l'amico, un'amica)
    ca: "\\b(l'|d'|m'|s'|t'|n')\\b", // l', d', m', s' (e.g., l'amor, d'aigua)
    gl: "\\b(d'|n'|t'|v'|ll'|m'|s')\\b", // d', n', t' (e.g., d'aquela, n'hai)
    ro: "\\b(l|m|s|ţi|d|c|a)-(am|ai|a|au|om|i|em|ţi)\\b", // l-am, m-a, s-a
    nl: "\\b('t|m’n|d’r|'n)\\b", // 't huis, m'n, d'r, 'n
  } as const;
