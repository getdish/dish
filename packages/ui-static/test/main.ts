import path from 'path'

import anyTest, { TestInterface } from 'ava'
import React from 'react'
import ReactDOM from 'react-dom'
import { ViewStyle } from 'react-native'
import TestRenderer from 'react-test-renderer'
import webpack from 'webpack'

import { GlossWebpackPlugin, getStylesAtomic } from '../src'

global['React'] = React
global['ReactDOM'] = ReactDOM

const mode = 'production'
process.env.NODE_ENV = mode

const test = anyTest as TestInterface<{
  test1Renderer: TestRenderer.ReactTestRenderer
  test2Renderer: TestRenderer.ReactTestRenderer
  app: any
}>

const specDir = path.join(__dirname, 'spec')
const outDir = path.join(specDir, 'out')
const outFile = 'out.js'
const outFileFull = path.join(outDir, outFile)

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

test.before(async (t) => {
  await extractStaticApp()
  const app = require(outFileFull)
  t.context.app = app
  t.context.test1Renderer = TestRenderer.create(React.createElement(app.Test1))
  // t.context.test2Renderer = TestRenderer.create(React.createElement(app.Test2))
})

test('extracts to a div for simple views', async (t) => {
  const out1JSON = t.context.test1Renderer.toJSON()
  t.is(out1JSON?.type, 'div')
  t.is(out1JSON?.props.className, 'is_VStack r-1g6456j')
})

async function extractStaticApp() {
  const compiler = webpack({
    context: specDir,
    mode: mode,
    devtool: false,
    optimization: {
      minimize: false,
    },
    entry: path.join(specDir, 'test.tsx'),
    output: {
      libraryTarget: 'commonjs',
      filename: outFile,
      path: outDir,
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
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
        {
          test: /\.css$/,
          use: [
            { loader: 'file-loader', options: { name: 'out.css' } },
            'extract-loader',
            'css-loader',
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
}
