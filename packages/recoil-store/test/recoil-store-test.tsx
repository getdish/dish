import { TestRenderer } from '@dish/react-test-env'
import anyTest, { TestInterface } from 'ava'
import React from 'react'

import * as Test from './spec/simple-store'

interface Context {}
const test = anyTest as TestInterface<Context>

test('creates a simple store', async (t) => {
  const r = TestRenderer.create(<Test.SimpleStoreTest />)
  const [x] = r.root.findAllByProps({ id: 'x' })
  t.is(x.children[0], '0')
})
