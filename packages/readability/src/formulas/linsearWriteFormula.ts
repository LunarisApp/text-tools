/**
 * Calculate the Linsear Write formula for text.
 * https://en.wikipedia.org/wiki/Linsear_Write
 */
export function linsearWriteFormula(params: {
    sentences: number;
    syllablesPerWords: number[];
}) {
    const { sentences, syllablesPerWords } = params;
    let easyWords = 0;
    let difficultWords = 0;

    for (const syllables of syllablesPerWords) {
        if (syllables < 3) {
            easyWords += 1;
        } else {
            difficultWords += 1;
        }
    }
    try {
        const score = (easyWords + difficultWords * 3) / sentences;
        if (score <= 20) {
            return (score - 2) / 2;
        }
        return score / 2;
    } catch {
        return 0;
    }
}