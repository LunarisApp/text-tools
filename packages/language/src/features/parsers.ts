import { removePunctuation } from "./removePunctuation";

/**
 * Get the words from text.
 * @param text
 * @param isRemovePunctuation
 */
export function getWords(text: string, isRemovePunctuation = true) {
  if (isRemovePunctuation) {
    text = removePunctuation(text, true);
  }
  return text.toLowerCase().split(/\s+/g);
}

/**
 * Get the sentences from text.
 * @param text
 */
export function getSentences(text: string) {
  return text.match(/[^.!?。！？\n\r]+[.!?。！？]*[\n\r]*/gu) || [];
}
