import 'isomorphic-unfetch'

import anyTest, { TestInterface } from 'ava'

import app from '../src/app'

interface Context {}

const test = anyTest as TestInterface<Context>

const PORT = 31013
const BASE = 'http://localhost:' + PORT

const login = async () => {
  const response = await fetch(BASE + '/auth/login', {
    method: 'post',
    body: JSON.stringify({
      username: 'admin',
      password: 'password',
    }),
  })
  const data = await response.json()
  return [response, data]
}

test.before(async () => {
  const server = await app()
  server.listen(PORT)
})

test('Admin login', async (t) => {
  const [{ status }] = await login()
  t.is(status, 200)
})

test('Authed request failure', async (t) => {
  const response = await fetch(BASE + '/user', {
    headers: { Auth: 'bad' },
  })
  const data = await response.json()
  t.deepEqual(response.status, 401)
  t.deepEqual(data, '')
})

test('Authed request success', async (t) => {
  const [response, data] = await login()
  const jwt = data.token
  const user = await fetch(BASE + '/user/admin', {
    headers: { Auth: jwt },
  }).then((res) => res.json())
  t.deepEqual(user.data.username, 'admin')
})
