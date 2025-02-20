import { enContractionsStr } from "./contractions";

/**
 * Remove punctuation from text.
 * @param text
 * @param ignoreContractions If true, contractions will be spared.
 */
export function removePunctuation(text: string, ignoreContractions = false) {
  if (ignoreContractions) {
    const antiContractionsRegex = new RegExp(`'(?!${enContractionsStr})`, "g");
    text = text.replace(antiContractionsRegex, '"');
    return text.replace(/[^\p{L}\p{N}\s']/gu, "");
  }
  return text.replace(/[^\p{L}\p{N}\s]/gu, "");
}
