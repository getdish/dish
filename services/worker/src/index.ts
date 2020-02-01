import { sentryException } from '@dish/common'

import os from 'os'
import Queue from 'bull'

import { redisOptions } from '@dish/worker'

import { klass_map } from './job_processor'

const CONCURRENCY = os.cpus().length

function main() {
  for (const queue_name in klass_map) {
    const klass = klass_map[queue_name]
    const config = klass.queue_config

    const queue = new Queue(queue_name, { ...config, redis: redisOptions })
    console.log('Created Bull worker queue for: ' + queue_name)
    const path = __dirname + '/job_processor.js'
    queue.process(CONCURRENCY, path)
    queue.on('failed', (job, err) => {
      sentryException(err, job, { crawler: queue_name })
    })
  }
}

main()
