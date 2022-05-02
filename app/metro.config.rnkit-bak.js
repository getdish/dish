const { makeMetroConfig } = require('@rnx-kit/metro-config')
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks')

// many errors :/

const config = makeMetroConfig({
  resolver: {
    resolverMainFields: ['module:jsx', 'react-native', 'browser', 'main'],
    resolveRequest: MetroSymlinksResolver(),
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
