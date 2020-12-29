const { createMetroConfiguration } = require('expo-yarn-workspaces')
const block = require('metro-config/src/defaults/exclusionList')

const config = createMetroConfiguration(path.join(__dirname, 'src'))

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    blockList: block([
      /.*\/android\/React(Android|Common)\/.*/,
      /.*\/versioned-react-native\/.*/,
    ]),
  },
}
