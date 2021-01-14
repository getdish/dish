import '@dish/helpers/polyfill'

import { inspectWriteGenerate } from '@dish/gqless-cli'

import { getAuthHeaders } from './src/getAuth'
import { getGraphEndpoint } from './src/helpers/getGraphEndpoint'

const run = async () => {
  const endpoint = getGraphEndpoint()
  console.log('Generating from endpoint', endpoint)
  await inspectWriteGenerate({
    endpoint,
    destination: 'src/graphql/schema.generated.ts',
    overwrite: true,
    headers: getAuthHeaders(),
    generateOptions: {},
  })
}

run().catch(console.error)
