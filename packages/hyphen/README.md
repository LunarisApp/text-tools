# Lunaris Hyphen

[![NPM Version](https://img.shields.io/npm/v/%40lunarisapp%2Fhyphen)](https://www.npmjs.com/package/@lunarisapp/hyphen)
[![NPM Downloads](https://img.shields.io/npm/dm/%40lunarisapp%2Fhyphen)](https://www.npmjs.com/package/@lunarisapp/hyphen)
[![CI/CD Status](https://img.shields.io/github/actions/workflow/status/LunarisApp/text-tools/checks.yml?label=CI%2FCD)](https://github.com/LunarisApp/text-tools/actions/workflows/checks.yml)

A hyphenation library based on [LibreOffice dictionaries](https://git.libreoffice.org/dictionaries), inspired by [pyphen](https://github.com/Kozea/Pyphen).

> [!TIP]
> See also:
>   - [@lunarisapp/stats](https://github.com/LunarisApp/text-tools/tree/main/packages/stats) for text statistics (e.g. word count, sentence count, etc.).
>   - [@lunarisapp/readability](https://github.com/LunarisApp/text-tools/tree/main/packages/readability) for text readability scores (e.g. Flesch Reading Ease).

## Installation

```bash
npm install @lunarisapp/hyphen
```

## Usage

```typescript
import { TextHyphen } from '@lunarisapp/hyphen';

const textHyphen = new TextHyphen({
    lang: 'en_US',
    left: 2,
    right: 2,
});

// Gets the textHyphenation points for a word.
// Result: [2, 6]
textHyphen.positions('hyphenation');

// Wraps a word with hyphens at the given positions.
// Result: 'hy-phenation'
textHyphen.wrap('hy-phenation', 3);

// Gets the hyphenation variants for a word.
// Result: [['hy', 'phenation'], ['hyphen', 'ation']]
textHyphen.variants('hyphenation');

// Inserts hyphens in all possible positions.
// Result: 'hy-phen-ation'
textHyphen.inserted('hyphenation');
```

