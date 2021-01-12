const path = require('path')
const createWebpackConfig = require('@dish/webpack').default

module.exports = () => {
  return createWebpackConfig({
    entry: path.resolve(path.join(__dirname, 'src', 'index.web.tsx')),
    cwd: __dirname,
    resolve: {
      alias: {
        react: path.join(require.resolve('react'), '..'),
        'react-dom': path.join(require.resolve('react-dom'), '..'),
        'react-native': 'react-native-web',
        '@dish/react-feather': 'react-feather',
        '@dish/gqless': path.join(require.resolve('@dish/gqless'), '..'),
        recyclerlistview: 'recyclerlistview/web',
        // bugfix until merged
        'react-native-web/src/modules/normalizeColor':
          'react-native-web/dist/modules/normalizeColor',
      },
    },
    pollyFillPath: path.join(__dirname, 'src', 'web', 'polyfill.legacy.js'),
    babelInclude,
    snackOptions: {
      evaluateImportsWhitelist: ['constants.js', 'colors.js'],
      themesFile: require.resolve('./src/constants/themes.ts'),
    },
    htmlOptions: {
      inject: true,
      favicon: 'src/web/favicon.png',
      template: path.join(__dirname, 'src/index.html'),
    },
    pwaOptions: {
      name: 'Dish',
      short_name: 'Dish',
      description: 'The Food Pokedex',
      background_color: '#000',
      crossorigin: 'use-credentials',
      icons: [
        {
          src: path.resolve('src/assets/icon.png'),
          sizes: [96, 128, 192, 512, 1024],
        },
      ],
    },
  })
}

const excludedRootPaths = [
  '/node_modules',
  // Prevent transpiling webpack generated files.
  '(webpack)',
]

function babelInclude(inputPath) {
  if (inputPath.includes('@dish/')) {
    return true
  }
  if (inputPath.includes('react-native-animatable')) {
    return true
  }
  if (inputPath.includes('expo-linear-gradient')) {
    return true
  }
  if (inputPath.includes('match-media')) {
    return true
  }
  if (inputPath.includes('react-native-reanimated')) {
    return true
  }

  if (
    excludedRootPaths.some((excluded) =>
      inputPath.includes(path.normalize(excluded))
    )
  ) {
    return false
  }
  return true
}
