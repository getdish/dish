import { promisify } from 'util'

import redis from 'redis'

const pass = process.env.REDIS_PASSWORD
const envUrl = process.env.REDIS_URL
const url =
  envUrl ||
  `redis://${pass ? `:${pass}:` : ''}${process.env.REDIS_HOST || 'localhost'}:${
    process.env.REDIS_PORT || 6379
  }`

export const redisClient = redis.createClient({
  url,
})

redisClient.on('error', (err) => {
  console.log('redis error ', JSON.stringify(err))
})

const redisGet_ = promisify(redisClient.get).bind(redisClient)
const redisSet_ = promisify(redisClient.set).bind(redisClient)
const redisKeys_ = promisify(redisClient.keys).bind(redisClient)
const redisDelete_ = promisify(redisClient.del).bind(redisClient)

export const redisGet = async (key: string) => {
  if (redisClient.connected) {
    return await redisGet_(key)
  }
  return null
}

export const redisSet = async (key: string, value: string) => {
  if (redisClient.connected) {
    return await redisSet_(key, value)
  }
  return null
}

export const redisDeletePattern = async (pattern: string) => {
  const keys: string[] = await redisKeys_(pattern)
  if (!keys.length) {
    console.log('no keys')
    return
  }
  await redisDelete_(keys)
}
