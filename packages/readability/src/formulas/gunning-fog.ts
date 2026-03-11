/**
 * Calculate the Gunning Fog index for text.
 * https://en.wikipedia.org/wiki/Gunning_fog_index
 */
export function gunningFog(params: {
  avgWordsPerSentence: number;
  difficultWords: number;
  totalWords: number;
}) {
  const { avgWordsPerSentence, difficultWords, totalWords } = params;
  if (totalWords === 0) {
    return 0;
  }
  const pdw = (difficultWords / totalWords) * 100;
  return 0.4 * (avgWordsPerSentence + pdw);
}
