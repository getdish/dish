import { Crawler } from '@dish/crawler'

export async function crawlYelp() {
  console.log('Starting yelp crawl')
  const query = encodeURIComponent(`pho`)
  const location = encodeURIComponent(`San Francisco`)
  const crawler = new Crawler({
    entry: `https://www.yelp.com/search?find_desc=${query}&find_loc=${location}%2C%20CA`,
    maxPages: 20,
  })

  await crawler
    .start({
      depth: '/biz',
    })
    .onPage(page => {
      console.log('we have a pho page', page)
    })
    .onEndCrawl()
}
