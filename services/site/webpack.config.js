const path = require('path')
const createWebpackConfig = require('@dish/webpack').default

module.exports = (opts) => {
  return createWebpackConfig({
    ...opts,
    entry: './src/index.tsx',
    resolve: {
      alias: {
        react: path.join(require.resolve('react'), '..'),
        'react-dom': path.join(require.resolve('react-dom'), '..'),
        'react-native': 'react-native-web',
        'react-native-web/src/modules/normalizeColor':
          'react-native-web/dist/modules/normalizeColor',
      },
    },
    // pollyFillPath: path.join(__dirname, 'src', 'web', 'polyfill.legacy.js'),
    snackOptions: {
      evaluateImportsWhitelist: ['constants.js', 'colors.js'],
      themesFile: require.resolve('./src/themes.ts'),
    },
    htmlOptions: {
      inject: true,
      favicon: 'public/favicon.png',
      template: 'public/index.html',
    },
  })
}
