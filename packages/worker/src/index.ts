import BullQueue, { Queue, QueueOptions, JobOptions } from 'bull'

const is_local_redis =
  process.env.DISH_ENV == 'development' || process.env.CI == 'true'

export const redisOptions = {
  port: 6379,
  host: is_local_redis ? 'localhost' : process.env.REDIS_HOST,
}

export type JobData = {
  className: string
  fn: string
  args?: any
}

export class WorkerJob {
  static queue_config: QueueOptions = {}
  static job_config: JobOptions = {}
  queue!: Queue

  async run(fn: string, args: any[] = []) {
    if (this[fn].constructor.name === 'AsyncFunction') {
      await this[fn](...args)
    } else {
      this[fn](...args)
    }
  }

  async runOnWorker(fn: string, args?: any[]) {
    if (process.env.RUN_WITHOUT_WORKER == 'true') {
      return await this.run(fn, args)
    }
    const job: JobData = {
      className: this.constructor.name,
      fn: fn,
      args: args,
    }
    const queue = await getBullQueue(this.constructor.name)
    const config = (this.constructor as typeof WorkerJob).job_config
    console.log(`Adding job to worker (${this.constructor.name}):`, job)
    queue.add(job, config)
    queue.close()
  }
}

// There's a curious issue on Kubernetes where the crawler and worker pods
// get refused a connection to Redis during their startups. So here we just
// wait until we're allowed to connect. I don't know why the connection is
// refused as the Redis server never gets rebooted during normal deploys.
export async function getBullQueue(name: string, config: {} = {}) {
  let count = 0
  const max_tries = 300
  let queue: Queue
  while (true) {
    queue = new BullQueue(name, {
      ...config,
      redis: redisOptions,
    })
    try {
      await queue.isReady()
      break
    } catch (e) {
      queue.close()
      console.warn('Trying to startup up Bull queue again...')
      if (++count == max_tries) throw e
      if (e.message.includes('ECONNREFUSED')) {
        await new Promise(r => setTimeout(r, 2000))
      } else {
        throw e
      }
    }
  }
  return queue
}
