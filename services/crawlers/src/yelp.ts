import { Crawler } from '@dish/crawler'

async function main() {
  const query = encodeURIComponent(`pho`)
  const location = encodeURIComponent(`San Francisco`)
  const crawler = new Crawler({
    entry: `https://www.yelp.com/search?find_desc=${query}&find_loc=${location}%2C%20CA`,
    maxPages: 20,
  })

  const results = await crawler
    .start({
      depth: '/biz',
    })
    .onPage(page => {
      console.log('we have a pho page', page)
    })
    .onEndCrawl()
}

main()
