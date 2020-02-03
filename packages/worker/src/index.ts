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

  async getQueue() {
    if (typeof this.queue != 'undefined') {
      return
    }
    this.queue = new BullQueue(this.constructor.name, {
      redis: redisOptions,
    })
    await waitForBull(this.queue)
  }

  async run(fn: string, args?: any) {
    if (this[fn].constructor.name === 'AsyncFunction') {
      await this[fn](args)
    } else {
      this[fn](args)
    }
  }

  async run_on_worker(fn: string, args?: any) {
    const job: JobData = {
      className: this.constructor.name,
      fn: fn,
      args: args,
    }
    await this.getQueue()
    const config = (this.constructor as typeof WorkerJob).job_config
    console.log(`Adding job to worker (${this.constructor.name}):`, job)
    await this.queue.add(job, config)
  }
}

// There's a curious issue on Kubernetes where the crawler and worker pods
// get refused a connection to Redis during their startups. So here we just
// wait until we're allowed to connect. I don't know why the connection is
// refused as the Redis server never gets rebooted during normal deploys.
export async function waitForBull(queue: Queue) {
  let count = 0
  const max_tries = 30
  while (true) {
    try {
      await queue.isReady()
      break
    } catch (e) {
      console.warn('Trying to startup up Bull queue again...')
      if (++count == max_tries) throw e
      if (e.message.includes('ECONNREFUSED')) {
        await new Promise(r => setTimeout(r, 1000))
      } else {
        throw e
      }
    }
  }
}
