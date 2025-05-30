# Lunaris Language

[![NPM Version](https://img.shields.io/npm/v/%40lunarisapp%2Flanguage)](https://www.npmjs.com/package/@lunarisapp/language)
[![NPM Downloads](https://img.shields.io/npm/dm/%40lunarisapp%2Flanguage)](https://www.npmjs.com/package/@lunarisapp/language)
[![CI Status](https://img.shields.io/github/actions/workflow/status/LunarisApp/text-tools/checks.yml?label=CI)](https://github.com/LunarisApp/text-tools/actions/workflows/checks.yml)

A utility library for core linguistic breakdown: vowels, consonants, words, and sentences.

> [!TIP]
> See also:
>   - [@lunarisapp/stats](https://github.com/LunarisApp/text-tools/tree/main/packages/stats) for text statistics (e.g. word count, sentence count, etc.).
>   - [@lunarisapp/readability](https://github.com/LunarisApp/text-tools/tree/main/packages/readability) for text readability scores (e.g. Flesch Reading Ease).

## Features

- Browser & Node.js support
- Multi-language support
- TypeScript support

## Installation

```bash
npm install @lunarisapp/language
```

## Usage

```typescript
import { type Language, vowels, consonants, removePunctuation, getWords, getSenteces } from '@lunarisapp/language';

const lang: Language = 'en_US';

const enVowels = vowels[lang];
const enConsonants = consonants[lang];

const text = 'Hello, world!';
const words = getWords(text);
const sentences = getSenteces(text);
const textWithoutPunctuation = removePunctuation(text);
```