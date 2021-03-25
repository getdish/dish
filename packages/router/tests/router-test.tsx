import '@dish/react-test-env/browser'

import { TestRenderer, act } from '@dish/react-test-env'
import { createStore } from '@dish/use-store'
import React from 'react'

import { Route, Router } from '../src'
import * as Test from './spec/router-spec'

test('creates a store and routes', () => {
  let r: TestRenderer.ReactTestRenderer
  act(() => {
    r = TestRenderer.create(<Test.RecoilStoreRouterTest1 />)
  })
  const findCurPageName = () => r.root.findAllByProps({ id: 'curPageName' })[0].children[0]
  const [navigate] = r.root.findAllByProps({ id: 'navigate' })
  expect(findCurPageName()).toBe('home')
  act(() => {
    navigate.props.onClick()
  })
  expect(findCurPageName()).toBe('login')
  act(() => {
    navigate.props.onClick()
  })
  expect(findCurPageName()).toBe('user')
  expect(r.root.findAllByProps({ id: 'curPageParams' })[0].children[0]).toBe(
    '{"username":"test","pane":"pane"}'
  )
})

test('stack is managed correctly', () => {
  act(() => {
    const routes = {
      home: new Route('/'),
      user: new Route<{ id: string }>('/user/:id'),
    }
    const store = createStore(Router, { routes: routes, skipInitial: true })
    store.navigate({ name: 'home' }) // 0
    expect(store.curPage.name).toBe('home')
    expect(store.stack.length).toBe(1)
    store.navigate({ name: 'user', params: { id: '0' } }) // 1
    expect(store.curPage.name).toBe('user')
    store.back() // 0
    expect(store.curPage.name).toBe('home')
    expect(store.stackIndex).toBe(0)
    store.navigate({ name: 'user', params: { id: '1' } }) // 1
    expect(store.curPage.name).toBe('user')
    expect(store.curPage.params).toEqual({ id: '1' })
    expect(store.stackIndex).toBe(1)
    store.back()
    expect(store.curPage.name).toBe('home')
    expect(store.stackIndex).toBe(0)
  })
})
