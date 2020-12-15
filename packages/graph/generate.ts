import { inspectWriteGenerate } from '@dish/gqless-cli'

import { Auth } from './src/Auth'
import { getGraphEndpoint } from './src/helpers/getGraphEndpoint'

const run = async () => {
  await inspectWriteGenerate({
    endpoint: getGraphEndpoint(),
    destination: 'src/graphql/new-generated/index.ts',
    overwrite: true,
    headers: Auth.getHeaders(),
    generateOptions: {},
  })
}

run().catch(console.error)
