import '@dish/common'
import { osmFilter, osmImport } from '@dish/osm-import'
import { WorkerJob } from '@dish/worker'
import { JobOptions, QueueOptions } from 'bull'

export class OSM extends WorkerJob {
  static queue_config: QueueOptions = {
    limiter: {
      max: 5,
      duration: 300,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  async getAllForRegion() {
    await osmFilter({
      region: 'HI',
    })
    await osmImport()
  }
}
