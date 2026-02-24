import { removePunctuation } from "./remove-punctuation";

/**
 * Get the words from text.
 * @param text
 * @param isRemovePunctuation
 */
export function getWords(text: string, isRemovePunctuation = true) {
  const processedText = isRemovePunctuation
    ? removePunctuation(text, true)
    : text;
  return processedText.toLowerCase().split(/\s+/g);
}

/**
 * Get the sentences from text.
 * @param text
 */
export function getSentences(text: string) {
  return text.match(/[^.!?。！？\n\r]+[.!?。！？]*[\n\r]*/gu) || [];
}
