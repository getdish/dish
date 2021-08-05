const path = require('path')
const createWebpackConfig = require('@dish/webpack').default

module.exports = (opts) => {
  return createWebpackConfig({
    ...opts,
    entry: path.resolve(path.join(__dirname, 'src', 'index.web.tsx')),
    cwd: __dirname,
    defineOptions: {
      ...(process.env.APP_ENDPOINT && {
        'process.env.APP_ENDPOINT': process.env.APP_ENDPOINT,
      }),
      'process.env.DISH_DEBUG':
        process.env.DISH_DEBUG ?? process.env.NODE_ENV === 'production' ? '0' : '1',
    },
    resolve: {
      alias: {
        react: path.join(require.resolve('react'), '..'),
        'react-dom': path.join(require.resolve('react-dom'), '..'),
        'react-native': 'react-native-web',
        '@dish/react-feather': 'react-feather',
        gqty: path.join(require.resolve('gqty'), '..'),
        recyclerlistview: 'recyclerlistview/web',
        // bugfix until merged
        'react-native-web/src/modules/normalizeColor':
          'react-native-web/dist/modules/normalizeColor',
      },
    },
    pollyFillPath: path.join(__dirname, 'src', 'web', 'polyfill.legacy.js'),
    snackOptions: {
      evaluateImportsWhitelist: ['constants.js', 'colors.js'],
      themesFile: require.resolve('./src/constants/themes.ts'),
      logTimings: true,
    },
    htmlOptions: {
      inject: true,
      favicon: 'src/web/favicon.png',
      template: path.join(__dirname, 'src/index.html'),
    },
  })
}
