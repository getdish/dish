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
  const classNames = getStylesAtomic(style)
  // could be spec
  t.is(classNames[0].identifier, 'r-1g6456j')
  t.is(classNames[0].value, 'rgba(255,0,0,1.00)')
  t.is(classNames[0].property, 'backgroundColor')
  t.deepEqual(classNames[0].rules, [
    '.r-1g6456j{background-color:rgba(255,0,0,1.00);}',
  ])
  t.deepEqual(classNames[1].rules, [
    '.r-188uu3c{-webkit-transform:rotateY(10deg);transform:rotateY(10deg);}',
  ])
})

test.skip('extracts static styles', async (t) => {
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
