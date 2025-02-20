# Lunaris Stats

[![NPM Version](https://img.shields.io/npm/v/%40lunarisapp%2Fstats)](https://www.npmjs.com/package/@lunarisapp/stats)
[![NPM Downloads](https://img.shields.io/npm/dm/%40lunarisapp%2Fstats)](https://www.npmjs.com/package/@lunarisapp/stats)
[![CI Status](https://img.shields.io/github/actions/workflow/status/LunarisApp/text-tools/checks.yml?label=CI)](https://github.com/LunarisApp/text-tools/actions/workflows/checks.yml)

A library for calculating text statistics, such as word count, sentence count, etc. Inspired by [textstat](https://github.com/textstat/textstat).

> [!TIP]
> See also:
>   - [@lunarisapp/language](https://github.com/LunarisApp/text-tools/tree/main/packages/language) for core linguistic breakdown: vowels, consonants, words, and sentences.
>   - [@lunarisapp/readability](https://github.com/LunarisApp/text-tools/tree/main/packages/readability) for text readability scores (e.g. Flesch Reading Ease).
>   - [@lunarisapp/hyphen](https://github.com/LunarisApp/text-tools/tree/main/packages/hyphen) for word hyphenation.

## Features

- Browser & Node.js support
- Multi-language support
- Caching for faster performance
- TypeScript support

## Installation

```bash
npm install @lunarisapp/stats
```

## Usage

```typescript
import { TextStats } from '@lunarisapp/stats';

const textStats = new TextStats({ 
    lang: 'en_US', // optional, en_US by default
    cache: true,   // optional, true by default
});
textStats.wordCount('Hello, world!');
```

| Function                            | Description                                                                 |
|-------------------------------------|-----------------------------------------------------------------------------|
| `readingTime(text)`                 | Calculates the reading time of the text in seconds.                         |
| `wordCount(text)`                   | Counts the number of words in the provided text.                            |
| `sentenceCount(text)`               | Counts the number of sentence in the provided text.                         |
| `charCount(text)`                   | Counts the number of characters in the provided text.                       |
| `letterCount(text)`                 | Counts the number of letters in the provided text.                          |
| `syllableCount(text)`               | Counts the number of syllables in the provided text.                        |
| `vowelCount(text)`                  | Counts the number of vowels in the provided text.                           |
| `consonantCount(text)`              | Counts the number of consonants in the provided text.                       |
| `longWordCount(text, len)`          | Counts the words longer than the specified length in the provided text.     |
| `shortWordCount(text, len)`         | Counts the words shorter than the specified length in the provided text.    |
| `monosyllableCount(text)`           | Counts the monosyllabic words in the provided text.                         |
| `polysyllableCount(text)`           | Counts the polysyllabic words in the provided text.                         |
| `avgSentenceLength(text)`           | Calculates the average sentence length in the provided text.                |
| `avgSyllablesPerWord(text)`         | Calculates the average syllables per word in the provided text.             |
| `avgCharactersPerWord(text)`        | Calculates the average characters per word in the provided text.            |

### Other
```
import { consonants, vowels, type Language } from '@lunarisapp/stats';
```