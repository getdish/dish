import { sentryException } from '@dish/common'
import BullQueue, { EveryRepeatOptions, Job, JobOptions, Queue, QueueOptions } from 'bull'
import _ from 'lodash'

import { Loggable } from './Loggable'

export type JobData = {
  className: string
  fn: string
  args?: any
}

export class WorkerJob extends Loggable {
  static queue_config: QueueOptions = {}
  static job_config: JobOptions = {}
  queue!: Queue
  job!: Job
  run_all_on_main = false

  async run(fn: string, args: any[] = []) {
    if (this[fn].constructor.name === 'AsyncFunction') {
      await this[fn](...args)
    } else {
      this[fn](...args)
    }
  }

  async runOnWorker(fn: string, args?: any[], specific_config: JobOptions = {}) {
    if (this.run_all_on_main) {
      await this.run(fn, args)
      return
    }
    this.log('runOnWorker', fn)
    if (process.env.RUN_WITHOUT_WORKER == 'true') {
      return await this.run(fn, args)
    }
    const job: JobData = {
      className: this.constructor.name,
      fn,
      args,
    }
    const queue = getBullQueue(this.constructor.name)
    const default_config = (this.constructor as typeof WorkerJob).job_config
    const config = { ...default_config, ...specific_config }
    if ('repeat' in config) {
      await this.manageRepeatable(queue, job, config)
    } else {
      await this.addJob(queue, job, config)
    }
    await queue.close()
  }

  async _runFailableFunction(func: Function) {
    this.resetTimer()
    let result = 'success'
    try {
      if (func.constructor.name == 'AsyncFunction') {
        await func.bind(this)()
      } else {
        func.bind(this)()
      }
    } catch (e) {
      result = 'failed'
      console.log('ERROR WorkerJob\n\n', e.message, e.stack, '\n\n')
      sentryException(e, {
        data: { function: func.name, restaurant: this.logName },
        tags: { source: `${this.constructor.name} job` },
        logger: this.log,
      })
    }
    this.log(`${func.name} | ${result}`)
  }

  private async addJob(
    queue: Queue,
    job: JobData,
    config: JobOptions,
    repeatable: boolean = false
  ) {
    if (repeatable) {
      let run_now = _.cloneDeep(config)
      delete run_now.repeat
      this.log(`Adding instant run of repeatable job ...`)
      await this.addJob(queue, job, run_now)
    }
    this.log(`Adding job to worker (${this.constructor.name}):`, job, config)
    await queue.add(job, config)
  }

  private async manageRepeatable(queue: Queue, job: JobData, config: JobOptions) {
    const repeats = await queue.getRepeatableJobs()
    const existing = repeats.find((job) => job.id == config.jobId)
    if (!existing) {
      await this.addJob(queue, job, config, true)
    } else {
      if (existing.every != (config?.repeat as EveryRepeatOptions).every) {
        this.log('Removing job for update: ', existing)
        await queue.removeRepeatableByKey(existing.key)
        await this.addJob(queue, job, config, true)
      } else {
        this.log('Repeating job already exists: ', job, config)
      }
    }
  }

  async addBigJob(fn: string, args: any[]) {
    const job_data: JobData = {
      className: this.constructor.name,
      fn,
      args,
    }
    if (process.env.RUN_WITHOUT_WORKER == 'true') {
      return await this.run(fn, args)
    }
    const queue = getBullQueue('BigJobs')
    console.log('Adding self crawl job', job_data)
    const job = await queue.add(job_data, { attempts: 1 })
    await queue.close()
    return job
  }
}

// const url = `redis://${host}:${port}`

// console.log('create client connecting to ', url)
// export const redisClient = require('redis').createClient({
//   url,
// })

// redisClient.on('error', (err) => {
//   console.log('redis error ', JSON.stringify(err))
// })

// const opts = redisOptions()
// console.log('redis options are', opts)
// const createRedis = () =>
//   new Redis(opts.port, opts.host, {
//     password: opts.password,
//     autoResubscribe: true,
//     autoResendUnfulfilledCommands: true,
//   })
// const redisClient = createRedis()
// const redisSubscriber = createRedis()

export function getBullQueue(name: string, config: {} = {}) {
  return new BullQueue(name, {
    limiter: {
      max: 5,
      duration: 1000,
    },
    ...config,
    redis: {
      host: process.env.REDIS_HOST || 'redis',
      port: +(process.env.REDIS_PORT || '6379'),
    },
  })
}

export async function onBullQueueReady(queue: Queue) {
  await queue.isReady()
}
