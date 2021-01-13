import { inspectWriteGenerate } from '@dish/gqless-cli'

import { Auth, getAuthHeaders } from './src/Auth'
import { getGraphEndpoint } from './src/helpers/getGraphEndpoint'

const run = async () => {
  await inspectWriteGenerate({
    endpoint: getGraphEndpoint(),
    destination: 'src/graphql/schema.generated.ts',
    overwrite: true,
    headers: getAuthHeaders(),
    generateOptions: {},
  })
}

run().catch(console.error)
