import '@dish/react-test-env/jsdom-register'

import { TestRenderer, act } from '@dish/react-test-env'
import anyTest, { ExecutionContext, TestInterface } from 'ava'
import React from 'react'

import * as Test from './spec/simple-store'

Error.stackTraceLimit = Infinity

interface Context {}
const test = anyTest as TestInterface<Context>

async function testSimpleStore(
  t: ExecutionContext<Context>,
  r: TestRenderer.ReactTestRenderer
) {
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
}

// be sure ids are not same across tests...

test('creates a simple store and action works', async (t) => {
  const r = TestRenderer.create(<Test.SimpleStoreTest id={0} />)
  await testSimpleStore(t, r)
})

test('creates a second store under diff namespace both work', async (t) => {
  const r = TestRenderer.create(<Test.SimpleStoreTest id={1} />)
  await testSimpleStore(t, r)
  const r2 = TestRenderer.create(<Test.SimpleStoreTest id={2} />)
  await testSimpleStore(t, r2)
})

test('properly updates get values', async (t) => {
  const r = TestRenderer.create(<Test.SimpleStoreTest id={3} />)
  const findY = () => r.root.findAllByProps({ id: 'y' })[0]
  let node = findY()
  t.is(node.children[0], '0')
  const [add] = r.root.findAllByProps({ id: 'add' })
  // click once
  act(() => {
    add.props.onClick()
  })
  node = findY()
  t.is(node.children[0], '1')
})
