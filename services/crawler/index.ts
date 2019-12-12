import { uniq } from 'lodash'
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

export type CrawlerOptions = {
  entry: string
  maxCores?: number
  maxPages?: number
  maxRadius?: number
  depth?: 'string'
  filterUrlExtensions?: string[]
}

export default class Crawler {
  cancelled = false
  isRunning = false
  browser = null
  count = 0
  selectors = null
  promiseEnds = []
  queue: CrawlQueue

  constructor(private crawlOptions: CrawlerOptions) {}

  start = async () => {
    if (this.isRunning) {
      throw new Error(`Already running`)
    }
    this.count = 0
    this.isRunning = true
    this.cancelled = false
    const options = {
      puppeteerOptions: {
        ignoreHTTPSErrors: true,
        timeout: 10000, // 10 seconds
      },
      ...this.crawlOptions,
    }
    // defaults
    const {
      entry,
      maxCores = MAX_CORES_DEFAULT,
      maxPages = Infinity,
      maxRadius = Infinity,
      // maxOffPathRadius, this would be really nice
      depth = '/',
      filterUrlExtensions = FILTER_URL_EXTENSIONS,
    } = options

    const matchesDepth = url => {
      return parse(url).pathname && parse(url).pathname.indexOf(depth) === 0
    }

    const initialUrl = cleanUrlHash(entry)
    let target = { url: initialUrl, radius: 0 }

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

    // used to check if done in while loop and after page crash
    const isFinished = checkQueue => {
      const isLoadingPage = loadingPage.indexOf(true) > -1
      const hasMoreInQueue = this.queue.pageQueue.length > 0
      const hasFoundEnough = this.count >= maxPages
      const queueEmpty = !isLoadingPage && !hasMoreInQueue
      if (checkQueue) {
        if (this.cancelled) console.log('isFinished => cancelled')
        if (hasFoundEnough) console.log('isFinished => hasFoundEnough')
        if (queueEmpty) console.log('isFinished => queueEmpty')
      }
      return this.cancelled || hasFoundEnough || (checkQueue && queueEmpty)
    }

    const runTarget = async (target, page) => {
      console.log(`now: ${target.url}`)
      try {
        if (urlMatchesExtensions(target.url, filterUrlExtensions)) {
          console.log(`Looks like an image, avoid`)
          return null
        } else if (target.radius >= maxRadius) {
          console.log(`Maximum radius reached. Radius: ${target.radius}`)
          return null
        } else if (!matchesDepth(target.url)) {
          console.log(`Path is not at same depth:`)
          console.log(`  ${parse(target.url).pathname}`)
          console.log(`  ${depth}`)
          return null
        }
        // content-type whitelist
        if (!(await this.validContentType(target.url))) {
          return null
        }

        // create new page
        await page.goto(target.url, {
          waitUntil: 'domcontentloaded',
        })
        if (this.cancelled) {
          console.log(`Cancelled during page process`)
          return null
        }
        const contents = await this.parseContents(page, target.url, options)
        if (this.cancelled) {
          console.log(`Cancelled during page process`)
          return null
        }
        let outboundUrls
        if (!options.disableLinkFinding) {
          outboundUrls = await this.findLinks(page, {
            target,
            initialUrl,
            matchesDepth,
            entryUrl,
          })
          console.log(`Found urls: ${outboundUrls.length}`)
        }
        // only count it if it finds goodies
        if (contents) {
          console.log(
            `Found title (${contents.title}) body of ${contents.content.length} length`,
          )
        } else {
          console.log(`No contents found`)
        }
        // store crawl results
        return {
          outboundUrls,
          contents,
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

    // if only running on 1 open 1 tab
    const concurrentTabs = Math.min(maxCores, 7)
    const startTime = +Date.now()
    const loadingPage = range(concurrentTabs).map(() => false)
    console.log(
      `Using puppeteer options: ${JSON.stringify(options.puppeteerOptions)}`,
    )
    const browser = await puppeteer.launch(options.puppeteerOptions)
    const pages = await Promise.all(loadingPage.map(() => browser.newPage()))

    // handlers for after loaded a page
    const finishProcessing = tabIndex => {
      return result => {
        this.queue.add(result)
        if (result && result.contents) {
          console.log('Downloaded', this.queue.getValid().length, 'pages')
          this.count++
        }
        loadingPage[tabIndex] = false
      }
    }

    // do first one
    await runTarget(target, pages[0]).then(finishProcessing(0))

    const shouldCrawlMoreThanOne = maxPages > 1
    // start rest
    if (shouldCrawlMoreThanOne) {
      while (!isFinished(true)) {
        // throttle
        await sleep(20)
        // may need to wait for a tab to clear up
        const tabIndex = loadingPage.indexOf(false)
        if (tabIndex === -1) {
          continue
        }
        const target = this.queue.shiftUrl()
        if (!target) {
          // could be processing a page that will fill queue once done
          continue
        }
        loadingPage[tabIndex] = true
        runTarget(target, pages[tabIndex]).then(finishProcessing(tabIndex))
      }
    }

    console.log(`Crawler done, crawled ${this.count} pages`)
    console.log(`took ${(+Date.now() - startTime) / 1000} seconds`)
    this.isRunning = false
    // close pages
    await browser.close()
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

  validContentType = async url => {
    const res = await fetch(url, { method: 'HEAD' })
    const contentType =
      res.headers.get('content-type') || res.headers.get('Content-Type')
    if (!contentType || !/text\/(html|xml|plain)/g.test(contentType)) {
      log.page(`Bad content-type: ${res.headers.get('content-type')} ${url}`)
      return false
    }
    return true
  }
}

class Page {
  validContentType = async url => {
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
