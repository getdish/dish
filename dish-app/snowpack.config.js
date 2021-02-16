module.exports = {
  alias: {},
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    // '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
  ],
  packageOptions: {
    polyfillNode: true,
    external: ['path'],
  },
  routes: [
    /* Enable an SPA Fallback in development: */
    // { match: 'routes', src: '.*', dest: '/index.html' },
  ],
  exclude: [
    'etc/**',
    'src/api/**',
    '**/*.native.*',
    'test/**',
    'android/**',
    'ios/**',
    require.resolve('./index.js'),
    'metro.config.js',
    '../node_modules/expo/**',
    'build/**',
    'webpack.config.js',
    'patches/**',
    '**/.types/**/*',
    'build/**',
  ],
  alias: {
    'react-native': 'react-native-web',
    '@dish/react-feather': 'react-feather',
    recyclerlistview: 'recyclerlistview/web',
    // bugfix until merged
    'react-native-web/src/modules/normalizeColor':
      'react-native-web/dist/modules/normalizeColor',
  },
  devOptions: {
    secure: false,
    hostname: 'localhost',
    port: 4444,
    open: 'default',
    output: 'stream',
    hmrDelay: 0,
    hmrPort: undefined,
    hmrErrorOverlay: true,
  },
}
