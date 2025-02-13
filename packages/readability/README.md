# Lunaris Readability

A library for calculating text readability scores based on popular algorithms & formulas, inspired by [textstat](https://github.com/textstat/textstat).

> [!TIP]
> See also:
>   - [@lunarisapp/stats](https://github.com/LunarisApp/text-tools/tree/main/packages/stats) for text statistics (e.g. word count, sentence count, etc.).
>   - [@lunarisapp/hyphen](https://github.com/LunarisApp/text-tools/tree/main/packages/hyphen) for word hyphenation.

## Installation

```bash
npm install @lunarisapp/readability
```

## Usage

```typescript
import { TextReadability } from '@lunarisapp/readability';

const textReadability = new TextReadability({
    lang: 'en_US',
});

// or global instance
import { textReadability } from '@lunarisapp/readability';

textReadability.fleschReadingEase('Hello, world!');
```

The package also exports pure formulas, if you want to use them directly:

```typescript
import { fleschReadingEase } from '@lunarisapp/readability';
fleschReadingEase({
    wordCount: 2,
    sentenceCount: 1,
    syllableCount: 6,
});
```

## Algorithms
// TODO