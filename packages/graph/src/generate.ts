import '@dish/helpers/polyfill'

import { inspectWriteGenerate } from '@pablosz/gqless-cli'

import { GRAPH_API_INTERNAL } from './constants'
import { getAuthHeaders } from './getAuth'

const run = async () => {
  await inspectWriteGenerate({
    destination: 'src/graphql/schema.generated.ts',
    // @ts-ignore
    introspection: {
      endpoint: GRAPH_API_INTERNAL,
      headers: getAuthHeaders(true),
    },
    generateOptions: {},
    transformSchemaOptions: {
      ignoreArgs: ({ type }) => {
        return type.toString().startsWith('jsonb')
      },
    },
  })
}

run().catch(console.error)
