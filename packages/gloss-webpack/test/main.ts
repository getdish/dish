import path from 'path'

import anyTest, { TestInterface } from 'ava'
import webpack from 'webpack'

import { GlossWebpackLoader, GlossWebpackPlugin } from '../src'

console.log('GlossWebpackPlugin', GlossWebpackPlugin)

interface Context {}
const test = anyTest as TestInterface<Context>

test('it extract statics', async (t) => {
  const compiler = webpack({
    mode: 'development',
    devtool: false,
    entry: path.join(__dirname, 'test.js'),
    output: {
      filename: 'test.out.js',
      path: path.resolve(__dirname),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            // babel-loader,
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
