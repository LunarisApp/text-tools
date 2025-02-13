# Lunaris Hyphen

A hyphenation library based on [LibreOffice dictionaries](https://git.libreoffice.org/dictionaries), inspired by [pyphen](https://github.com/Kozea/Pyphen).

> [!TIP]
> See also:
>   - [@lunaris/stats](https://github.com/LunarisApp/text-tools/tree/main/packages/stats) for text statistics (e.g. word count, sentence count, etc.).
>   - [@lunaris/readability](https://github.com/LunarisApp/text-tools/tree/main/packages/readability) for text readability scores (e.g. Flesch Reading Ease).

## Installation

```bash
npm install @lunaris/hyphen
```

## Usage

```typescript
import { TextHyphen } from '@lunaris/hyphen';

const hyphen = new TextHyphen({
    lang: 'en_US',
    left: 2,
    right: 2,
});

// Gets the hyphenation points for a word.
// Result: [2, 6]
hyphen.positions('hyphenation');

// Wraps a word with hyphens at the given positions.
// Result: 'hy-phenation'
hyphen.wrap('hy-phenation', 3);

// Gets the hyphenation variants for a word.
// Result: [['hy', 'phenation'], ['hyphen', 'ation']]
hyphen.variants('hyphenation');

// Inserts hyphens in all possible positions.
// Result: 'hy-phen-ation'
hyphen.inserted('hyphenation');
```

