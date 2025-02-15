module.exports = {
  transform: {
    "^.+\\.ts?$": "babel-jest",
    "^.+\\.dic?$": "<rootDir>/tests/__mocks__/dic.js",
  },
};
