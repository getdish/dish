const { makeMetroConfig } = require('@rnx-kit/metro-config')
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks')

// many errors :/

const config = makeMetroConfig({
  resolver: {
    resolverMainFields: ['module:jsx', 'react-native', 'browser', 'main'],
    resolveRequest: MetroSymlinksResolver({
      remapModule: MetroSymlinksResolver.remapImportPath({
        test: (moduleId) => moduleId.startsWith('@tamagui/'),
        extensions: ['.ts', '.tsx'],
        mainFields: ['module:jsx', 'module', 'main'],
      }),
    }),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
      },
    }),
  },
})

module.exports = config
