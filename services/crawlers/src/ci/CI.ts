import '@dish/common'

import { QueueOptions, JobOptions } from 'bull'

import { WorkerJob } from '@dish/worker'

export class CI extends WorkerJob {
  static queue_config: QueueOptions = {
    limiter: {
      max: 1,
      duration: 100,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  doIt(message: string) {
    console.log('CI worker job ran with message: ' + message)
  }
}
