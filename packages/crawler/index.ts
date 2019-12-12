import { range } from 'lodash'
import puppeteer from 'puppeteer'
import * as URL from 'url'

import { CrawlPage } from './CrawlPage'
import { CrawlQueue } from './CrawlQueue'
import { cleanUrlHash, FILTER_URL_EXTENSIONS, matchesDepth, MAX_CORES_DEFAULT, sleep, urlMatchesExtensions, urlSimilarity } from './helpers'

export type CrawlerOptions = {
  entry: string
  throttle?: number
  maxCores?: number
  maxPages?: number
  maxRadius?: number
  depth?: string
  filterUrlExtensions?: string[]
  puppeteerOptions?: {
    ignoreHTTPSErrors?: boolean
    timeout?: number
  }
}

export type PageTarget = {
  url: string
  radius: number
  outboundUrls?: string[]
  parsed?: boolean
}

type OnPageCallback = (page: puppeteer.Page) => void

export type EntryInfo = {
  url: URL.UrlWithStringQuery
  fullUrl: string
}

export default class Crawler {
  isRunning = false
  browser: puppeteer.Browser | null = null
  count = 0
  selectors = null
  cancelQueue: Function[] = []
  queue: CrawlQueue
  options: Required<CrawlerOptions>
  loadingPage: boolean[] = []
  onPageCallback?: OnPageCallback

  entryInfo: EntryInfo

  constructor(props: CrawlerOptions) {
    this.options = {
      ...props,
      throttle: props.throttle ?? 200,
      maxPages: props.maxPages ?? Infinity,
      maxCores: props.maxPages ?? MAX_CORES_DEFAULT,
      maxRadius: props.maxRadius ?? Infinity,
      depth: props.depth ?? '/',
      filterUrlExtensions: props.filterUrlExtensions ?? FILTER_URL_EXTENSIONS,
      puppeteerOptions: {
        ignoreHTTPSErrors: true,
        timeout: 10000, // 10 seconds
      },
    }
    const entryUrl = URL.parse(this.options.entry)
    this.entryInfo = {
      url: entryUrl,
      fullUrl: `${entryUrl.protocol}//${entryUrl.host}${this.options.depth}`,
    }
    this.queue = new CrawlQueue({
      scoreFn: url => urlSimilarity(this.entryInfo.fullUrl, url),
    })
  }

  start(startOptions: { depth?: string } = {}) {
    if (this.isRunning) {
      throw new Error(`Already running`)
    }
    this.resumeCrawling(startOptions)
    return this
  }

  private async resumeCrawling(startOptions: { depth?: string }) {
    // defaults
    const { entry, maxCores, maxPages, puppeteerOptions } = this.options
    const depth = startOptions.depth ?? this.options.depth

    // set state
    const concurrentTabs = Math.min(maxCores ?? MAX_CORES_DEFAULT, 7)
    this.loadingPage = range(concurrentTabs).map(() => false)
    this.count = 0
    this.isRunning = true

    const initialUrl = cleanUrlHash(entry)

    const target: PageTarget = {
      url: initialUrl,
      radius: 0,
    }

    if (!target.url) {
      console.log(`no url: ${target.url}`)
      return
    }

    // if only running on 1 open 1 tab
    const startTime = +Date.now()
    console.log(`Using puppeteer options: ${JSON.stringify(puppeteerOptions)}`)

    // start browser
    this.browser = await puppeteer.launch(puppeteerOptions)

    if (!this.browser) {
      throw new Error(`Error opening browser`)
    }

    const pages = await Promise.all(
      this.loadingPage.map(() => this.browser!.newPage()),
    )

    // handlers for after loaded a page
    const finishProcessing = (tabIndex: number) => {
      return (result: PageTarget | null) => {
        if (!result) {
          return
        }
        this.queue.add(result)
        if (result?.parsed) {
          console.log('Downloaded', this.queue.getValid().length, 'pages')
          this.count++
        }
        this.loadingPage[tabIndex] = false
      }
    }

    const runTarget = async (target: PageTarget, page: puppeteer.Page) => {
      const { filterUrlExtensions, depth, maxRadius } = this.options
      const crawlPage = new CrawlPage({
        page,
        target,
        entryInfo: this.entryInfo,
        depth: this.options.depth,
      })

      console.log(`now: ${target.url}`)
      try {
        if (urlMatchesExtensions(target.url, filterUrlExtensions)) {
          console.log(`Looks like an image, avoid`)
          return null
        } else if (target.radius >= maxRadius) {
          console.log(`Maximum radius reached. Radius: ${target.radius}`)
          return null
        } else if (!matchesDepth(target.url, this.options.depth)) {
          console.log(`Path is not at same depth:`)
          console.log(`  ${URL.parse(target.url).pathname}`)
          console.log(`  ${depth}`)
          return null
        }

        const { outboundUrls } = await crawlPage.run()

        if (this.onPageCallback) {
          this.onPageCallback(page)
        }

        console.log(`Outbound urls: ${outboundUrls?.length ?? 0}`)

        // store crawl results
        return {
          outboundUrls,
          radius: ++target.radius,
          url: target.url,
        }
      } catch (err) {
        if (!this.isFinished()) {
          console.log(
            `Error crawling url ${target.url}\n${err.message}\n${err.stack}`,
          )
        }
        return null
      }
    }

    // do first one
    await runTarget(target, pages[0]).then(finishProcessing(0))

    // start rest
    if (maxPages ?? Infinity > 1) {
      while (!this.isFinished(true)) {
        // TODO make throttle adjust for concurrency
        await sleep(this.options.throttle ?? 100)
        // may need to wait for a tab to clear up
        const tabIndex = this.loadingPage.indexOf(false)
        if (tabIndex === -1) {
          continue
        }
        const target = this.queue.shiftUrl()
        if (!target) {
          // could be processing a page that will fill queue once done
          continue
        }
        this.loadingPage[tabIndex] = true
        runTarget(target, pages[tabIndex]).then(finishProcessing(tabIndex))
      }
    }

    console.log(`Crawler done, crawled ${this.count} pages`)
    console.log(`took ${(+Date.now() - startTime) / 1000} seconds`)
  }

  async isFinished(checkQueue?: boolean) {
    const isLoadingPage = this.loadingPage.indexOf(true) > -1
    const hasMoreInQueue = this.queue.pageQueue.length > 0
    const hasFoundEnough = this.count >= this.options.maxPages
    const queueEmpty = !isLoadingPage && !hasMoreInQueue
    if (checkQueue) {
      if (!this.isRunning) console.log('isFinished => !isRunning')
      if (hasFoundEnough) console.log('isFinished => hasFoundEnough')
      if (queueEmpty) console.log('isFinished => queueEmpty')
    }
    return !this.isRunning || hasFoundEnough || (checkQueue && queueEmpty)
  }

  onPage(cb: OnPageCallback) {
    this.onPageCallback = cb
    return this
  }

  async onEndCrawl() {
    this.isRunning = false
    // close pages
    if (this.browser) {
      await this.browser.close()
    }
    // resolve any cancels
    if (this.cancelQueue.length) {
      this.cancelQueue.forEach(x => x())
      this.cancelQueue = []
    }
    // return results
    return this.queue.getValid()
  }

  getStatus = ({ includeResults = false } = {}) => {
    const res = {
      count: this.count,
      isRunning: this.isRunning,
      results: [] as PageTarget[],
    }
    if (includeResults && this.queue) {
      const results = this.queue.getValid()
      // only show results if we have more than 0
      if (results?.length) {
        res.results = results
      }
    }
    return res
  }

  // returns true if it was running
  stop = () => {
    if (!this.isRunning) {
      return Promise.resolve(false)
    }
    return new Promise(resolve => {
      this.cancelQueue.push(() => resolve(true))
      // failsafe
      setTimeout(() => {
        resolve(false)
      }, 5)
    })
  }
}
