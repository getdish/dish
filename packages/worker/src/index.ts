import dotenv from 'dotenv'
dotenv.config()

import { Consumer, Producer } from 'orkid'

const redisOptions = {
  port: 6379,
  host: process.env.DISH_ENV == 'development' ? 'localhost' : 'redis',
}

export class WorkerJob {
  get_name() {
    return this.constructor.name
  }

  async run(): Promise<any> {
    console.log('run() not implemented')
    return false
  }

  async run_on_worker() {
    const producer = new Producer('consumer', {
      redisOptions,
    })

    const task_name = this.get_name()
    await producer.addTask(task_name as any)
  }
}

export class WorkerDaemon {
  jobs!: { [key: string]: () => Promise<any> }
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
      const job = new Job()
      this.jobs[job.get_name()] = job.run
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

  async runConsumer(job: string, metadata: any) {
    console.log(
      `Processing task from Queue: ${metadata.qname}. Task ID: ${metadata.id}.`
    )

    await this.jobs[job]()
  }
}
