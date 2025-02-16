# Lunaris Stats

[![NPM Version](https://img.shields.io/npm/v/%40lunarisapp%2Fstats)](https://www.npmjs.com/package/@lunarisapp/stats)
[![NPM Downloads](https://img.shields.io/npm/dm/%40lunarisapp%2Fstats)](https://www.npmjs.com/package/@lunarisapp/stats)
[![CI/CD Status](https://img.shields.io/github/actions/workflow/status/LunarisApp/text-tools/checks.yml?label=CI%2FCD)](https://github.com/LunarisApp/text-tools/actions/workflows/checks.yml)

A library for calculating text statistics, such as word count, sentence count, etc. Inspired by [textstat](https://github.com/textstat/textstat).

> [!TIP]
> See also:
>   - [@lunarisapp/readability](https://github.com/LunarisApp/text-tools/tree/main/packages/readability) for text readability scores (e.g. Flesch Reading Ease).
>   - [@lunarisapp/hyphen](https://github.com/LunarisApp/text-tools/tree/main/packages/hyphen) for word hyphenation.

## Installation

```bash
npm install @lunarisapp/stats
```

## Usage

```typescript
import { TextStats } from '@lunarisapp/stats';

const textStats = new TextStats({
    lang: 'en_US',
    rmApostrophe: true,
});

// Gets the word count.
textStats.wordCount('Hello, world!');

// Gets the sentence count.
textStats.sentenceCount('Hello, world! How are you?');

// And also...
textStats.readingTime('...'); // in seconds

// And more...
textStats.charCount('...');
textStats.letterCount('...');
textStats.syllableCount('...');
textStats.vowelCount('...');
textStats.consonantCount('...');
textStats.longWordCount('...', 6);
textStats.shortWordCount('...', 3);
textStats.monosyllableCount('...');
textStats.polysyllableCount('...');
textStats.avgSentenceLength('...');
textStats.avgSyllablesPerWord('...');
textStats.avgCharactersPerWord('...');
textStats.avgSentencesPerWord('...');
textStats.avgWordsPerSentence('...');
textStats.removePunctuation('...');
```