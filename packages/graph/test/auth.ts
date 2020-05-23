import './_debug'

import anyTest, { TestInterface } from 'ava'

import { Auth, mutation, resolved, startLogging } from '../src'

interface Context {}

const test = anyTest as TestInterface<Context>

// startLogging()

test.beforeEach(async () => {
  await resolved(() => {
    return mutation.delete_user({
      where: {
        _or: [
          {
            username: {
              _ilike: 'tester',
            },
          },
          {
            username: {
              _eq: Math.random().toString(10),
            },
          },
        ],
      },
    })?.affected_rows
  })
})

test('Creating a user', async (t) => {
  const [status] = await Auth.register('tester', 'password')
  t.is(status, 201)
})

test('Login a user', async (t) => {
  await Auth.register('tester', 'password')
  const [status, user] = await Auth.login('tester', 'password')
  t.is(status, 200)
  t.is(user.username, 'tester')
  t.assert(Auth.jwt.length > 200)
  t.assert(!Auth.jwt.includes(' '))
})

test('Login a non-existent user', async (t) => {
  const [status] = await Auth.login('tester', 'password')
  t.is(status, 401)
})
