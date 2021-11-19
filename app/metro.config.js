const { createMetroConfiguration } = require('expo-yarn-workspaces')
const block = require('metro-config/src/defaults/exclusionList')
const path = require('path')

const config = createMetroConfiguration(__dirname)

module.exports = {
  ...config,
  watchFolders: [...config.watchFolders, path.join(__dirname, '../packages')],
  resolver: {
    ...config.resolver,
    blockList: block([/.*\/android\/React(Android|Common)\/.*/, /.*\/versioned-react-native\/.*/]),
    resolverMainFields: ['react-native', 'browser', 'tsmain', 'main'],
  },
  transformer: {
    ...config.transformer,
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
      },
    }),
  },
}
