/**
 * Calculate the Szigriszt Pazos readability formula for text (Spanish only).
 * Szigriszt Pazos, Francisco (1992). Sistemas predictivos de legibilidad del mensaje escrito: fórmula de perspicuidad.
 */
export function szigrisztPazos(params: {
  totalSyllables: number;
  totalWords: number;
  totalSentences: number;
  freBase: number;
}) {
  const { totalSyllables, totalWords, totalSentences, freBase } = params;

  if (totalWords === 0 || totalSentences === 0) {
    return 0;
  }

  return (
    freBase - 62.3 * (totalSyllables / totalWords) - totalWords / totalSentences
  );
}
