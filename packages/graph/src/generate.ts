import '@dish/helpers/polyfill'

import { inspectWriteGenerate } from '@dish/gqless-cli'

import { getAuthHeaders } from './getAuth'
import { getGraphEndpoint } from './helpers/getGraphEndpoint'

const run = async () => {
  const endpoint = getGraphEndpoint()
  console.log('Generating from endpoint', endpoint)
  await inspectWriteGenerate({
    endpoint,
    destination: 'src/graphql/schema.generated.ts',
    overwrite: true,
    headers: getAuthHeaders(true),
    generateOptions: {},
  })
}

run().catch(console.error)
