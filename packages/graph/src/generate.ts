import { getAuthHeaders } from './Auth'
import { GRAPH_API_INTERNAL } from './constants'
import '@dish/helpers/polyfill'
import { inspectWriteGenerate } from '@gqty/cli'

const run = async () => {
  await inspectWriteGenerate({
    destination: 'src/graphql/schema.generated.ts',
    // @ts-ignore
    introspection: {
      endpoint: GRAPH_API_INTERNAL,
      headers: await getAuthHeaders(true),
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
