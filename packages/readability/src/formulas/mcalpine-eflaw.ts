/**
 * Calculate the McAlpine EFLAW score.
 * https://www.angelfire.com/nd/nirmaldasan/journalismonline/fpetge.html
 */
export function mcalpineEflaw(params: {
  words: number;
  sentences: number;
  miniWords: number;
}) {
  const { words, sentences, miniWords } = params;
  if (sentences === 0) {
    return 0;
  }
  return (words + miniWords) / sentences;
}
