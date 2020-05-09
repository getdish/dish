import { exec } from 'child_process'
import { writeFile } from 'fs'
import { join } from 'path'

process.env.HASURA_ENDPOINT = 'https://hasura.rio.dishapp.com'
process.env.AUTH_ENDPOINT = 'https://auth.rio.dishapp.com'
process.env.HASURA_SECRET = '7Yk45yzZ$!xfkL'

const { ModelBase } = require('@dish/models')
const { Codegen, fetchSchema } = require('@gqless/schema')

const rootPath = join(__dirname, '..', '..')
const graphqlPath = join(rootPath, 'src', 'graphql')

async function run() {
  const fetchQuery = async (query, variables) => {
    const response = await ModelBase.graphqlGet(query, variables)
    if (response.data.errors) {
      process.exit(0)
    }
    return response.data
  }
  const schemaDefs = await fetchSchema(fetchQuery)
  const codegen = new Codegen(schemaDefs, { typescript: true })
  const files = codegen.generate()

  await Promise.all(
    files.map(async (file) => {
      await new Promise((res, rej) => {
        let contents = ''
        for (let line of file.contents.split(`\n`)) {
          // export! them
          if (line.indexOf(`type `) === 0 && line.indexOf('FieldsType<') > 0) {
            line = `export ${line}`
          }
          contents += `${line}\n`
        }
        writeFile(join(graphqlPath, file.path), file.contents, (err) => {
          if (err) return rej(err)
          res()
        })
      })
    })
  )

  exec(`prettier --write "**/*.ts"`, {
    cwd: graphqlPath,
  })
}

run()
