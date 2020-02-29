import '@dish/common'

import _ from 'lodash'
import axios_base from 'axios'
import { QueueOptions, JobOptions } from 'bull'
import { sentryException } from '@dish/common'

import { WorkerJob } from '@dish/worker'
import { Restaurant, Scrape, ScrapeData } from '@dish/models'

const MICHELIN_DOMAIN =
  process.env.MICHELIN_PROXY || 'https://8nvhrd7onv-dsn.algolia.net'

const axios = axios_base.create({
  baseURL: MICHELIN_DOMAIN,
  headers: {
    common: {
      'X-My-X-Forwarded-For': '8nvhrd7onv-dsn.algolia.net',
    },
  },
})

export class Michelin extends WorkerJob {
  static queue_config: QueueOptions = {
    limiter: {
      max: 1,
      duration: 1000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  async allForRegion(region: string, page: number = 1) {
    console.log('Starting Michelin crawler. Using domain: ' + MICHELIN_DOMAIN)

    const [uri, data] = this.buildRequest(region, page)
    const response = await axios.post(uri as string, data)
    const restaurants = response.data.results[0].hits
    for (const restaurant of restaurants) {
      try {
        await this.saveRestaurant(restaurant)
      } catch (e) {
        sentryException(e, [restaurant])
      }
    }
    if (restaurants.length > 0) {
      await this.runOnWorker('allForRegion', [region, page + 1])
    }
  }

  buildRequest(region: string, page: number) {
    const algolia =
      '/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)' +
      '%3B%20Browser%20(lite)%3B%20instantsearch.js%20(4.1.1)%3B%20JS%20Helper%20' +
      '(3.0.0)&x-algolia-application-id=8NVHRD7ONV&x-algolia-api-key=' +
      '71b3cff102a474b924dfcb9897cc6fa8'
    const data = {
      requests: [
        {
          indexName: 'prod-restaurants-en',
          params:
            `aroundLatLngViaIP=true&aroundRadius=all&filters=` +
            `sites%3A${region}%20AND%20status%3APublished&hitsPerPage=40` +
            `&attributesToRetrieve=%5B%22_geoloc%22%2C%22city_name%22%2C%22country_name` +
            `%22%2C%22cuisine_type%22%2C%22guide_year%22%2C%22image%22%2C%22` +
            `michelin_award%22%2C%22name%22%2C%22offers%22%2C%22offers_size` +
            `%22%2C%22online_booking%22%2C%22other_urls%22%2C%22site_name%22%2C%22` +
            `url%22%5D&maxValuesPerFacet=100&page=${page}&facets=%5B%22country_code%22%2C%22` +
            `region_slug%22%2C%22city_slug%22%2C%22area_slug%22%2C%22michelin_award` +
            `%22%2C%22offers%22%2C%22cuisine_slug%22%2C%22online_booking%22%2C%22` +
            `rating%22%2C%22service_restriction%22%2C%22categories.lvl0%22%5D&tagFilters=`,
        },
      ],
    }
    return [MICHELIN_DOMAIN + algolia, data]
  }

  async saveRestaurant(data: ScrapeData) {
    if (process.env.RUN_WITHOUT_WORKER != 'true') {
      console.info('Michelin: saving ' + data.name)
    }
    const lon = data._geoloc.lng
    const lat = data._geoloc.lat

    const canonical = await Restaurant.saveCanonical(
      lon,
      lat,
      data.name,
      data._highlightResult.street.value
    )
    const scrape = new Scrape({
      source: 'michelin',
      restaurant_id: canonical.id,
      id_from_source: data.objectID,
      location: {
        type: 'Point',
        coordinates: [lon, lat],
      },
      data: {
        main: data,
      },
    })
    await scrape.insert()
    return scrape.id
  }
}
