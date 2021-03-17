#!/bin/node

import '@dish/helpers/polyfill'

import { restaurantFindOne } from '@dish/graph'

import { removeScrapeForRestaurant } from '../src/scrape-helpers'
import { one } from '../src/yelp/one'

async function main(slug: string) {
  if (!slug) {
    throw new Error(`No slug`)
  }
  const rest = await restaurantFindOne({
    slug,
  })
  if (!rest) {
    console.warn('not found', slug)
    return
  }
  await removeScrapeForRestaurant(rest, 'yelp')
  await one(slug)
}

main([...process.argv].reverse()[0])
