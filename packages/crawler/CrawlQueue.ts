import { sortBy } from 'lodash'

type ScoreFn = (url: string) => number

type CrawlQueueOpts = {
  scoreFn?: ScoreFn
}

export class CrawlQueue {
  visited = []
  discoveredUrls = {}
  pageQueue = []
  scoreFn: ScoreFn = _ => 0

  constructor(private options: CrawlQueueOpts = {}) {}

  add = page => {
    if (!page) {
      console.log('not storing')
      return
    }
    console.log(`Store -> ${page.url}`)
    this.visited.push(page)
    let count = 0
    const radius = page.radius
    page.outboundUrls.forEach(url => {
      if (!this.discoveredUrls[url]) {
        count++
        const score = this.scoreFn(url)
        this.pageQueue.push({ url, radius, score })
        this.discoveredUrls[url] = true
      }
    })
    if (count) {
      this.pageQueue = sortBy(this.pageQueue, 'score').reverse()
      console.log(`Added ${count} new urls to queue`)
      console.log(`New top of queue: ${this.pageQueue[0].url}`)
      const duplicates = page.outboundUrls.length - count
      if (duplicates) {
        console.log(`${page.outboundUrls.length - count} duplicates found`)
      }
    }
  }

  popUrl = () => {
    if (this.pageQueue.length) {
      return this.pageQueue.pop()
    }
    return null
  }

  shiftUrl = () => {
    if (this.pageQueue.length) {
      return this.pageQueue.shift()
    }
    return null
  }

  getValid = () => {
    return this.visited.filter(_ => _.contents !== null)
  }

  getAll() {
    return this.visited
  }
}
