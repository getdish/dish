const { createMetroConfiguration } = require('expo-yarn-workspaces')
const block = require('metro-config/src/defaults/exclusionList')
const { join } = require('path')

const config = createMetroConfiguration(__dirname)

module.exports = {
  ...config,
  watchFolders: [
    ...config.watchFolders,
    join(__dirname, '../packages'),
    join(__dirname, '../snackui/packages'),
  ],
  resolver: {
    ...config.resolver,
    blockList: block([/.*\/android\/React(Android|Common)\/.*/, /.*\/versioned-react-native\/.*/]),
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
