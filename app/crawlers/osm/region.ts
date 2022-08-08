import { OSM } from './OSM'
import '@dish/helpers/polyfill'

export async function one(region: string) {
  try {
    const crawler = new OSM()
    crawler.run_all_on_main = true
    await crawler.getAllForRegion()
  } catch (err) {
    console.error('error', err)
  }
}

if (process.env.RUN) {
  console.log('running crawler')
  one(process.env.SLUG || '').then(() => {
    process.exit(0)
  })
}
