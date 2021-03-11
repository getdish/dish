import { sentryException } from '@dish/common'
import { getBullQueue } from '@dish/worker'
import Bull from 'bull'
import { BullAdapter, router, setQueues } from 'bull-board'
import express from 'express'

import { klass_map } from './job_processor'

const CONCURRENCY = 2

type Queue = {
  name: string
  queue: Bull.Queue<any>
}

const queues = createQueues()

function clearAllJobs() {
  queues.map((q) => {
    q.queue.clean(10_000_000_000)
    q.queue.removeJobs('*')
    q.queue.empty()
    q.queue.getActive().then((jobs) => {
      jobs.map((job) => {
        job.moveToFailed({ message: 'cancelled' })
      })
    })
  })
}

async function main() {
  console.log(
    'running worker',
    queues.map((x) => x.name),
    process.env.CLEAR_JOBS
  )
  if (process.env.CLEAR_JOBS) {
    clearAllJobs()
  }
  await Promise.all([startDashboard(queues), startQueues(queues)])
}

function startDashboard(queues: Queue[]) {
  return new Promise<void>((res) => {
    // setup bull-board routing
    setQueues(queues.map((x) => new BullAdapter(x.queue)))
    const app = express()
    app.post('/clear', (req, res) => {
      clearAllJobs()
      res.send(200)
    })
    app.use('/', router)
    app.listen(3434, () => {
      console.log('listening on', 3434)
      res()
    })
  })
}

function createQueues() {
  return Object.keys(klass_map).map((queue_name) => {
    const klass = klass_map[queue_name]
    const config = klass.queue_config
    return {
      name: queue_name,
      queue: getBullQueue(queue_name, config),
    }
  })
}

async function startQueues(queues: Queue[]) {
  return await Promise.all(
    queues.map(({ queue, name }) => {
      const path = __dirname + '/job_processor.js'
      console.log('  processing', path)
      queue.process(CONCURRENCY, path)
      console.log('Created Bull worker queue for: ' + name)
      queue.on('failed', (job, err) => {
        sentryException(err, job, { crawler: name })
      })
    })
  )
}

main()

// for dev it should quit background jobs better
var cleanExit = function () {
  process.exit()
}
process.on('SIGINT', cleanExit) // catch ctrl-c
process.on('SIGTERM', cleanExit) // catch kill
