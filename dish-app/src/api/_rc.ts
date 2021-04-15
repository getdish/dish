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
  console.log('redis error ', JSON.stringify(err))
})

const rg = promisify(redisClient.get).bind(redisClient)
export const redisGet = async (key: string) => {
  if (redisClient.connected) {
    return await rg(key)
  }
  return null
}
