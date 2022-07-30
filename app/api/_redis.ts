import Redis from 'ioredis'

const pass = process.env.REDIS_PASSWORD
const host = process.env.REDIS_HOST || 'redis'
const port = process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379

export const redisClient = new Redis(port, host, {
  password: pass,
  autoResubscribe: true,
})

let connected = false
redisClient.on('connect', () => {
  connected = true
})
redisClient.on('close', () => {
  connected = false
})

export const isRedisConnected = () => connected

let isDown = false
redisClient.on('error', (err) => {
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    if (!isDown) {
      console.warn(`⚠️ Redis not up on ${host}:${port} no caching`)
      isDown = true
    }
  } else {
    console.log('Redis error:', err.message)
  }
})

export const redisGet = async (key: string) => {
  if (redisClient) {
    return await redisClient.get(key)
  }
  return null
}

export const redisSet = async (key: string, value: string) => {
  if (connected) {
    return await redisClient.set(key, value)
  }
  console.error('not connected')
  return null
}

export const redisDeletePattern = async (pattern: string) => {
  const keys: string[] = await redisClient.keys(pattern)
  if (!keys.length) {
    return
  }
  const pipeline = redisClient.pipeline()
  for (const key of keys) {
    await redisClient.del(key)
  }
  await pipeline.exec()
}

export function dispose() {
  redisClient.removeAllListeners()
}
