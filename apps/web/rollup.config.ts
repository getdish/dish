import tscc from '@dish/rollup-plugin-tscc'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
// import serve from 'rollup-plugin-serve'
import babel from 'rollup-plugin-babel'
import commonjsalt from 'rollup-plugin-commonjs-alternate'
import css from 'rollup-plugin-css-only'
import refresh from 'rollup-plugin-react-refresh'

const isDev = process.env.NODE_ENV === 'development'

const babelConfig = require('./babel.config')
const babelrc = babelConfig({
  env(str) {
    return str == 'production' ? false : true
  },
})
console.log('babelrc', babelrc)

const external = {
  React: 'react',
  ReactDOM: 'react-dom',
  fastJsonStableStringify: 'fast-json-stable-stringify',
  graphqlTag: 'graphql-tag',
  subscriptionsTransportWs: 'subscriptions-transport-ws',
  axios: 'axios',
  jsonToGraphqlQuery: 'json-to-graphql-query',
  'overmind/config': 'overmind/config',
  zenObservable: 'zen-observable',
  'graphql/language/printer': 'graphql/language/printer',
  'graphql/language/visitor': 'graphql/language/visitor',
  util: 'util',
  queryString: 'query-string',
}

// : Rollup.RollupOptions
const config = {
  input: './web/index.web.tsx',
  // preserveSymlinks: true,
  output: {
    format: 'iife',
    sourcemap: true,
    dir: '.',
  },
  external: isDev ? {} : Object.values(external),
  plugins: [
    alias({
      entries: [{ find: 'react-native', replacement: 'react-native-web' }],
    }),
    // // for react refresh only
    isDev &&
      commonjsalt({
        exclude: ['node_modules/react-native-web/**'],
        namedExports: {
          'node_modules/phoenix/priv/static/phoenix.js': ['Socket'],
        },
      }),
    // !isDev &&
    // commonjs({
    //   // include: ['node_modules/**'],
    //   exclude: [
    //     'shared/**/*',
    //     '../../packages/**/*',
    //     '**.ts',
    //     '**.tsx',
    //     'node_modules/symbol-observable/**',
    //   ],
    //   // @ts-ignore
    //   syntheticNamedExports: true,
    // }),
    json(),
    nodeResolve({
      // could try module esm exports
      mainFields: ['tsmain', 'module', 'browser', 'main'],
      extensions: ['*.js', '*.ts', '*.tsx'],
    }),
    !isDev &&
      tscc({
        specFile: './tscc.spec.json',
        external: external,
      }),
    // babel({
    //   babelrc: false,
    //   plugins: ['react-refresh/babel', '@babel/plugin-syntax-typescript'],
    // }),
    typescript({
      tsconfig: './tsconfig.tscc.json',
      typescript: require('typescript'),
      // tslib: require('some-fork'),
    }),
    // commonjsalt(),
    css({ output: './dist/bundle.css' }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    process.env.NODE_ENV === 'development' && refresh(),
    // serve({
    //   // Launch in browser (default: false)
    //   open: true,

    //   // Page to navigate to when opening the browser.
    //   // Will not do anything if open=false.
    //   // Remember to start with a slash.
    //   openPage: '/different/page',

    //   // Show server address in console (default: true)
    //   verbose: false,

    //   // Folder to serve files from
    //   contentBase: ['web-build'],

    //   // Set to true to return index.html (200) instead of error page (404)
    //   historyApiFallback: true,

    //   // Options used in setting up server
    //   host: 'd1sh_hasura_live',
    //   port: 10001,

    //   // By default server will be served over HTTP (https: false). It can optionally be served over HTTPS
    //   https: {
    //     key: fs.readFileSync('/path/to/server.key'),
    //     cert: fs.readFileSync('/path/to/server.crt'),
    //     ca: fs.readFileSync('/path/to/ca.pem'),
    //   },

    //   //set headers
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     foo: 'bar',
    //   },
    // }),
  ],
}

export default config
