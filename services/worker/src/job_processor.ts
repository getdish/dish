// All code that the workers could possibly run needs to be passed to the
// job processor.
import {
  CI,
  DoorDash,
  Google,
  GoogleImages,
  GrubHub,
  Infatuated,
  Michelin,
  Self,
  Tripadvisor,
  UberEats,
  Yelp,
} from '@dish/crawlers'
import { WorkerJob } from '@dish/worker'
import { Job } from 'bull'

// Processing jobs inside a module takes advantage of sandboxing, which gives
// the following benefits:
//   * The process is sandboxed so if it crashes it does not affect the worker.
//   * You can run blocking code without affecting the queue (jobs will not stall).
//   * Much better utilization of multi-core CPUs.
//   * Less connections to redis.

const all: typeof WorkerJob[] = [
  UberEats,
  DoorDash,
  Yelp,
  Self,
  Infatuated,
  Michelin,
  Tripadvisor,
  Google,
  GoogleImages,
  GrubHub,
]

if (process.env.DISH_ENV != 'production') {
  all.push(CI)
}

let klass_map: { [key: string]: typeof WorkerJob } = {}

for (let klass of all) {
  klass_map[klass.prototype.constructor.name] = klass
}

export { klass_map }

export default async (job: Job) => {
  const description = `${job.data.className}.${job.data.fn}(${JSON.stringify(
    job.data.args
  )})`
  console.log(
    `Processing job (${job.id}, attempt: ${job.attemptsMade}): ${description}`
  )
  const worker = new klass_map[job.data.className]()
  await worker.run(job.data.fn, job.data.args)
}
