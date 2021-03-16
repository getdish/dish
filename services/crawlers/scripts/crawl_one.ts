#!/bin/node

import '@dish/helpers/polyfill'

import { restaurantFindOne } from '@dish/graph'

import {
  latestScrapeForRestaurant,
  removeScrapeForRestaurant,
} from '../src/scrape-helpers'
import { Yelp } from '../src/yelp/Yelp'

async function main(slug: string) {
  if (!slug) {
    throw new Error(`No slug`)
  }
  console.log('Finding', slug)
  const rest = await restaurantFindOne({
    slug,
  })
  console.log('Found', rest)
  await removeScrapeForRestaurant(rest, 'yelp')
  const [lng, lat] = rest.location?.coordinates ?? []
  if (!lng || !lat) {
    throw new Error(`no lng or lat ${rest.location}`)
  }
  const yelp = new Yelp()
  yelp.run_all_on_main = true
  const mv = 0.001
  await yelp.getRestaurants([lat + mv, lng - mv], [lat - mv, lng + mv], 0)
  const scrape = await latestScrapeForRestaurant(rest, 'yelp')
  console.log('got scrape', scrape)
}

main([...process.argv].reverse()[0])
