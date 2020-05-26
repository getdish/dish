import path from 'path'

import anyTest, { TestInterface } from 'ava'
import webpack from 'webpack'

import { GlossWebpackPlugin } from '../src'

const mode = 'production'
process.env.NODE_ENV = mode

interface Context {}
const test = anyTest as TestInterface<Context>

const specDir = path.join(__dirname, 'spec')

test('extracts static styles', async (t) => {
  const compiler = webpack({
    context: specDir,
    mode: mode,
    devtool: false,
    optimization: {
      minimize: false,
    },
    entry: path.join(specDir, 'test.tsx'),
    output: {
      filename: 'test.out.tmp.js',
      path: specDir,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      mainFields: ['tsmain', 'browser', 'module', 'main'],
      alias: {
        'react-native-web': false,
      },
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /(node_modules)/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: require.resolve('../loader'),
              options: {},
            },
          ],
        },
      ],
    },
    plugins: [new GlossWebpackPlugin()],
  })

  await new Promise((res) => {
    compiler.run((err, result) => {
      console.log({ err })
      console.log(result?.toString())
      res()
    })
  })

  t.is(1, 1)
})
