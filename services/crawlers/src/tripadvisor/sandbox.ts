import { Tripadvisor } from './Tripadvisor'

async function main() {
  const t = new Tripadvisor()
  await t.runOnWorker('allForCity', ['San Francisco, CA'])
}

main()
