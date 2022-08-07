import { $, fs } from 'zx'

const boundingBox = {
  HI: [-178.334698, 18.910361, -154.806773, 28.402123],
}

export async function osmImport({
  region,
  source = `/Users/n8/Downloads/us-pacific-latest.osm.pbf`,
}: {
  source?: string
  region: keyof typeof boundingBox
}) {
  const regionFile = `/tmp/${region}.pbf`
  const outFile = `${region}-filtered.pbf`
  const tags = `n/amenity`
  await fs.remove(regionFile)
  await fs.remove(outFile)
  await $`osmium extract -b ${boundingBox.HI.join(',')} ${source} -o ${regionFile}`
  await $`osmium tags-filter -o ${outFile} ${regionFile} ${tags}`
}
