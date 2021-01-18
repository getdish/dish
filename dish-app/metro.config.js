const { createMetroConfiguration } = require('expo-yarn-workspaces')
const block = require('metro-config/src/defaults/exclusionList')

const config = createMetroConfiguration(__dirname)

// TODO inlineRequires

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    blockList: block([
      /.*\/android\/React(Android|Common)\/.*/,
      /.*\/versioned-react-native\/.*/,
    ]),
  },
  transformer: {
    ...config.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
}
