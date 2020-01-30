import { uniq } from 'lodash'
import fetch from 'node-fetch'
import puppeteer from 'puppeteer'
import * as URL from 'url'

import { EntryInfo, PageTarget } from '.'
import { cleanUrlHash, matchesDepth, normalizeHref } from './helpers'

type CrawlPageResult = {
  success: boolean
  outboundUrls?: string[]
}

export class CrawlPage {
  constructor(
    private props: {
      target: PageTarget
      page: puppeteer.Page
      depth: string
      entryInfo: EntryInfo
    }
  ) {}

  async run(): Promise<CrawlPageResult> {
    const url = this.props.target.url
    console.log(`loading ${url}`)

    // content-type whitelist
    if (!(await this.validContentType(url))) {
      console.log('skipping content type')
      return {
        success: false,
      }
    }

    // create new page
    await this.props.page.goto(url, {
      waitUntil: 'domcontentloaded',
    })

    // TODO
    const outboundUrls = await this.findOutboundLinks()
    console.log('outboundUrls', outboundUrls)

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

  async findOutboundLinks() {
    const { page, target, entryInfo } = this.props

    const links = await page.evaluate(() => {
      const val = Array.from(document.querySelectorAll('[href]')).map(
        link => link['href']
      )
      return val
    })
    console.log(`Raw links: ${links.length}`)
    return uniq(
      links
        .filter(x => x !== null)
        .map(cleanUrlHash)
        .map(href => normalizeHref(target.url, href))
    ).filter(link => {
      const parsed = URL.parse(link)
      const noPrefix = s => s.replace(/www\./, '')
      const isNotOriginalUrl = link !== entryInfo.fullUrl
      return (
        isNotOriginalUrl &&
        matchesDepth(link, this.props.depth) &&
        noPrefix(parsed.host) === noPrefix(entryInfo.url.host)
      )
    })
  }
}
