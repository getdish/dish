import './_debug'

import anyTest, { TestInterface } from 'ava'

import { Auth, flushTestData } from '../src'

interface Context {}

const test = anyTest as TestInterface<Context>

test.beforeEach(async () => {
  await flushTestData()
})

test('Creating a user', async (t) => {
  const [status] = await Auth.register('test', 'password')
  t.is(status, 201)
})

test('Login a user', async (t) => {
  await Auth.register('test', 'password')
  const [status, user] = await Auth.login('test', 'password')
  t.is(status, 200)
  t.is(user.username, 'test')
  t.assert(Auth.jwt.length > 200)
  t.assert(!Auth.jwt.includes(' '))
})

test('Login a non-existent user', async (t) => {
  const [status] = await Auth.login('test', 'password')
  t.is(status, 401)
})
