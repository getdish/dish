import { promisify } from 'util'

import redis from 'redis'

const pass = process.env.REDIS_PASSWORD
const host = process.env.REDIS_HOST || 'redis'
const port = process.env.REDIS_PORT || 6379
const url = `redis://${pass ? `:${pass}:` : ''}${host}:${port}`

export const redisClient = redis.createClient({
  url,
})

let isDown = false
redisClient.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    if (!isDown) {
      console.warn('⚠️ Redis not up, cache disabled')
      isDown = true
    }
  } else {
    console.log('Redis error:', err)
  }
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
    return
  }
  await redisDelete_(keys)
}
