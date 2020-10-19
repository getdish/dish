import 'isomorphic-unfetch'

import {
  flushTestData,
  restaurantInsert,
  restaurantTagUpsert,
  restaurant_fixture,
  tagInsert,
} from '@dish/graph'
import anyTest, { TestInterface } from 'ava'

import app from '../src/app'

interface Context {}

const test = anyTest as TestInterface<Context>

const PORT = 31013
const BASE = 'http://localhost:' + PORT

const login = async () => {
  const response = await fetch(BASE + '/auth/login', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin',
      password: 'password',
    }),
  })
  const data = await response.json()
  return [response, data]
}

test.before(async () => {
  await flushTestData()
  const server = await app()
  server.listen(PORT)
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
