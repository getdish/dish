import anyTest, { TestInterface } from 'ava'

import { Auth, mutation, resolved } from '../src/index'

interface Context {}

const test = anyTest as TestInterface<Context>

test.beforeEach(async () => {
  const res = await resolved(() => {
    const { affected_rows, returning } = mutation.delete_user({
      where: {
        username: {
          _ilike: 'tester',
        },
      },
    })
    return { affected_rows, returning }
  })

  console.log(res)
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
