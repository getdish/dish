import anyTest, { TestInterface } from 'ava'
import axios from 'axios'

import app from '../src/app'

interface Context {}

const test = anyTest as TestInterface<Context>

const PORT = 31013
const BASE = 'http://localhost:' + PORT

const login = async () => {
  return await axios.post(BASE + '/auth/login', {
    username: 'admin',
    password: 'password',
  })
}

test.before(async () => {
  const server = await app()
  server.listen(PORT)
})

test('Admin login', async t => {
  const response = await login()
  t.is(response.status, 200)
})

test('Authed request failure', async t => {
  const response = await axios.get(BASE + '/user', {
    headers: { Auth: 'bad' },
    validateStatus: () => {
      return true
    },
  })
  t.deepEqual(response.status, 401)
  t.deepEqual(response.data, '')
})

test('Authed request success', async t => {
  const response = await login()
  const jwt = response.data
  const user = await axios.get(BASE + '/user/admin', {
    headers: { Auth: jwt },
  })
  t.deepEqual(user.data.username, 'admin')
})
