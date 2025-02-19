import { describe, expect, it } from "@jest/globals";
import { removePunctuation } from "../src";

export const punctText = `I said: 'This is a test sentence to test the remove_punctuation function.
It's short and not the work of a singer-songwriter. But it'll suffice.'
Your answer was: "I don't know. If I were you I'd write a test; just to make
sure, you're really just removing the characters you want to remove!" Didn't`;

export const punctTextResultWApostr = `I said This is a test sentence to test the removepunctuation function
It's short and not the work of a singersongwriter But it'll suffice
Your answer was I don't know If I were you I'd write a test just to make
sure you're really just removing the characters you want to remove Didn't`;

export const punctTextResultWoApostr = `I said This is a test sentence to test the removepunctuation function
Its short and not the work of a singersongwriter But itll suffice
Your answer was I dont know If I were you Id write a test just to make
sure youre really just removing the characters you want to remove Didnt`;

describe("remove punctuation", () => {
  it("incl. apostr in contractions", () => {
    const text = removePunctuation(punctText);
    expect(text).toBe(punctTextResultWoApostr);
  });

  it("ignore contractions", () => {
    const text = removePunctuation(punctText, true);
    expect(text).toBe(punctTextResultWApostr);
  });
});
