import '@dish/common'

import ProxyChain from 'proxy-chain'
import { Browser, Page, Request } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

const stealth = StealthPlugin()
// @ts-ignore
stealth.onBrowser = () => {}
puppeteer.use(stealth)

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
  request_count = 0
  blocked_count = 0
  current_scroll = 0
  page!: Page
  browser!: Browser
  aws_proxy: string
  watch_requests_for!: string
  found_watched_request!: string

  constructor(public domain: string, _aws_proxy: string | undefined) {
    if (typeof _aws_proxy == 'undefined') {
      throw new Error('Puppeteer: No AWS proxy set')
    } else {
      this.aws_proxy = _aws_proxy
      console.log('Using AWS proxy: ' + this.aws_proxy)
    }
  }

  async boot() {
    await this.startProxyServer()
    await this.startBrowser()
  }

  async startBrowser() {
    await this.startPuppeteer()
    await this.interceptRequests()
  }

  async restartBrowser() {
    console.log('PUPETEER: Restarting browser...')
    await this.close()
    await this.startBrowser()
    console.log('PUPETEER: Browser restarted.')
  }

  async close() {
    await this.browser.close()
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
    this.browser = await puppeteer.launch({
      headless: false,
      ignoreDefaultArgs: ['--enable-automation'],
      args: ['--proxy-server=localhost:8000', '--no-sandbox'],
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

  _logBlockCounts() {
    console.log(
      'Blocked: ' + this.blocked_count,
      'Allowed: ' + this.request_count
    )
  }

  async _interceptRequests(request: Request) {
    this._waitForSpecificRequest(request)
    const url = this._rewriteDomainsToAWS(request)
    if (!url) {
      this.blocked_count += 1
      return
    }
    if (this._blockImage(request)) {
      this.blocked_count += 1
      return
    }
    this.request_count += 1
    request.continue({ url: url })
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
    const is_needed_image = this._isGoogleUserContent(request)
    if (is_image && !is_needed_image) {
      request.abort()
      return true
    }
    return false
  }

  _rewriteDomainsToAWS(request: Request) {
    const is_main_domain = request.url().includes(this.domain)
    const is_googleusercontent = this._isGoogleUserContent(request)
    if (this._isRequestSensitiveToAWSProxy(request)) {
      return request.url()
    }
    if (is_main_domain) {
      const proxied_url = request.url().replace(this.domain, this.aws_proxy)
      return proxied_url
    } else if (is_googleusercontent) {
      const proxied_url = request
        .url()
        .replace(
          /https:\/\/.*\.com\//,
          process.env.GOOGLE_USERCONTENT_AWS_PROXY || ''
        )
      return proxied_url
    } else {
      request.abort()
      return false
    }
  }

  _isRequestSensitiveToAWSProxy(request: Request) {
    if (request.url().includes('authuser')) return true
  }

  _isGoogleUserContent(request: Request) {
    return request.url().includes('googleusercontent.com')
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
    this.current_scroll = 0
    let preCount = 0
    await this.page.waitForSelector(selector)
    let withinTimeout = true
    while (withinTimeout) {
      preCount = await this._countSelectors(selector)
      await this._scrollIntoView(selector)
      if (process.env.DISH_ENV != 'production' && preCount > 10) {
        console.log('GOOGLE: Exiting scroll loop, not in production')
        break
      }
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
    }
    return false
  }

  async _scrollIntoView(selector: string) {
    this.current_scroll = await this.page.evaluate(
      async (selector, current_scroll) => {
        async function sleep(ms: number) {
          return new Promise((res) => setTimeout(res, ms))
        }
        const elements = document.querySelectorAll(selector)
        for (let i = current_scroll; i < elements.length; i++) {
          elements[i].scrollIntoView()
          current_scroll += 1
          await sleep(500)
        }
        return current_scroll
      },
      selector,
      this.current_scroll
    )
  }

  async _countSelectors(selector: string) {
    return await this.page.evaluate((selector) => {
      return document.querySelectorAll(selector).length
    }, selector)
  }
}
