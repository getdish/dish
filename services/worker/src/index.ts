import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { ExpressAdapter } from '@bull-board/express'
import { sentryException } from '@dish/common'
import { getBullQueue } from '@dish/worker'
import Bull from 'bull'
import express from 'express'

import { klass_map } from './job_processor'

// for dev it should quit background jobs better
const cleanExit = (e) => {
  console.log('clean exit', e)
  process.exit(0)
}
process.on('SIGINT', cleanExit) // catch ctrl-c
process.on('SIGTERM', cleanExit) // catch kill

// this is actually concurrency PER-QUEUE
// but we have one process per queue by default
// so its Queues (~8 right now) * Processes (1)
const CONCURRENCY = 1

type Queue = {
  name: string
  queue: Bull.Queue<any>
}

const queues = createQueues()

function clearJobs(filter?: string[]) {
  console.log('clearing all jobs')
  queues
    .filter((x) => {
      if (!filter) return true
      return filter.includes(x.name)
    })
    .map((q) => {
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
  console.log('running worker', {
    queues: queues.map((x) => x.name),
    CLEAR_JOBS: process.env.CLEAR_JOBS,
    CONCURRENCY,
  })
  if (process.env.CLEAR_JOBS) {
    clearJobs()
  }
  await Promise.all([startDashboard(queues), startQueues(queues)])
}

function startDashboard(queues: Queue[]) {
  return new Promise<void>((res) => {
    const serverAdapter = new ExpressAdapter()
    const board = createBullBoard({
      serverAdapter,
      queues: queues.map((x) => new BullAdapter(x.queue as any)),
    })

    const app = express()
    app.post('/clear', (req, res) => {
      const queueHeader = `${req.headers['queues'] ?? ''}`.trim()
      if (queueHeader === 'all') {
        clearJobs()
      } else {
        clearJobs(queueHeader.split(','))
      }
      res.send(200)
    })
    app.use('/', serverAdapter.getRouter())
    app.listen(3434, () => {
      console.log('listening on', 3434)
      res()
    })
  })
}

function createQueues() {
  return ['BigJobs', ...Object.keys(klass_map)].map((name) => {
    const config = klass_map[name]?.queue_config
    return {
      name,
      queue: getBullQueue(name, config),
    }
  })
}

async function startQueues(queues: Queue[]) {
  return await Promise.all(
    queues.map(({ queue, name }) => {
      const path = __dirname + '/job_processor.js'
      console.log('startQueue', name, CONCURRENCY, path)
      queue.process(name, CONCURRENCY, path)
      console.log('Created Bull worker queue for: ' + name)
      queue.on('failed', (job, err) => {
        sentryException(err, {
          data: job,
          tags: { crawler: name },
        })
      })
    })
  )
}

main()
