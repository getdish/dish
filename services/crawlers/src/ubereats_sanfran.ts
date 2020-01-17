import { UberEats } from './UberEats'

async function main() {
  const ue = new UberEats()
  await ue.run_on_worker({
    // San Francisco, Valencia St.
    lat: 37.759251,
    lon: -122.421351,
  })
}

main()
