import tscc from '@dish/rollup-plugin-tscc'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import css from 'rollup-plugin-css-only'

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
  external: Object.values(external),
  plugins: [
    alias({
      entries: [{ find: 'react-native', replacement: 'react-native-web' }],
    }),
    commonjs({
      // include: ['node_modules/**'],
      exclude: [
        'shared/**/*',
        '../../packages/**/*',
        '**.ts',
        '**.tsx',
        'node_modules/symbol-observable/**',
      ],
      syntheticNamedExports: true,
    }),
    json(),
    nodeResolve({
      browser: true,
      extensions: ['*.js', '*.ts', '*.tsx'],
    }),
    tscc({
      specFile: './tscc.spec.json',
      external: external,
    }),
    typescript({
      tsconfig: './tsconfig.tscc.json',
      typescript: require('typescript'),
    }),
    css({ output: './dist/bundle.css' }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
}

export default config
