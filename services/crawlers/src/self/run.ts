import { Self } from './Self'

async function main() {
  const ue = new Self()
  const day = 1000 * 60 * 60 * 24
  await ue.runOnWorker('main', undefined, {
    repeat: { every: day },
    jobId: 'DAILY INTERNAL DATA MERGER',
  })
}

main()
