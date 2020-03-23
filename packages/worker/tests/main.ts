process.env.DISH_ENV = 'development'

import test from 'ava'

import Queue, { Job } from 'bull'
import { WorkerJob } from '../src/index'

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

let CAPTURE = 'TODO'

class WorkerTest extends WorkerJob {
  async capture(message: string) {
    CAPTURE = message
  }
}

test.before(async () => {
  const queue = new Queue('WorkerTest')
  queue.process(async (job: Job) => {
    const Worker = eval(job.data.className)
    const worker = new Worker()
    await worker.run(job.data.fn, job.data.args)
  })
})

test('Worker runs a job', async (t) => {
  const job = new WorkerTest()
  job.runOnWorker('capture', ['DONE'])
  await sleep(1500)
  t.is(CAPTURE, 'DONE')
})
