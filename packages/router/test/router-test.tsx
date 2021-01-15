import '@dish/react-test-env/jsdom-register'

import { TestRenderer, act } from '@dish/react-test-env'
import { createStore } from '@dish/use-store'
import anyTest, { TestInterface } from 'ava'
import React from 'react'

import { Route, Router } from '../_'
import * as Test from './spec/router-spec'

interface Context {}
const test = anyTest as TestInterface<Context>

test('creates a store and routes', async (t) => {
  const r = TestRenderer.create(<Test.RecoilStoreRouterTest1 />)
  const findCurPageName = () =>
    r.root.findAllByProps({ id: 'curPageName' })[0].children[0]
  const [navigate] = r.root.findAllByProps({ id: 'navigate' })

  t.is(findCurPageName(), 'home')
  act(() => {
    navigate.props.onClick()
  })
  t.is(findCurPageName(), 'login')
  act(() => {
    navigate.props.onClick()
  })
  t.is(findCurPageName(), 'user')
  t.is(
    r.root.findAllByProps({ id: 'curPageParams' })[0].children[0],
    '{"username":"test","pane":"pane"}'
  )
})

test('stack is managed correctly', async (t) => {
  const routes = {
    home: new Route('/'),
    user: new Route<{ id: string }>('/user/:id'),
  }
  const store = createStore(Router, { routes: routes, skipInitial: true })
  store.navigate({ name: 'home' }) // 0
  t.is(store.curPage.name, 'home')
  t.is(store.stack.length, 1)
  store.navigate({ name: 'user', params: { id: '0' } }) // 1
  t.is(store.curPage.name, 'user')
  store.back() // 0
  t.is(store.curPage.name, 'home')
  t.is(store.stackIndex, 0)
  store.navigate({ name: 'user', params: { id: '1' } }) // 1
  t.is(store.curPage.name, 'user')
  t.deepEqual(store.curPage.params, { id: '1' })
  t.is(store.stackIndex, 1)
  store.back()
  t.is(store.curPage.name, 'home')
  t.is(store.stackIndex, 0)
})
