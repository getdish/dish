import { Self } from './Self'

async function main() {
  const ue = new Self()
  await ue.runOnWorker('main')
}

main()
