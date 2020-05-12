process.env.HASURA_ENDPOINT = 'https://hasura.rio.dishapp.com'
process.env.AUTH_ENDPOINT = 'https://auth.rio.dishapp.com'

require('isomorphic-unfetch')

const { exec } = require('child_process')
const { writeFile } = require('fs')
const { join } = require('path')

const { graphqlGet } = require('@dish/common-web')
const { Codegen, fetchSchema } = require('@gqless/schema')

const rootPath = join(__dirname)
const graphqlPath = join(rootPath, 'src', 'graphql')

console.log('rootPath', rootPath)

async function run() {
  const fetchQuery = async (query, variables) => {
    const response = await graphqlGet(query, variables)
    console.log('response', response)
    if (response && response.data && response.data.errors) {
      process.exit(0)
    }
    return response
  }

  console.log('Fetching schema...')
  const schemaDefs = await fetchSchema(fetchQuery)
  const codegen = new Codegen(schemaDefs, { typescript: true })
  const ignore = {
    'client.ts': true,
    'extensions/index.ts': true,
  }
  const files = codegen.generate().filter((x) => !ignore[x.path])

  console.log(
    'Saving...',
    files.map((x) => join(graphqlPath, x.path))
  )

  await Promise.all(
    files.map(
      (file) =>
        new Promise((res, rej) => {
          let contents = ''
          for (let line of file.contents.split(`\n`)) {
            // export! them
            if (
              line.indexOf(`type `) === 0 &&
              line.indexOf('FieldsType<') > 0
            ) {
              line = `export ${line}`
            }
            contents += `${line}\n`
          }
          console.log('write', file.path)
          writeFile(join(graphqlPath, file.path), contents, (err) => {
            if (err) return rej(err)
            res()
          })
        })
    )
  )

  console.log('Prettier...')

  exec(`prettier --write "**/*.ts"`, {
    cwd: graphqlPath,
  })
}

run()
