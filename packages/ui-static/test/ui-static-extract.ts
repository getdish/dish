import '@dish/react-test-env/jsdom-register'

import path from 'path'

import { TestRenderer } from '@dish/react-test-env'
import anyTest, { TestInterface } from 'ava'
import React from 'react'
import { ViewStyle } from 'react-native'
import webpack from 'webpack'

import { GlossWebpackPlugin, getStylesAtomic } from '../src'

const mode = 'production'
process.env.NODE_ENV = mode

const test = anyTest as TestInterface<{
  test1Renderer: TestRenderer.ReactTestRenderer
  test2Renderer: TestRenderer.ReactTestRenderer
  test3Renderer: TestRenderer.ReactTestRenderer
  test4Renderer: TestRenderer.ReactTestRenderer
  test5Renderer: TestRenderer.ReactTestRenderer
  test6Renderer: TestRenderer.ReactTestRenderer
  test7Renderer: TestRenderer.ReactTestRenderer
  app: any
}>

const specDir = path.join(__dirname, 'spec')
const outDir = path.join(specDir, 'out')
const outFile = 'out.js'
const outFileFull = path.join(outDir, outFile)

test.before(async (t) => {
  await extractStaticApp()
  const app = require(outFileFull)
  t.context.app = app
  t.context.test1Renderer = TestRenderer.create(React.createElement(app.Test1))
  t.context.test2Renderer = TestRenderer.create(React.createElement(app.Test2))
  t.context.test3Renderer = TestRenderer.create(React.createElement(app.Test3))
  t.context.test4Renderer = TestRenderer.create(React.createElement(app.Test4))
  t.context.test5Renderer = TestRenderer.create(React.createElement(app.Test5))
  t.context.test6Renderer = TestRenderer.create(React.createElement(app.Test6))
  t.context.test7Renderer = TestRenderer.create(React.createElement(app.Test7))
})

test('converts a style object to class names', async (t) => {
  const style: ViewStyle = {
    backgroundColor: 'red',
    transform: [{ rotateY: '10deg' }],
  }
  const styles = getStylesAtomic(style)
  const style1 = styles.find((x) => x.identifier === 'r-1g6456j')
  const style2 = styles.find((x) => x.identifier === 'r-188uu3c')
  t.assert(!!style1)
  t.assert(!!style2)
  t.is(style1?.value, 'rgba(255,0,0,1.00)')
  t.is(style1?.property, 'backgroundColor')
  t.deepEqual(style1?.rules, [
    '.r-1g6456j{background-color:rgba(255,0,0,1.00);}',
  ])
  t.deepEqual(style2?.rules, [
    '.r-188uu3c{-webkit-transform:rotateY(10deg);transform:rotateY(10deg);}',
  ])
})

test('1. extracts to a div for simple views', async (t) => {
  const { test1Renderer } = t.context
  const out = test1Renderer.toTree()
  t.is(out?.type, 'div')
  t.is(out?.props.className, 'is_VStack r-1g6456j r-18c69zk r-13awgt0')
})

test('2. extracts className for complex views but keeps other props', async (t) => {
  const { test2Renderer } = t.context
  const out = test2Renderer.toTree()
  console.log('out', out)
  t.is(out?.type, 'Box')
})

test('3. places className correctly given a single spread', async (t) => {
  const { test3Renderer } = t.context
  const out = test3Renderer.toTree()
  t.is(out?.type, 'VStack')
})

test('4. leaves dynamic variables', async (t) => {
  const { test4Renderer } = t.context
  const out = test4Renderer.toTree()
  t.is(out?.props.className, 'r-4d76ec')
  t.is(out?.props.style.width, 'calc(100% + 20px)')
})

test.skip('5. spread', async (t) => {
  const { test5Renderer } = t.context
  const out = test5Renderer.toTree()
  // t.is(out?.props.className, 'r-4d76ec')
  // t.is(out?.props.width, 'calc(100% + 12px)')
})

test.skip('6. spread ternary', async (t) => {
  const { test6Renderer } = t.context
  const out = test6Renderer.toTree()
  // t.is(out?.props.className, 'r-4d76ec')
  // t.is(out?.props.width, 'calc(100% + 12px)')
})

test('7. ternary', async (t) => {
  const { test7Renderer } = t.context
  const out = test7Renderer.toTree()
  t.is(
    out?.props.className,
    'r-1pjcn9w r-1dfn399 r-1ay0y9e r-1pjcn9w r-1dfn399 r-1ay0y9e r-f2w40 r-68jxh1 r-1skwq7n'
  )
})

async function extractStaticApp() {
  const compiler = webpack({
    context: specDir,
    mode,
    devtool: false,
    optimization: {
      minimize: false,
      concatenateModules: false,
    },
    entry: path.join(specDir, 'extract-specs.tsx'),
    output: {
      libraryTarget: 'commonjs',
      filename: outFile,
      path: outDir,
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
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
