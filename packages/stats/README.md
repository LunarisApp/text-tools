# Lunaris Stats

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
// Result: 2
textStats.wordCount('Hello, world!');

// Gets the sentence count.
// Result: 2
textStats.sentenceCount('Hello, world! How are you?');

// And also...
textStats.readingTime('...'); // in seconds

// And more...
textStats.charCount('...');
textStats.letterCount('...');
textStats.syllableCount('...');
textStats.longWordsCount('...', 6);
textStats.shortWordCount('...', 3);
textStats.monosyllablesCount('...');
textStats.polysyllablesCount('...');
textStats.avgSentenceLength('...');
textStats.avgSyllablesPerWord('...');
textStats.avgCharactersPerWord('...');
textStats.avgSentencesPerWord('...');
textStats.avgWordsPerSentence('...');
textStats.removePunctuation('...');
```