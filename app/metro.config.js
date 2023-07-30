// https://docs.expo.dev/guides/monorepos/

const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

// Monorepo
const projectRoot = __dirname
const workspaceRoot = path.resolve(__dirname, '..')

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPath = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

config.resolver.disableHierarchicalLookup = true
config.resolver.resolverMainFields = ['module:jsx', 'react-native', 'browser', 'main']

module.exports = {
  ...config,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
      },
    }),
  },
}
