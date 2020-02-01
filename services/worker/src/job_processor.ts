import { Job } from 'bull'

import { WorkerJob } from '@dish/worker'

// Processing jobs inside a module takes advantage of sandboxing, which gives
// the following benefits:
//   * The process is sandboxed so if it crashes it does not affect the worker.
//   * You can run blocking code without affecting the queue (jobs will not stall).
//   * Much better utilization of multi-core CPUs.
//   * Less connections to redis.

// All code that the workers could possibly run needs to be passed to the
// job processor.
import { UberEats, Yelp } from '@dish/crawlers'
const all = [UberEats, Yelp]

let klass_map: { [key: string]: typeof WorkerJob } = {}

for (let klass of all) {
  klass_map[klass.prototype.constructor.name] = klass
}

export { klass_map }

export default async (job: Job) => {
  const description = `${job.data.className}.run(${JSON.stringify(
    job.data.args
  )})`
  console.log(
    `Processing job (${job.id}, attempt: ${job.attemptsMade}): ${description}`
  )
  const worker = new klass_map[job.data.className]()
  await worker.run(job.data.args)
}
