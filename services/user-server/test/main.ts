import 'isomorphic-unfetch'

import {
  flushTestData,
  restaurantInsert,
  restaurantTagUpsert,
  restaurant_fixture,
  tagInsert,
  userFindOne,
  userUpdate,
} from '@dish/graph'
import { sleep } from '@o/async'
import Sendgrid from '@sendgrid/mail'
import anyTest, { TestInterface } from 'ava'
import sinon from 'sinon'

import app from '../src/app'

interface Context {}

const test = anyTest as TestInterface<Context>
let sandbox

const standard_password = 'password'
const PORT = 31013
const BASE = 'http://localhost:' + PORT

const login = async () => {
  const response = await fetch(BASE + '/auth/login', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin',
      password: standard_password,
    }),
  })
  const data = await response.json()
  return [response, data]
}

const setPassword = async (t, password) => {
  const token = 'abc'
  let user = await userFindOne({ username: 'admin' })
  user.password_reset_token = token
  user.password_reset_date = new Date()
  await userUpdate(user)
  const result = await fetch(BASE + '/auth/password-reset', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      password,
    }),
  }).then((res) => res)
  t.is(result.status, 201)
}

test.before(async () => {
  sandbox = sinon.createSandbox()
  await flushTestData()
  const server = await app()
  server.listen(PORT)
})

test.beforeEach(async (t) => {
  await setPassword(t, standard_password)
})

test.afterEach(async () => {
  sandbox.restore()
})

test('Admin login', async (t) => {
  const [{ status }] = await login()
  t.is(status, 200)
})

test('Authed request failure', async (t) => {
  const response = await fetch(BASE + '/user', {
    headers: { 'Content-Type': 'application/json', Authorization: 'bad' },
  })
  t.deepEqual(response.status, 401)
  t.deepEqual(response.statusText, 'Unauthorized')
})

test('Authed request success', async (t) => {
  const [response, data] = await login()
  const jwt = data.token
  const user = await fetch(BASE + '/user/admin', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: jwt,
    },
  }).then((res) => res.json())
  t.deepEqual(user.username, 'admin')
})

test('Forgot password existing', async (t) => {
  const sendgrid = sandbox.stub(Sendgrid, 'send')
  const result = await fetch(BASE + '/auth/forgot-password', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'admin',
    }),
  }).then((res) => res)
  const user = await userFindOne({ username: 'admin' })
  const email = sendgrid.getCall(0).args[0]
  t.is(email.to, 'team@dishapp.com')
  t.assert(user.password_reset_token.length > 10)
  t.assert(email.text.includes(user.password_reset_token))
  t.is(result.status, 204)
})

test('Forgot password non-existing', async (t) => {
  const sendgrid = sandbox.stub(Sendgrid, 'send')
  const result = await fetch(BASE + '/auth/forgot-password', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'none',
    }),
  }).then((res) => res)
  t.is(sendgrid.callCount, 0)
  t.is(result.status, 204)
})

test('Password reset', async (t) => {
  await setPassword(t, '123-good-token')
  const response = await fetch(BASE + '/auth/login', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin',
      password: '123-good-token',
    }),
  })
  t.is(response.status, 200)
  const data = await response.json()
  t.is(data.user.username, 'admin')
})

test('Password reset wrong token', async (t) => {
  const token = 'abc'
  let user = await userFindOne({ username: 'admin' })
  user.password_reset_token = token
  user.password_reset_date = new Date()
  await userUpdate(user)
  const result = await fetch(BASE + '/auth/password-reset', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: 'wrong',
      password: '123-wrong-token',
    }),
  }).then((res) => res)
  t.is(result.status, 401)
  const response = await fetch(BASE + '/auth/login', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin',
      password: '123-wrong-token',
    }),
  })
  t.is(await response.text(), '')
  t.is(response.status, 401)
})

test('Password reset out of date', async (t) => {
  const token = 'abc'
  let user = await userFindOne({ username: 'admin' })
  user.password_reset_token = token
  user.password_reset_date = new Date(1970)
  await userUpdate(user)
  const result = await fetch(BASE + '/auth/password-reset', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      password: '123',
    }),
  }).then((res) => res)
  t.is(result.status, 401)
  const response = await fetch(BASE + '/auth/login', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin',
      password: '123',
    }),
  })
  t.is(await response.text(), '')
  t.is(response.status, 401)
})

test('Review analyzer', async (t) => {
  const [restaurant] = await restaurantInsert([restaurant_fixture])
  const [tag] = await tagInsert([{ name: 'Test tag' }])
  await restaurantTagUpsert(restaurant.id, [{ tag_id: tag.id }])
  const [_response, data] = await login()
  const jwt = data.token
  const response = await fetch(BASE + '/review/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: jwt,
    },
    body: JSON.stringify({
      restaurant_id: restaurant.id,
      text: 'Test tag is amazing',
    }),
  })
  const text = await response.text()
  const analysis = JSON.parse(text)
  t.deepEqual(analysis.sentences, [
    {
      score: 0.9998608827590942,
      sentence: 'Test tag is amazing',
      tags: ['Test tag'],
    },
  ])
  t.is(analysis.tags[0].id, tag.id)
})
