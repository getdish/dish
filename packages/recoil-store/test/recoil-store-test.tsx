import { TestRenderer, act } from '@dish/react-test-env'
import anyTest, { TestInterface } from 'ava'
import React from 'react'

import * as Test from './spec/simple-store'

interface Context {}
const test = anyTest as TestInterface<Context>

test('creates a simple store and action works', async (t) => {
  const r = TestRenderer.create(<Test.SimpleStoreTest />)
  const findX = () => {
    let [x] = r.root.findAllByProps({ id: 'x' })
    return x
  }

  let x = findX()
  t.is(x.children[0], '0')
  const [add] = r.root.findAllByProps({ id: 'add' })

  act(() => {
    add.props.onClick()
  })

  x = findX()
  // t.is(x.children[0], '1')
})
