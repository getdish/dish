import '@dish/helpers/polyfill'

import { UpdateSearchEndpoint } from './UpdateSearchEndpoint'

async function main() {
  const updater = new UpdateSearchEndpoint()
  await updater.getNewSearchEndpoint()
  process.exit(0)
}

main()
