module.exports = {
  process(sourceText, _sourcePath, _options) {
    return {
      code: `module.exports = ${JSON.stringify(sourceText)};`,
    };
  },
};
