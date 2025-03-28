# Lunaris CMUdict

[![NPM Version](https://img.shields.io/npm/v/%40lunarisapp%2Fcmudict)](https://www.npmjs.com/package/@lunarisapp/cmudict)
[![NPM Downloads](https://img.shields.io/npm/dm/%40lunarisapp%2Fcmudict)](https://www.npmjs.com/package/@lunarisapp/cmudict)
[![CI Status](https://img.shields.io/github/actions/workflow/status/LunarisApp/text-tools/checks.yml?label=CI)](https://github.com/LunarisApp/text-tools/actions/workflows/checks.yml)


A JavaScript interface to [the Carnegie Mellon University Pronouncing Dictionary (CMUdict)](https://github.com/cmusphinx/cmudict), inspired by [cmudict](https://github.com/prosegrinder/python-cmudict).

> [!TIP]
> See also:
>   - [@lunarisapp/language](https://github.com/LunarisApp/text-tools/tree/main/packages/language) for core linguistic breakdown: vowels, consonants, words, and sentences.
>   - [@lunarisapp/stats](https://github.com/LunarisApp/text-tools/tree/main/packages/stats) for text statistics (e.g. word count, sentence count, etc.).
>   - [@lunarisapp/readability](https://github.com/LunarisApp/text-tools/tree/main/packages/readability) for text readability scores (e.g. Flesch Reading Ease).

## Features

- Browser & Node.js support
- TypeScript support
- Up-to-date [CMUdict](https://github.com/cmusphinx/cmudict) data

## Installation

```bash
npm install @lunarisapp/cmudict
```

## Usage

```typescript
import cmudict from '@lunarisapp/cmudict';

const cmuDict = cmudict.dict();
const cmuPhones = cmudict.phones();
const cmuVP = cmudict.vp();
const cmuSymbols = cmudict.symbols();
```