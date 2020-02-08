import { UberEats } from './UberEats'

async function main() {
  const ue = new UberEats()
  await ue.runOnWorker('aroundCoords', [
    // San Francisco, Valencia St.
    37.759251,
    -122.421351,
  ])
}

main()
