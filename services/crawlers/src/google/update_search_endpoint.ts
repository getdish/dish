import { UpdateSearchEndpoint } from './UpdateSearchEndpoint'
;(async () => {
  const updater = new UpdateSearchEndpoint()
  await updater.getNewSearchEndpoint()
  process.exit()
})()
