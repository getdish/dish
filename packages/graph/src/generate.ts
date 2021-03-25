import '@dish/helpers/polyfill'

import { inspectWriteGenerate } from '@gqless/cli'

import { GRAPH_API_INTERNAL } from './constants'
import { getAuthHeaders } from './getAuth'

const run = async () => {
  await inspectWriteGenerate({
    endpoint: GRAPH_API_INTERNAL,
    destination: 'src/graphql/schema.generated.ts',
    // overwrite: true,
    headers: getAuthHeaders(true),
    generateOptions: {},
  })
}

run().catch(console.error)
