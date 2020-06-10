import '@dish/react-test-env/jsdom-register'

import { TestRenderer, act } from '@dish/react-test-env'
import anyTest, { TestInterface } from 'ava'
import React from 'react'

import * as Test from './spec/router-spec'

interface Context {}
const test = anyTest as TestInterface<Context>

test('creates a store and routes', async (t) => {
  const r = TestRenderer.create(<Test.RecoilStoreRouterTest1 />)
  const findCurPageName = () => r.root.findAllByProps({ id: 'curPageName' })[0]
  let node = findCurPageName()
  t.is(node.children[0], 'home')
  const [navigate] = r.root.findAllByProps({ id: 'navigate' })
  // click once
  act(() => {
    navigate.props.onClick()
  })
  node = findCurPageName()
  t.is(node.children[0], 'login')
  // click twice
  act(() => {
    navigate.props.onClick()
  })
  node = findCurPageName()
  t.is(node.children[0], 'user')
})
