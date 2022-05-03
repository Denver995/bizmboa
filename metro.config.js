const { getDefaultConfig } = require("metro-config");
const { resolver: defaultResolver } = getDefaultConfig.getDefaultValues();
// const { getDefaultConfig } = require('@expo/metro-config');
// const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    ...defaultResolver,
    sourceExts: [...defaultResolver.sourceExts, "cjs"],
  },
};