import '@dish/react-test-env/browser'
import '@expo/match-media'

import path from 'path'

import { TestRenderer, act, render } from '@dish/testy'
import React from 'react'
import webpack from 'webpack'

import { externalizeModules } from './lib/externalizeModules'
import { outDir, specDir } from './lib/test-constants'

const outFile = 'out-webpack.js'
const outFileFull = path.join(outDir, outFile)

process.env.NODE_ENV = 'test'
// dont want line numbers output for snapshots
// process.env.IDENTIFY_TAGS = 'true'

let app: any
let context: any = {}

beforeAll(async () => {
  console.log('building webpack...')
  await extractStaticApp()
  process.env.IS_STATIC = undefined
  app = require(outFileFull)
  for (const key in app) {
    act(() => {
      const App = app[key]
      context[key.toLowerCase()] = {
        Element: App,
        renderer: TestRenderer.create(<App conditional={true} />),
        rendererFalse: TestRenderer.create(<App conditional={false} />),
      }
    })
  }
  console.log('done')
})

// TODO fix testability of linear gradient
// test('extracts gradients', () => {
//   const { renderer } = context.testlineargradient
//   console.log(renderer.toJSON())
//   // console.log('out', style.backgroundColor, style.paddingRight)
//   t.assert(true)
// })

// test('extracts media queries', async () => {
//   const { TestMediaQuery } = context.app
//   const { style } = await getTestElement(TestMediaQuery)
//   // TODO not picking up media queries
//   console.log('out', style.backgroundColor, style.paddingRight)
//   expect(true)
// })

//
// test styles
//
// testStyles(test)

test('1. extracts to a div for simple views', () => {
  const { test1 } = context
  const out = test1.renderer.toJSON()!
  expect(out).toMatchSnapshot()
})

test('2. extracts className for complex views but keeps other props', () => {
  const { test2 } = context
  const out = test2.renderer.toJSON()!
  expect(out).toMatchSnapshot()
  const outFalse = test2.rendererFalse.toJSON()
  expect(outFalse).toMatchSnapshot()
})

test('3. places className correctly given a single spread', () => {
  const {
    test3: { Element },
  } = context
  const out = render(<Element />)
  const list = [...out.container.firstChild?.['classList']]
  expect(list).toMatchSnapshot()
})

test('4. leaves dynamic variables', () => {
  const {
    test4: { renderer, Element },
  } = context
  const out = render(<Element />)
  const firstChild = out.container.firstChild!
  const classList = [...firstChild['classList']]
  expect(classList).toMatchSnapshot()
  const r = renderer.toJSON()
  expect(r).toMatchSnapshot()
})

test('5. spread conditional', () => {
  const { test5 } = context
  const out = test5.renderer.toJSON()
  expect(out).toMatchSnapshot()
})

test('6. spread ternary', () => {
  const { test6 } = context
  expect(test6.renderer.toJSON()).toMatchSnapshot()
  expect(test6.rendererFalse.toJSON()).toMatchSnapshot()
})

test('7. ternary + data-is', () => {
  const { test7 } = context
  const out = test7.renderer.toJSON()
  expect(out).toMatchSnapshot()
})

test('8. styleExpansions', () => {
  const { test8 } = context
  const out = test8.renderer.toJSON()
  expect(out).toMatchSnapshot()
  // TODO test constant folding
})

test('9. combines with classname', () => {
  const { test9 } = context
  const out = test9.renderer.toJSON()
  expect(out).toMatchSnapshot()
})

test('10. extracts Text', () => {
  const { test10 } = context
  const out = test10.renderer.toJSON()
  expect(out).toMatchSnapshot()
})

test('11. combines everything', () => {
  const {
    test11: { Element },
  } = context
  const out = render(<Element conditional={false} />)
  const firstChild = out.container.firstChild!
  const classList = [...firstChild['classList']]
  expect(classList).toMatchSnapshot()
})

test('12. ternary multiple on same key', () => {
  const { test12 } = context
  expect(test12.renderer.toJSON()).toMatchSnapshot()
})

// test('13. text with complex conditional and local vars', () => {
//   const { test13 } = context
//   // console.log('test13', test13.renderer!.toTree())
//   t.is(1, 1)
// })

test('14. extracts psuedo styles and evaluates constants', () => {
  const { test14 } = context
  const out = test14.renderer.toJSON()
  expect(out).toMatchSnapshot()
})

test('15. extracts spacer (complex expansion)', () => {
  const { test15 } = context
  const out = test15.renderer.toJSON()
  expect(out).toMatchSnapshot()
})

test('16. deopt when spreading multiple', () => {
  const { test16 } = context
  const out = test16.renderer.toJSON()
  expect(out).toMatchSnapshot()
})

async function extractStaticApp() {
  const compiler = webpack({
    context: specDir,
    mode: 'development',
    devtool: false,
    optimization: {
      minimize: false,
      concatenateModules: false,
      splitChunks: false,
    },
    entry: path.join(specDir, 'extract-specs.tsx'),
    output: {
      publicPath: '',
      libraryTarget: 'commonjs',
      filename: outFile,
      path: outDir,
    },
    externals: [externalizeModules],
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      mainFields: ['tsmain', 'browser', 'module', 'main'],
      alias: {
        'react-native': 'react-native-web',
      },
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
            },
            {
              loader: require.resolve('snackui-loader'),
              options: {
                evaluateImportsWhitelist: ['constants.js'],
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
        'process.env.SNACKUI_COMPILE_PROCESS': JSON.stringify(1),
      }),
    ],
  })

  await new Promise<void>((res) => {
    compiler.run((err, result) => {
      // console.log({ err })
      // console.log(result?.toString())
      res()
    })
  })
}
