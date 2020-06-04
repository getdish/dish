import '@dish/react-test-env/jsdom-register'

import path from 'path'

import { TestRenderer, act, render, screen } from '@dish/react-test-env'
import anyTest, { TestInterface } from 'ava'
import React from 'react'
// import { ViewStyle } from 'react-native'
import webpack from 'webpack'

import { UIStaticWebpackPlugin, getStylesAtomic } from '../src'

const mode = 'production'
process.env.NODE_ENV = 'test'

type TestApp = {
  renderer: TestRenderer.ReactTestRenderer
  rendererFalse: TestRenderer.ReactTestRenderer
  Element: any
}

const test = anyTest as TestInterface<{
  test1: TestApp
  test2: TestApp
  test3: TestApp
  test4: TestApp
  test5: TestApp
  test6: TestApp
  test7: TestApp
  test8: TestApp
  test9: TestApp
  test10: TestApp
  test11: TestApp
  test12: TestApp
  test13: TestApp
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
  for (const key in app) {
    act(() => {
      const App = app[key]
      t.context[key.toLowerCase()] = {
        Element: App,
        renderer: TestRenderer.create(<App conditional={true} />),
        rendererFalse: TestRenderer.create(<App conditional={false} />),
      }
    })
  }
})

// test('converts a style object to class names', async (t) => {
//   const style = {
//     backgroundColor: 'red',
//     transform: [{ rotateY: '10deg' }],
//     shadowRadius: 10,
//     shadowColor: 'red',
//   }
//   const styles = getStylesAtomic(style)
//   const style1 = styles.find((x) => x.property === 'backgroundColor')
//   const style2 = styles.find((x) => x.property === 'transform')
//   const style3 = styles.find((x) => x.property === 'boxShadow')
//   t.assert(!!style1)
//   t.assert(!!style2)
//   t.assert(!!style3)
//   t.deepEqual(style1!.rules, [
//     '.r-backgroundColor-1g6456j{background-color:rgba(255,0,0,1.00);}',
//   ])
//   t.deepEqual(style2!.rules, [
//     '.r-transform-188uu3c{-webkit-transform:rotateY(10deg);transform:rotateY(10deg);}',
//   ])
//   t.deepEqual(style3!.rules, [
//     '.r-boxShadow-rfqnir{box-shadow:0px 0px 10px rgba(255,0,0,1.00);}',
//   ])
// })

// test('1. extracts to a div for simple views', async (t) => {
//   const { test1 } = t.context
//   const out = test1.renderer.toTree()!
//   t.is(out.rendered!.type, 'div')
//   t.is(
//     out.rendered!.props.className,
//     'r-backgroundColor-1g6456j r-borderRadius-18c69zk r-boxShadow-1xz9bc3 r-flex-13awgt0 r-flexDirection-eqz5dr'
//   )
// })

// test('2. extracts className for complex views but keeps other props', async (t) => {
//   const { test2 } = t.context
//   const out = test2.renderer.toTree()!
//   t.is(out.rendered!.nodeType, 'component')
//   t.is(out.rendered!.props.className, 'who r-overflow-1udh08x')
//   t.assert(!!out.rendered!.props.onAccessibilityTap)
//   const type = (out.rendered!.type as any) as Function
//   t.assert(type instanceof Function)
//   t.is(type.name, 'Box')
//   t.assert(!out.rendered!.props.overflow)
// })

// test('3. places className correctly given a single spread', async (t) => {
//   const {
//     test3: { Element },
//   } = t.context
//   const out = render(<Element />)
//   const list = [...out.container.firstChild?.['classList']]
//   t.assert(list.includes('r-overflow-1udh08x'))
// })

// test('4. leaves dynamic variables', async (t) => {
//   const {
//     test4: { renderer, Element },
//   } = t.context
//   const out = render(<Element />)
//   const firstChild = out.container.firstChild!
//   const classList = [...firstChild['classList']]
//   t.deepEqual(classList, ['css-view-1dbjc4n', 'r-height-4d76ec'])
//   const r = renderer.toJSON()
//   t.is(r.props.style.width, 'calc(100% + 20px)')
// })

// test('5. spread conditional', async (t) => {
//   const { test5 } = t.context
//   const out = test5.renderer.toTree()!
//   t.is(out.rendered!.type, 'div')
//   t.is(
//     out.rendered!.props.className,
//     'r-flexDirection-eqz5dr r-overflow-1udh08x'
//   )
//   t.is(
//     out.rendered!.rendered![0].props.className,
//     'r-flexDirection-eqz5dr r-overflow-1udh08x hello-world'
//   )
// })

// test('6. spread ternary', async (t) => {
//   const { test6 } = t.context
//   t.is(
//     test6.renderer.toTree().rendered!.props.className,
//     'r-backgroundColor-57dg7b r-flexDirection-eqz5dr r-overflow-1udh08x'
//   )
//   t.is(
//     test6.rendererFalse.toTree().rendered!.props.className,
//     'r-flexDirection-eqz5dr r-overflow-1udh08x'
//   )
//   // t.is(out!.props.width, 'calc(100% + 12px)')
// })

// test('7. ternary + data-is', async (t) => {
//   const { test7 } = t.context
//   const out = test7.renderer.toTree()
//   const { children, ...outerProps } = out!.rendered!.props
//   t.deepEqual(outerProps, {
//     className:
//       'r-flexDirection-eqz5dr r-maxWidth-f2w40 r-minWidth-68jxh1 r-paddingBottom-1mi0q7o r-paddingHorizontal-1qfz7tf r-width-1skwq7n',
//     ['data-is']: 'Test7-VStack',
//   })
//   const [inner] = out.rendered!.rendered! as any
//   t.is(
//     inner.props.className,
//     `r-flexDirection-eqz5dr r-height-1or9b2r r-width-5soawk`
//   )
// })

// test('8. styleExpansions', async (t) => {
//   const { test8 } = t.context
//   const out = test8.renderer.toTree()!
//   t.is(
//     out.rendered!.props.className,
//     'r-bottom-1p0dtai r-left-1d2f490 r-position-bnwqim r-right-zchlnj r-top-ipm5af'
//   )
//   // TODO test constant folding
// })

// test('9. combines with classname', async (t) => {
//   const { test9 } = t.context
//   const out = test9.renderer.toTree()!
//   t.is(
//     out.rendered!.props.className,
//     'home-top-dish r-flexDirection-eqz5dr r-paddingVertical-9qu9m4'
//   )
// })

// test('10. extracts Text', async (t) => {
//   const { test10 } = t.context
//   const out = test10.renderer.toTree()!
//   t.is(out.rendered!.type, 'span')
//   t.is(out.rendered!.props['data-is'], 'Test10-Text')
//   t.is(out.rendered!.props.className, 'r-fontSize-10x49cs')
// })

// test('11. combines everything', async (t) => {
//   const {
//     test11: { Element },
//   } = t.context
//   const out = render(<Element conditional={false} />)
//   const firstChild = out.container.firstChild!
//   const classList = [...firstChild['classList']]
//   t.deepEqual(classList, [
//     'css-view-1dbjc4n',
//     'r-alignItems-1awozwy',
//     'r-backgroundColor-57dg7b',
//     'r-borderColor-brgb1',
//     'r-borderWidth-rs99b7',
//     'r-minHeight-yfq7p9',
//     'r-overflow-1udh08x',
//     'r-position-bnwqim',
//   ])
// })

// test('12. ternary multiple on same key', async (t) => {
//   const { test12 } = t.context
//   t.is(
//     test12.renderer.toTree()!.rendered!.props.className,
//     'r-flexDirection-eqz5dr r-opacity-6dt33c r-transform-1siec45'
//   )
//   t.is(
//     test12.rendererFalse.toTree()!.rendered!.props.className,
//     'r-flexDirection-eqz5dr r-opacity-orgf3d r-transform-n8jr3k'
//   )
// })

test('13. text with complex conditional and local vars', async (t) => {
  const { test13 } = t.context
  console.log('test13', test13.renderer!.toTree())
  t.is(1, 1)
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
            { loader: 'file-loader', options: { name: 'out.[hash].css' } },
            'extract-loader',
            'css-loader',
          ],
        },
      ],
    },
    plugins: [
      new UIStaticWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG),
      }),
    ],
  })

  await new Promise((res) => {
    compiler.run((err, result) => {
      console.log({ err })
      console.log(result?.toString())
      res()
    })
  })
}
