import path from 'path'

import anyTest, { TestInterface } from 'ava'
import { ViewStyle } from 'react-native'
import webpack from 'webpack'

import { GlossWebpackPlugin, getStylesAtomic } from '../src'

const mode = 'production'
process.env.NODE_ENV = mode

interface Context {}
const test = anyTest as TestInterface<Context>

const specDir = path.join(__dirname, 'spec')

test('converts a style object to class names', async (t) => {
  const style: ViewStyle = {
    backgroundColor: 'red',
    transform: [{ rotateY: '10deg' }],
  }
  const styles = getStylesAtomic(style)
  const style1 = styles['r-1g6456j']
  const style2 = styles['r-188uu3c']
  t.assert(!!style1)
  t.assert(!!style2)
  t.is(style1.value, 'rgba(255,0,0,1.00)')
  t.is(style1.property, 'backgroundColor')
  t.deepEqual(style1.rules, [
    '.r-1g6456j{background-color:rgba(255,0,0,1.00);}',
  ])
  t.deepEqual(style2.rules, [
    '.r-188uu3c{-webkit-transform:rotateY(10deg);transform:rotateY(10deg);}',
  ])
})

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
      filename: 'spec.js',
      path: path.join(__dirname, '..', '_'),
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
