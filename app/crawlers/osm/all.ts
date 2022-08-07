import { OSM } from './OSM'

const crawler = new OSM()
crawler.runOnWorker('getAllForRegion', [])
