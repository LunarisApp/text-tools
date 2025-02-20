import { contractionsRegexSeq } from "./contractions";

/**
 * Remove punctuation from text.
 * @param text
 * @param ignoreContractions
 */
export function removePunctuation(text: string, ignoreContractions = false) {
  if (ignoreContractions) {
    const contractions = Object.values(contractionsRegexSeq).join("|");
    if (contractions) {
      const antiContractionsRegex = new RegExp(`'(?!${contractions})`, "g");
      text = text.replace(antiContractionsRegex, '"');
      return text.replace(/[^\p{L}\p{N}\s']/gu, "");
    }
  }
  return text.replace(/[^\p{L}\p{N}\s]/gu, "");
}
