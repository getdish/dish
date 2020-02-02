import { UberEats } from './UberEats'

async function main() {
  const ue = new UberEats()
  await ue.run_on_worker('all')
}

main()
