import { sortBy } from 'lodash'

import { PageTarget } from '.'

type ScoreFn = (url: string) => number

type CrawlQueueOpts = {
  scoreFn?: ScoreFn
}

export class CrawlQueue {
  visited: PageTarget[] = []
  discovered: { [key: string]: boolean } = {}
  pageQueue: { url: string; radius: number; score: number }[] = []
  scoreFn: ScoreFn = _ => 0

  constructor(private options: CrawlQueueOpts = {}) {}

  add = (page: PageTarget) => {
    if (!page) {
      console.log('not storing')
      return
    }
    console.log(`Store -> ${page.url}`)
    this.visited.push(page)
    let count = 0
    const radius = page.radius

    if (page.outboundUrls) {
      page.outboundUrls.forEach(url => {
        if (!this.discovered[url]) {
          count++
          const score = this.scoreFn(url)
          this.pageQueue.push({ url, radius, score })
          this.discovered[url] = true
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
    return this.visited.filter(_ => _.parsed)
  }

  getAll() {
    return this.visited
  }
}
