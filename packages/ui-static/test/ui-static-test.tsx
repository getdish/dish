import '@dish/react-test-env/jsdom-register'

import path from 'path'

import { TestRenderer, act, render, screen } from '@dish/react-test-env'
import anyTest, { TestInterface } from 'ava'
import React from 'react'
// import { ViewStyle } from 'react-native'
import webpack from 'webpack'

import { GlossWebpackPlugin, getStylesAtomic } from '../src'

const mode = 'production'
process.env.NODE_ENV = mode

type TestApp = {
  renderer: TestRenderer.ReactTestRenderer
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
      const AppElement = <App />
      const tree = TestRenderer.create(AppElement)
      t.context[key.toLowerCase()] = {
        Element: AppElement,
        renderer: tree,
      }
    })
  }
})

test('converts a style object to class names', async (t) => {
  const style = {
    backgroundColor: 'red',
    transform: [{ rotateY: '10deg' }],
  }
  const styles = getStylesAtomic(style)
  const style1 = styles.find((x) => x.identifier === 'r-1g6456j')
  const style2 = styles.find((x) => x.identifier === 'r-188uu3c')
  t.assert(!!style1)
  t.assert(!!style2)
  t.is(style1!.value, 'rgba(255,0,0,1.00)')
  t.is(style1!.property, 'backgroundColor')
  t.deepEqual(style1!.rules, [
    '.r-1g6456j{background-color:rgba(255,0,0,1.00);}',
  ])
  t.deepEqual(style2!.rules, [
    '.r-188uu3c{-webkit-transform:rotateY(10deg);transform:rotateY(10deg);}',
  ])
})

test('1. extracts to a div for simple views', async (t) => {
  const { test1 } = t.context
  const out = test1.renderer.toTree()!
  t.is(out.rendered!.type, 'div')
  t.is(out.rendered!.props.className, 'r-1g6456j r-18c69zk r-13awgt0 r-eqz5dr')
})

test('2. extracts className for complex views but keeps other props', async (t) => {
  const { test2 } = t.context
  const out = test2.renderer.toTree()!
  t.is(out.rendered!.nodeType, 'component')
  t.is(out.rendered!.props.className, 'who r-1udh08x')
  const type = (out.rendered!.type as any) as Function
  t.assert(type instanceof Function)
  t.is(type.name, 'Box')
  t.assert(!out.rendered!.props.overflow)
})

test('3. places className correctly given a single spread', async (t) => {
  const { test3 } = t.context
  const out = render(test3.Element)
  const list = [...out.container.firstChild?.['classList']]
  t.assert(list.includes('r-1udh08x'))
})

test('4. leaves dynamic variables', async (t) => {
  const { test4 } = t.context
  const out = render(test4.Element)
  const firstChild = out.container.firstChild!
  const classList = [...firstChild['classList']]
  t.deepEqual(classList, ['css-1dbjc4n', 'r-4d76ec'])
  const r = test4.renderer.toJSON()
  t.is(r.props.style.width, 'calc(100% + 20px)')
})

test.skip('5. spread', async (t) => {
  const { test5 } = t.context
  const out = test5.renderer.toTree()!
  // t.is(out.props.className, 'r-4d76ec')
  // t.is(out.props.width, 'calc(100% + 12px)')
})

test.skip('6. spread ternary', async (t) => {
  const { test6 } = t.context
  const out = test6.renderer.toTree()
  // t.is(out!.props.className, 'r-4d76ec')
  // t.is(out!.props.width, 'calc(100% + 12px)')
})

test('7. ternary + data-is', async (t) => {
  const { test7 } = t.context
  const out = test7.renderer.toTree()
  const { children, ...outerProps } = out!.rendered!.props
  t.deepEqual(outerProps, {
    className: 'r-eqz5dr r-f2w40 r-68jxh1 r-1mi0q7o r-1qfz7tf r-1skwq7n',
    ['data-is']: 'VStack',
  })
  const [inner] = out.rendered!.rendered! as any
  t.is(inner.props.className, `r-eqz5dr r-1or9b2r r-5soawk`)
})

test('8. styleExpansions', async (t) => {
  const { test8 } = t.context
  const out = test8.renderer.toTree()!
  t.is(
    out.rendered!.props.className,
    'r-1p0dtai r-1d2f490 r-bnwqim r-zchlnj r-ipm5af'
  )
})

test('9. combines with classname', async (t) => {
  const { test9 } = t.context
  const out = test9.renderer.toTree()!
  t.is(out.rendered!.props.className, 'home-top-dish r-eqz5dr r-9qu9m4')
})

test('10. extracts Text', async (t) => {
  const { test10 } = t.context
  const out = test10.renderer.toTree()!
  t.is(out.rendered!.type, 'span')
  t.is(out.rendered!.props['data-is'], 'Text')
  t.is(out.rendered!.props.className, 'r-10x49cs')
})

test('11. combines everything', async (t) => {
  const { test11 } = t.context
  const out = render(test11.Element)
  const firstChild = out.container.firstChild!
  const classList = [...firstChild['classList']]
  t.deepEqual(classList, [
    'css-1dbjc4n',
    'r-1awozwy',
    'r-57dg7b',
    'r-brgb1',
    'r-rs99b7',
    'r-yfq7p9',
    'r-1udh08x',
    'r-bnwqim',
  ])
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
