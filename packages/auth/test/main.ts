import { mutation, resolved } from '@dish/graph'
import anyTest, { TestInterface } from 'ava'

import auth from '../src/index'

interface Context {}

const test = anyTest as TestInterface<Context>

test.beforeEach(async () => {
  await resolved(() => {
    mutation.delete_user({
      where: {
        username: {
          _ilike: 'tester',
        },
      },
    })
  })
})

test('Creating a user', async (t) => {
  const [status] = await auth.register('tester', 'password')
  t.is(status, 201)
})

test('Login a user', async (t) => {
  await auth.register('tester', 'password')
  const [status, user] = await auth.login('tester', 'password')
  t.is(status, 200)
  t.is(user.username, 'tester')
  t.assert(auth.jwt.length > 200)
  t.assert(!auth.jwt.includes(' '))
})

test('Login a non-existent user', async (t) => {
  const [status] = await auth.login('tester', 'password')
  t.is(status, 401)
})
