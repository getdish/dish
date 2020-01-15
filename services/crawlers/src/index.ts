import { UberEats } from './UberEats'

//const ubereats = new UberEats()
//ubereats.run_on_worker('ALL')

async function main() {
  const ue = new UberEats()
  await ue.run_on_worker({
    // New York, 3rd Avenue
    lat: 40.767,
    lon: -73.962,
  })
}

main()
