process.env.DISH_ENV = 'development'

import test from 'ava'
import { WorkerDaemon, WorkerJob } from '../src/index'

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

let CAPTURE = 'TODO'

class WorkerTest extends WorkerJob {
  async run() {
    CAPTURE = 'DONE'
  }
}

test.before(() => {
  const worker = new WorkerDaemon([WorkerTest])
  worker.run()
})

test('Worker runs a job', async t => {
  const job = new WorkerTest()
  job.run_on_worker()
  await sleep(1000)
  t.is(CAPTURE, 'DONE')
})
