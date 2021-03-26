import '@dish/helpers/polyfill'

import { inspectWriteGenerate } from '@gqless/cli'

import { GRAPH_API_INTERNAL } from './constants'
import { getAuthHeaders } from './getAuth'

const run = async () => {
  await inspectWriteGenerate({
    endpoint: GRAPH_API_INTERNAL,
    destination: 'src/graphql/schema.generated.ts',
    headers: getAuthHeaders(true),
    generateOptions: {},
    transformSchemaOptions: {
      ignoreArgs: ({ type }) => {
        return type.toString().startsWith('jsonb')
      },
    },
  })
}

run().catch(console.error)
