import '@dish/react-test-env/jsdom-register'

import { TestRenderer, act } from '@dish/react-test-env'
import anyTest, { TestInterface } from 'ava'
import React from 'react'

import * as Test from './spec/simple-store'

interface Context {}
const test = anyTest as TestInterface<Context>

test('creates a simple store and action works', async (t) => {
  const r = TestRenderer.create(<Test.SimpleStoreTest />)
  const findX = () => r.root.findAllByProps({ id: 'x' })[0]
  let node = findX()
  t.is(node.children[0], 'hi')
  const [add] = r.root.findAllByProps({ id: 'add' })
  // click once
  act(() => {
    add.props.onClick()
  })
  node = findX()
  t.is(node.children[0], 'item-1')
  // click twice
  act(() => {
    add.props.onClick()
  })
  node = findX()
  t.is(node.children[0], 'item-2')
  // async click
  const [addAsync] = r.root.findAllByProps({ id: 'add-async' })
  act(() => {
    addAsync.props.onClick()
  })
  node = findX()
  t.is(node.children[0], 'item-2')
  await new Promise((res) => setTimeout(res, 110))
  t.is(node.children[0], 'item-3')
})
