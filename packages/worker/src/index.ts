import Queue, { QueueOptions, JobOptions } from 'bull'

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

  async run(fn: string, args?: any) {
    if (this[fn].constructor.name === 'AsyncFunction') {
      await this[fn](args)
    } else {
      this[fn](args)
    }
  }

  async run_on_worker(fn: string, args?: any) {
    const queue = new Queue(this.constructor.name, { redis: redisOptions })
    const job: JobData = {
      className: this.constructor.name,
      fn: fn,
      args: args,
    }
    const config = (this.constructor as typeof WorkerJob).job_config
    console.log(`Adding job to worker (${this.constructor.name}):`, job)
    await queue.add(job, config)
  }
}
