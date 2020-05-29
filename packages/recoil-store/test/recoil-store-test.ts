import './_debug'

import anyTest, { TestInterface } from 'ava'

interface Context {}

const test = anyTest as TestInterface<Context>

test('creates a store', async (t) => {
  t.is(1, 1)
})
