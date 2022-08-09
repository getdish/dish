import { join } from 'path'
import { $, fs } from 'zx'

const boundingBox = {
  HI: [-178.334698, 18.910361, -154.806773, 28.402123],
}

export async function osmFilter({
  region,
  source = `/Users/n8/Downloads/us-pacific-latest.osm.pbf`,
}: {
  source?: string
  region: keyof typeof boundingBox
}) {
  const regionFile = `/tmp/${region}.pbf`
  const outFile = `/tmp/${region}-filtered.pbf`
  const tags = `n/amenity`
  await fs.remove(regionFile)
  await fs.remove(outFile)
  // https://osmcode.org/osmium-tool/manual.html#creating-geographic-extracts
  await $`osmium extract -b ${boundingBox.HI.join(',')} ${source} -o ${regionFile}`
  await $`osmium tags-filter -o ${outFile} ${regionFile} ${tags}`
  console.log('output to', outFile)
}

export async function osmImport() {
  const { POSTGRES_URL } = process.env
  const styleFile = join(__dirname, '..', 'osm2pgsql.style')
  // await $`osm2pgsql -d ${POSTGRES_URL} -S ${styleFile} -c /tmp/HI-filtered.pbf`
  const tmpDb = `test`
  const pointsTableDump = `/tmp/dump-points.sql`
  // because i have no idea what i'm doing w these formats and don't want to waste time:
  // insert all filtered into test db
  await $`osm2pgsql -H localhost -s -U postgres -d ${tmpDb} -S ${styleFile} -c /tmp/HI-filtered.pbf`
  // dump just the points table i want
  await $`pg_dump --data-only --host localhost --username postgres --format plain --verbose --file ${pointsTableDump} --table public.planet_osm_point ${tmpDb}`
  // re-insert just the points table to real db
  await $`psql -U postgres -d dish < ${pointsTableDump}`
}
