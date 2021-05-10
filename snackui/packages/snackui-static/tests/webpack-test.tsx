import '@dish/react-test-env/browser'
import '@expo/match-media'

import { TestRenderer, act, render } from '@dish/testy'
import React from 'react'

const app = require('./spec/out/out-webpack')

let context: any = {}

beforeAll(async () => {
  await Promise.all([
    Object.keys(app).map((key) => {
      return act(() => {
        const App = app[key]
        context[key.toLowerCase()] = {
          Element: App,
          renderer: TestRenderer.create(<App conditional={true} />),
          rendererFalse: TestRenderer.create(<App conditional={false} />),
        }
      })
    }),
  ])
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

test('1. extracts to a div for simple views, flat transforms', () => {
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
