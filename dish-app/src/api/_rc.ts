import { promisify } from 'util'

import redis from 'redis'

const pass = process.env.REDIS_PASSWORD
const envUrl = process.env.REDIS_URL
const url =
  envUrl || `redis://${pass ? `:${pass}:` : ''}${process.env.REDIS_HOST || 'localhost'}:6379`

export const redisClient = redis.createClient({
  url,
})
redisClient.on('error', (err) => {
  console.log('redis ', JSON.stringify(err))
})

export const redisGet = promisify(redisClient.get).bind(redisClient)
