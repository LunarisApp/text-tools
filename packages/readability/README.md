# Lunaris Readability

[![NPM Version](https://img.shields.io/npm/v/%40lunarisapp%2Freadability)](https://www.npmjs.com/package/@lunarisapp/readability)
[![NPM Downloads](https://img.shields.io/npm/dm/%40lunarisapp%2Freadability)](https://www.npmjs.com/package/@lunarisapp/readability)
[![CI/CD Status](https://img.shields.io/github/actions/workflow/status/LunarisApp/text-tools/checks.yml?label=CI%2FCD)](https://github.com/LunarisApp/text-tools/actions/workflows/checks.yml)

A library for calculating text readability scores based on popular algorithms & formulas, inspired by [textstat](https://github.com/textstat/textstat).

> [!TIP]
> See also:
>   - [@lunarisapp/language](https://github.com/LunarisApp/text-tools/tree/main/packages/language) for core linguistic breakdown: vowels, consonants, words, and sentences.
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
    lang: 'en_US', // optional, en_US by default
    cache: true,   // optional, true by default
});

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

| Function                            | Description                                                                 |
|-------------------------------------|-----------------------------------------------------------------------------|
| `fleschReadingEase(text)`           | Calculates the [Flesch Reading Ease](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch_reading_ease) score for the provided text.             |
| `fleschKincaidGrade(text)`          | Calculates the [Flesch-Kincaid Grade Level](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch%E2%80%93Kincaid_grade_level) for the provided text.            |
| `smogIndex(text)`                   | Calculates the [SMOG Index](https://en.wikipedia.org/wiki/SMOG) for the provided text.                            |
| `automatedReadabilityIndex(text)`   | Calculates the [Automated Readability Index (ARI)](https://en.wikipedia.org/wiki/Automated_readability_index) for the provided text.   |
| `colemanLiauIndex(text)`            | Calculates the [Coleman-Liau Index](https://en.wikipedia.org/wiki/Coleman%E2%80%93Liau_index) for the provided text.                   |
| `linsearWriteFormula(text)`         | Calculates the [Linsear Write Formula](https://en.wikipedia.org/wiki/Linsear_Write) readability score for the provided text.|
| `crawford(text)`                    | Calculates the [Crawford Readability Score](https://www.spanishreadability.com/the-crawford-score-for-spanish-texts) for the provided text.          |
| `gulpeaseIndex(text)`               | Calculates the [Gulpease Index](https://it.wikipedia.org/wiki/Indice_Gulpease) for the provided text.                        |
| `gutierrezPolini(text)`             | Calculates the [Gutierrez-Polini Index](https://www.spanishreadability.com/gutierrez-de-polinis-readability-formula) for the provided text.                |
| `wienerSachtextformel(text)`        | Calculates the [Wiener Sachtextformel](https://de.wikipedia.org/wiki/Lesbarkeitsindex#Wiener_Sachtextformel) readability score for the provided text.|
| `mcalpineEflaw(text)`               | Calculates the [McAlpine English Fluency Assessment (EFLAW) score](https://www.angelfire.com/nd/nirmaldasan/journalismonline/fpetge.html) for the provided text. |

## Other

```typescript
import { type Language } from '@lunarisapp/readability';
```