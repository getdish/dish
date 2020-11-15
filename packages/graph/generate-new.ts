import { inspectWriteGenerate } from '@dish/gqless-cli'

import { Auth } from './src/Auth'
import { getGraphEndpoint } from './src/helpers/getGraphEndpoint'

const run = async () => {
  await inspectWriteGenerate({
    endpoint: getGraphEndpoint(),
    destination: 'src/graphql/new-generated/index.ts',
    overwrite: true,
    headers: Auth.getHeaders(),
    generateOptions: {
      preImport: `
      import { Auth } from '../../Auth'
      import { getGraphEndpoint } from '../../helpers'
      `,
      queryFetcher: `
      const queryFetcher: QueryFetcher = async function (query, variables) {
        const response = await fetch(getGraphEndpoint(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...Auth.getHeaders(),
          },
          body: JSON.stringify({
            query,
            variables,
          }),
          mode: 'cors',
        })
      
        if (!response.ok) {
          throw new Error(\`Network error, received status code \${response.status}\`)
        }
      
        const json = await response.json()
      
        return json
      }
      `,
    },
  })
}

run().catch(console.error)
