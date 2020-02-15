import { UberEats } from './UberEats'

async function main() {
  const ue = new UberEats()
  const week = 1000 * 60 * 60 * 24 * 7
  await ue.runOnWorker('world', undefined, {
    repeat: { every: week },
    jobId: 'UBEREATS WORLD CRAWLER',
  })
}

main()
