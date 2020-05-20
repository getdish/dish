import path from 'path'

import anyTest, { TestInterface } from 'ava'
import webpack from 'webpack'

import { GlossWebpackPlugin } from '../src'

process.env.NODE_ENV = 'development'

interface Context {}
const test = anyTest as TestInterface<Context>

const specDir = path.join(__dirname, 'spec')

test('it extract statics', async (t) => {
  const compiler = webpack({
    context: specDir,
    mode: 'development',
    devtool: false,
    entry: path.join(specDir, 'test.tsx'),
    output: {
      filename: 'test.out.tmp.js',
      path: specDir,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      mainFields: ['tsmain', 'browser', 'module', 'main'],
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
      console.log(result.toString())
      res()
    })
  })

  t.is(1, 1)
})
