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
import nodeGlobals from 'rollup-plugin-node-globals'
import refresh from 'rollup-plugin-react-refresh'

const isDev = process.env.NODE_ENV === 'development'

const babelConfig = require('./babel.config')
const babelrc = babelConfig({
  env(str) {
    return str == 'production' ? false : true
  },
})

const external = {
  // React: 'react',
  // ReactDOM: 'react-dom',
  // fastJsonStableStringify: 'fast-json-stable-stringify',
  // graphqlTag: 'graphql-tag',
  // subscriptionsTransportWs: 'subscriptions-transport-ws',
  // jsonToGraphqlQuery: 'json-to-graphql-query',
  // 'overmind/config': 'overmind/es/config',
  // zenObservable: 'zen-observable',
  // 'graphql/language/printer': 'graphql/language/printer',
  // 'graphql/language/visitor': 'graphql/language/visitor',
  // util: 'util',
  // queryString: 'query-string',
}

// useful debug
const logPlugin = (uid, showCode = true) => {
  return {
    transform(code, id) {
      console.log('---', uid, id)
      if (showCode) {
        console.log(code)
      }
      // not returning anything, so doesn't affect bundle
    },
  }
}

const commonjsplugin = commonjsalt({
  // exclude: ['node_modules/react-native-web/**'],
  namedExports: {
    '/Users/nw/dish/apps/web/node_modules/react-native-web/dist/vendor/react-native/ListView/index.js': [
      'ListView',
    ],
    'node_modules/phoenix/priv/static/phoenix.js': ['Socket'],
  },
})

// : Rollup.RollupOptions
const config = {
  input: './web/index.web.tsx',
  // preserveSymlinks: true,
  output: {
    format: 'esm',
    sourcemap: true,
    entryFileNames: '[name].js',
    assetFileNames: '[name].[extname]',
    dir: 'dist',
  },
  external: isDev ? {} : Object.values(external),
  plugins: [
    alias({
      entries: [
        { find: 'react-native', replacement: 'react-native-web' },
        { find: 'overmind/config', replacement: 'overmind/es/config' },
      ],
    }),

    json(),
    css({ output: './dist/bundle.css' }),

    isDev &&
      babel({
        extensions: ['.js', '.ts', '.tsx', '.json', '.mjs'],
      }),
    // logPlugin('babel', false),
    nodeResolve({
      // could try module esm exports
      mainFields: ['tsmain', 'module', 'browser', 'main'],
      extensions: ['.js', '.ts', '.tsx', '.json', '.mjs'],
    }),
    // logPlugin('nodeResolve', false),
    nodeGlobals(),
    {
      ...commonjsplugin,
      transform(...args) {
        const [_, id] = args
        if (id.indexOf('core-js/modules/_add-to-unscopables.js') > -1) {
          return
        }
        return commonjsplugin.transform.call(this, ...args)
      },
    },
    logPlugin('commonjs', false),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.TARGET': JSON.stringify('web'),
    }),
    process.env.NODE_ENV === 'development' && refresh(),
    logPlugin('done', false),
  ],
}

console.log({ babelrc, external, config })

export default config

// prod
// output: {
//   format: 'iife',
//   sourcemap: true,
//   dir: 'dist',
// },
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
// !isDev &&
//   tscc({
//     specFile: './tscc.spec.json',
//     external: external,
//   }),
// typescript({
//   tsconfig: './tsconfig.tscc.json',
//   typescript: require('typescript'),
//   // tslib: require('some-fork'),
// }),
// for react refresh only
// isDev &&
//   commonjsalt({
//     exclude: ['node_modules/react-native-web/**'],
//     namedExports: {
//       'node_modules/phoenix/priv/static/phoenix.js': ['Socket'],
//     },
//   }),
