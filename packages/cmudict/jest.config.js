module.exports = {
  transform: {
    "^.+\\.ts?$": "babel-jest",
    "^.+\\.dict?$": "<rootDir>/tests/__mocks__/cmudict.js",
    "^.+\\.phones?$": "<rootDir>/tests/__mocks__/cmudict.js",
    "^.+\\.vp?$": "<rootDir>/tests/__mocks__/cmudict.js",
    "^.+\\.symbols?$": "<rootDir>/tests/__mocks__/cmudict.js",
  },
};
