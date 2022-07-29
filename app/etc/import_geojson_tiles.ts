import ogr2ogr from 'ogr2ogr'
import { join } from 'path'

async function main(fileName?: string, destinationTable?: string) {
  if (!fileName || !destinationTable) {
    throw new Error(`missing info`)
  }

  const dataDir = join(__dirname, '..', '..', 'data')
  const file = join(dataDir, fileName)
  console.log('importing', file, 'to', destinationTable)
  const { stream } = await ogr2ogr(file, {
    format: `"PostgreSQL" PG:"${process.env.POSTGRES_URL}"`,
    destination: destinationTable,
  })
  if (stream) {
    stream.once('close', () => {
      console.log('done')
    })
  }
}

main(process.env.FILE, process.env.DEST)
