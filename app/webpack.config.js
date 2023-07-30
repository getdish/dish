const path = require('path')
const createWebpackConfig = require('@dish/webpack').default

module.exports = (opts) => {
  return createWebpackConfig({
    ...opts,
    entry: path.resolve(path.join(__dirname, 'src', 'index.web.tsx')),
    // polyFillPath: 'babel-polyfill',
    cwd: __dirname,
    defineOptions: {
      ...(process.env.APP_ENDPOINT && {
        'process.env.APP_ENDPOINT': process.env.APP_ENDPOINT,
      }),
      'process.env.GIT_COMMIT': process.env.GIT_COMMIT,
      'process.env.SENTRY_URL': process.env.SENTRY_URL || '',
      'process.env.DISH_DEBUG':
        process.env.DISH_DEBUG ?? process.env.NODE_ENV === 'production' ? '0' : '1',
    },
    resolve: {
      alias: {
        react$: require.resolve('react'),
        'react-dom$': require.resolve('react-dom'),
        'react-native': 'react-native-web',
        'react-native-svg$': '@tamagui/react-native-svg',
        'react-native-safe-area-context': require.resolve('react-native-safe-area-context'),
        'react-native-reanimated': require.resolve('react-native-reanimated'),
        // doesn't work..
        // 'react-native/Libraries/Renderer/shims/ReactFabric':
        //   require.resolve('@tamagui/proxy-worm'),
        gqty: path.join(require.resolve('gqty'), '..'),
        recyclerlistview: 'recyclerlistview/web',
        // bugfix until merged
        'react-native-web/src/modules/normalizeColor':
          'react-native-web/dist/modules/normalizeColor',
      },
    },
    pollyFillPath: path.join(__dirname, 'src', 'web', 'polyfill.legacy.js'),
    tamaguiOptions: {
      config: 'src/tamagui.config.ts',
      components: ['tamagui', '@dish/ui'],
      evaluateImportsWhitelist: ['constants.js', 'colors.js'],
      disableExtraction: process.env.NODE_ENV === 'development',
    },
    htmlOptions: {
      inject: true,
      favicon: 'src/web/favicon.png',
      template: path.join(__dirname, 'src/index.html'),
    },
  })
}
