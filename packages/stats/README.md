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

const stats = new TextStats({
    lang: 'en_US',
    rmApostrophe: true,
});

// Gets the word count.
// Result: 2
stats.wordCount('Hello, world!');

// Gets the sentence count.
// Result: 2
stats.sentenceCount('Hello, world! How are you?');

// And also...
stats.readingTime('...'); // in seconds

// And more...
stats.charCount('...');
stats.letterCount('...');
stats.syllableCount('...');
stats.longWordsCount('...', 6);
stats.shortWordCount('...', 3);
stats.monosyllablesCount('...');
stats.polysyllablesCount('...');
stats.avgSentenceLength('...');
stats.avgSyllablesPerWord('...');
stats.avgCharactersPerWord('...');
stats.avgSentencesPerWord('...');
stats.avgWordsPerSentence('...');
stats.removePunctuation('...');
```