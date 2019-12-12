import { range, uniq } from 'lodash'
import OS from 'os'
import puppeteer from 'puppeteer'
import { parse } from 'url'

import { CrawlQueue } from './CrawlQueue'
import { cleanUrlHash, normalizeHref, sleep, urlMatchesExtensions, urlSimilarity } from './helpers'

// dont use last two cores if possible
// so on 4 core machine just use two
const MAX_CORES_DEFAULT = Math.max(1, OS.cpus().length - 2)
const FILTER_URL_EXTENSIONS = [
  '.png',
  '.jpg',
  '.gif',
  '.css',
  '.js',
  '.svg',
  '.xml',
]

type Target = {
  url: string
  radius: number
}

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

export default class Crawler {
  cancelled = false
  isRunning = false
  browser = null
  count = 0
  selectors = null
  promiseEnds = []
  queue: CrawlQueue
  options: CrawlerOptions
  loadingPage: boolean[]

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
  }

  start = async () => {
    if (this.isRunning) {
      throw new Error(`Already running`)
    }
    // defaults
    const { entry, maxCores, maxPages, depth, puppeteerOptions } = this.options

    // set state
    const concurrentTabs = Math.min(maxCores, 7)
    this.loadingPage = range(concurrentTabs).map(() => false)
    this.count = 0
    this.isRunning = true
    this.cancelled = false

    const initialUrl = cleanUrlHash(entry)

    const target: Target = {
      url: initialUrl,
      radius: 0,
    }

    if (!target.url) {
      console.log(`no url: ${target.url}`)
      return
    }

    const entryUrl = parse(target.url)
    const fullMatchUrl = `${entryUrl.protocol}//${entryUrl.host}${depth}`

    console.log('Scoring closest to url:', fullMatchUrl)
    this.queue = new CrawlQueue({
      scoreFn: url => urlSimilarity(fullMatchUrl, url),
    })

    // if only running on 1 open 1 tab
    const startTime = +Date.now()
    console.log(`Using puppeteer options: ${JSON.stringify(puppeteerOptions)}`)

    // start browser
    this.browser = await puppeteer.launch(puppeteerOptions)
    const pages = await Promise.all(
      this.loadingPage.map(() => this.browser.newPage()),
    )

    // handlers for after loaded a page
    const finishProcessing = tabIndex => {
      return result => {
        this.queue.add(result)
        if (result && result.contents) {
          console.log('Downloaded', this.queue.getValid().length, 'pages')
          this.count++
        }
        this.loadingPage[tabIndex] = false
      }
    }

    // do first one
    await this.runTarget(target, pages[0]).then(finishProcessing(0))

    // start rest
    if (maxPages > 1) {
      while (!this.isFinished(true)) {
        // TODO make throttle adjust for concurrency
        await sleep(this.options.throttle)
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
        this.runTarget(target, pages[tabIndex]).then(finishProcessing(tabIndex))
      }
    }

    console.log(`Crawler done, crawled ${this.count} pages`)
    console.log(`took ${(+Date.now() - startTime) / 1000} seconds`)

    return await this.endCrawl()
  }

  async isFinished(checkQueue?: boolean) {
    const isLoadingPage = this.loadingPage.indexOf(true) > -1
    const hasMoreInQueue = this.queue.pageQueue.length > 0
    const hasFoundEnough = this.count >= this.options.maxPages
    const queueEmpty = !isLoadingPage && !hasMoreInQueue
    if (checkQueue) {
      if (this.cancelled) console.log('isFinished => cancelled')
      if (hasFoundEnough) console.log('isFinished => hasFoundEnough')
      if (queueEmpty) console.log('isFinished => queueEmpty')
    }
    return this.cancelled || hasFoundEnough || (checkQueue && queueEmpty)
  }

  async runTarget(target: Target, page) {
    const { filterUrlExtensions, depth, maxRadius } = this.options

    const crawlPage = new CrawlPage({
      page,
      target,
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
        console.log(`  ${parse(target.url).pathname}`)
        console.log(`  ${depth}`)
        return null
      }

      const { outboundUrls } = await crawlPage.run()

      console.log(`Found urls: ${outboundUrls.length}`)
      // store crawl results
      return {
        outboundUrls,
        radius: ++target.radius,
        url: target.url,
      }
    } catch (err) {
      if (!isFinished()) {
        console.log(
          `Error crawling url ${target.url}\n${err.message}\n${err.stack}`,
        )
      }
      return null
    }
  }

  async endCrawl() {
    this.isRunning = false
    // close pages
    await this.browser.close()
    // resolve any cancels
    if (this.promiseEnds.length) {
      this.promiseEnds.forEach(resolve => resolve())
      this.promiseEnds = []
    }
    // return empty on cancel
    if (this.cancelled) {
      return null
    }
    // return results
    return this.queue.getValid()
  }

  getStatus = ({ includeResults = false } = {}) => {
    const res = { count: this.count, isRunning: this.isRunning }
    if (includeResults && this.queue) {
      const results = this.queue.getValid()
      // only show results if we have more than 0
      if (results && results.length) {
        res.results = results
      }
    }
    return res
  }

  // returns true if it was running
  stop = () => {
    this.cancelled = true
    if (!this.isRunning) {
      return Promise.resolve(false)
    }
    return new Promise(resolve => {
      this.promiseEnds.push(() => resolve(true))
      // failsafe
      setTimeout(() => {
        resolve(false)
      }, 5)
    })
  }
}

type CrawlPageResult = {
  success: boolean
  outboundUrls?: string[]
}

class CrawlPage {
  constructor(private props: { target: Target; page: puppeteer.Page }) {}

  async run(): Promise<CrawlPageResult> {
    // content-type whitelist
    if (!(await this.validContentType(this.props.target.url))) {
      return {
        success: false,
      }
    }

    // create new page
    await this.props.page.goto(this.props.target.url, {
      waitUntil: 'domcontentloaded',
    })

    // TODO
    const outboundUrls = await this.findLinks(this.props.page, {
      target,
      initialUrl,
      entryUrl,
    })

    return {
      success: true,
      outboundUrls,
    }
  }

  async validContentType(url: string) {
    const res = await fetch(url, { method: 'HEAD' })
    const contentType =
      res.headers.get('content-type') || res.headers.get('Content-Type')
    if (!contentType || !/text\/(html|xml|plain)/g.test(contentType)) {
      console.log(`Bad content-type: ${res.headers.get('content-type')} ${url}`)
      return false
    }
    return true
  }

  findLinks = async (page, { target, initialUrl, matchesDepth, entryUrl }) => {
    const links = await page.evaluate(() => {
      const val = Array.from(document.querySelectorAll('[href]')).map(
        link => link.href,
      )
      return val
    })
    console.log(`Raw links: ${links.length}`)
    return uniq(
      links
        .filter(x => x !== null)
        .map(cleanUrlHash)
        .map(href => normalizeHref(target.url, href)),
    ).filter(link => {
      const parsed = parse(link)
      const noPrefix = s => s.replace(/www\./, '')
      const isNotOriginalUrl = link !== initialUrl
      return (
        isNotOriginalUrl &&
        matchesDepth(link) &&
        noPrefix(parsed.host) === noPrefix(entryUrl.host)
      )
    })
  }
}

const matchesDepth = (url: string, depth: string) => {
  return parse(url).pathname && parse(url).pathname.indexOf(depth) === 0
}
