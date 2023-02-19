import { GRAPH_API_INTERNAL } from './constants'
import '@dish/helpers/polyfill'
import { inspectWriteGenerate } from '@gqty/cli'
import 'localstorage-polyfill'

const run = async () => {
  await inspectWriteGenerate({
    destination: 'src/graphql/schema.generated.ts',
    endpoint: GRAPH_API_INTERNAL,
    headers: {
      'x-hasura-admin-secret': 'password',
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
