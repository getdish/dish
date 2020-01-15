import dotenv from 'dotenv'
dotenv.config()

import { Consumer, Producer } from 'orkid'

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
    const producer = new Producer('consumer', {
      redisOptions,
    })

    const task_name = this.constructor.name
    await producer.addTask({
      className: task_name,
      args: args,
    } as any)
  }
}

export class WorkerDaemon {
  jobs!: { [key: string]: { new (): WorkerJob } }
  consumer!: Consumer

  constructor(job_modules: { new (): WorkerJob }[]) {
    this.setupJobs(job_modules)
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
  }

  setupConsumer() {
    this.consumer = new Consumer('consumer', this.runConsumer.bind(this), {
      redisOptions,
      consumerOptions: {
        concurrencyPerInstance: 1,
        maxRetry: 1,
        workerFnTimeoutMs: 3000,
      },
    })
  }

  async runConsumer(job: Job, metadata: any) {
    console.log(
      `Processing task from Queue: ${metadata.qname}. Task ID: ${metadata.id}.`
    )

    await new this.jobs[job.className]().run(job.args)
  }
}
