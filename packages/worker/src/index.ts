import dotenv from 'dotenv'
dotenv.config()

import './utils.js'
import _ from 'lodash'

import { Consumer, Producer } from 'orkid'

const QUEUE_NAME = 'crawler'

const is_local_redis =
  process.env.DISH_ENV == 'development' || process.env.CI == 'true'

const redisOptions = {
  port: 6379,
  host: is_local_redis ? 'localhost' : 'redis',
}

type Job = {
  className: string
  args: any
}

export class WorkerJob {
  async run(args?: any): Promise<any> {
    console.error('run() not implemented')
    console.debug(args)
    return false
  }

  async run_on_worker(args?: any) {
    const producer = new Producer(QUEUE_NAME, {
      redisOptions,
    })

    const task_name = this.constructor.name
    const job = {
      className: task_name,
      args: args,
    } as any
    console.log('Adding job to worker:', job)
    await producer.addTask(job)
  }
}

export class WorkerDaemon {
  jobs!: { [key: string]: { new (): WorkerJob } }
  consumer!: Consumer
  runConsumerRateLimited: (job: Job, metadata: any) => {}

  constructor(job_modules: { new (): WorkerJob }[]) {
    this.setupJobs(job_modules)
    this.runConsumerRateLimited = _.rateLimit(this.runConsumer, 1000)
    this.setupConsumer()
  }

  run() {
    this.consumer.start()
  }

  setupJobs(job_modules: { new (): WorkerJob }[]) {
    this.jobs = {}
    for (let Job of job_modules) {
      this.jobs[Job.prototype.constructor.name] = Job
    }
    console.log(
      'Worker daemon starting with the following worker code: ',
      this.jobs
    )
  }

  setupConsumer() {
    this.consumer = new Consumer(
      QUEUE_NAME,
      this.runConsumerRateLimited.bind(this),
      {
        redisOptions,
        consumerOptions: {
          concurrencyPerInstance: 1,
          maxRetry: 1,
          workerFnTimeoutMs: 3000,
        },
      }
    )
  }

  async runConsumer(job: Job, metadata: any) {
    console.log(`Job ID: ${metadata.id}`, job, metadata)
    await new this.jobs[job.className]().run(job.args)
  }
}
