import '@dish/common'

import ProxyChain from 'proxy-chain'
import puppeteer, { Browser, Page, Request } from 'puppeteer-core'

const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
const proxy_host =
  process.env.LUMINATI_PROXY_HOST + ':' + process.env.LUMINATI_PROXY_PORT
const proxy_auth =
  process.env.LUMINATI_PROXY_DATACENTRE_USER +
  ':' +
  process.env.LUMINATI_PROXY_DATACENTRE_PASSWORD
const PROXY = 'http://' + proxy_auth + '@' + proxy_host

export class Puppeteer {
  total = 0
  page!: Page
  browser!: Browser
  aws_proxy: string
  watch_requests_for!: string
  found_watched_request!: string

  // Just be extra careful that anything a dev does doesn't get their IP
  // blacklisted.
  protect_devs_internet: boolean

  constructor(public domain: string, _aws_proxy: string | undefined) {
    if (typeof _aws_proxy == 'undefined') {
      throw new Error('Puppeteer: No AWS proxy set1')
    } else {
      this.aws_proxy = _aws_proxy
    }
    this.protect_devs_internet = process.env.DISH_ENV != 'production'
  }

  async boot() {
    if (this.protect_devs_internet) {
      await this.startProxyServer()
    }
    await this.startPuppeteer()
    await this.interceptRequests()
  }

  async close() {
    await this.browser.close()
    process.exit()
  }

  async sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms))
  }

  async startProxyServer() {
    const server = new ProxyChain.Server({
      port: 8000,
      prepareRequestFunction: () => {
        return {
          upstreamProxyUrl: PROXY,
        }
      },
    })

    server.listen(() => {
      console.log(`Proxy server is listening on port ${server.port}`)
    })

    // Emitted when HTTP connection is closed
    server.on('connectionClosed', ({ stats }) => {
      this.total = this.total + stats.srcTxBytes + stats.srcRxBytes
    })

    // Emitted when HTTP request fails
    server.on('requestFailed', ({ request, error }) => {
      console.log(`Request ${request.url} failed`)
      console.error(error)
    })
  }

  async startPuppeteer() {
    let args: string[] = []
    if (this.protect_devs_internet) {
      args.push('--proxy-server=localhost:8000')
    }
    this.browser = await puppeteer.launch({
      headless: false,
      executablePath: '/usr/bin/google-chrome-stable',
      args: [...args],
    })
    this.page = await this.browser.newPage()
    this.page.on('error', (err) => {
      console.log('Browser error: ', err)
    })

    this.page.on('pageerror', (pageerr) => {
      console.log('Browser page error: ', pageerr)
    })
    await this.page.setViewport({ width: 1366, height: 800 })
    await this.page.setUserAgent(USER_AGENT)
  }

  async interceptRequests() {
    await this.page.setRequestInterception(true)
    this.page.on('request', (request) => this._interceptRequests(request))
  }

  async _interceptRequests(request: Request) {
    if (this._blockImage(request)) return
    this._rewriteDomainToAWS(request)
    this._waitForSpecificRequest(request)
  }

  _blockImage(request: Request) {
    const blockable = [
      /\.png/,
      /\.gif/,
      /.jpg/,
      /.jpeg/,
      /k-no$/,
      /k-mo$/,
      /\.woff/,
    ]
    const is_image = blockable.some((e) => {
      return e.test(request.url())
    })
    if (is_image) {
      request.abort()
      return true
    }
  }

  _rewriteDomainToAWS(request: Request) {
    if (request.url().includes(this.domain)) {
      const proxied_url = request
        .url()
        .replace('https://' + this.domain, this.aws_proxy)
      request.continue({
        url: proxied_url,
      })
    } else {
      request.abort()
    }
  }

  _waitForSpecificRequest(request: Request) {
    if (!this.watch_requests_for) return
    if (request.url().includes(this.watch_requests_for)) {
      this.found_watched_request = request.url()
    }
  }

  async getPage(url: string) {
    await this.page.goto(url)
    await this.screenshot()
  }

  async screenshot() {
    await this.page.screenshot({ path: 'screenshot.jpg' })
  }

  async getCurrentHistoryURL() {
    return await this.page.evaluate(() => window.location.href)
  }

  async waitForURLChange(url: string) {
    console.log('Waiting for URL to change ...')
    while ((await this.getCurrentHistoryURL()) == url) {
      await this.sleep(100)
    }
    console.log('...URL changed')
  }

  async getElementText(selector: string) {
    await this.page.waitForSelector(selector)
    const element = await this.page.$(selector)
    return await this.page.evaluate((element) => element.textContent, element)
  }

  async scrollAllIntoView(selector: string) {
    let preCount = 0
    await this.page.waitForSelector(selector)
    let withinTimeout = true
    while (withinTimeout) {
      preCount = await this._countSelectors(selector)
      await this._scrollIntoView(selector)
      withinTimeout = await this.waitForMoreElements(selector, preCount)
    }
  }

  async waitForMoreElements(selector: string, preCount: number) {
    const TIME_TO_WAIT_FOR_MORE_ELEMENTS = 30 * 1000
    const delay = 200
    let elapsed = 0
    while (elapsed < TIME_TO_WAIT_FOR_MORE_ELEMENTS) {
      const postCount = await this._countSelectors(selector)
      if (postCount > preCount) return true
      await this.sleep(delay)
      elapsed = elapsed + delay
      console.log(elapsed)
    }
    return false
  }

  async _scrollIntoView(selector: string) {
    await this.page.evaluate((selector) => {
      const elements = document.querySelectorAll(selector)
      const last = elements[elements.length - 1]
      last.scrollIntoView()
    }, selector)
  }

  async _countSelectors(selector: string) {
    return await this.page.evaluate((selector) => {
      return document.querySelectorAll(selector).length
    }, selector)
  }
}
