#!/bin/node

import '@dish/helpers/polyfill'

async function main(slug: string) {
  console.log('crawling internal', slug)
  if (!slug) {
    throw new Error('no slug')
  }
  process.env.SLUG = slug
  require('../src/self/sandbox')
}

main([...process.argv].reverse()[0])
