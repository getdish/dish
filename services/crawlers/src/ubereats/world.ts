import { UberEats } from './UberEats'

async function main() {
  const ue = new UberEats()
  await ue.runOnWorker('world')
}

main()
