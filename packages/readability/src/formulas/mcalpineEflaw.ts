/**
 * Calculate the McAlpine EFLAW score.
 * https://www.angelfire.com/nd/nirmaldasan/journalismonline/fpetge.html
 */
export function mcalpineEflaw(params: { words: number, sentences: number, miniWords: number }) {
    const { words, sentences, miniWords } = params;
    return (words + miniWords) / sentences;
}