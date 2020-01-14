import { WorkerJob } from '@dish/worker'

export class UberEats extends WorkerJob {
  async run() {
    console.log('UberEats run')
  }
}
