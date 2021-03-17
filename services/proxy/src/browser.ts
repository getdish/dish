import { Page, WebKitBrowser, webkit } from 'playwright'

if (!process.env.LUMINATI_PROXY_HOST) {
  throw new Error(`No proxy`)
}

let browser: WebKitBrowser | null = null
let browserHasLoadedOriginOnce = false
let page: Page | null = null

export async function ensurePage(forceRefresh = false) {
  if (!browser || forceRefresh) {
    if (browser) {
      console.log('Force refresh from failed proxy, opening new browser')
      await browser.close()
    }
    const proxy = {
      server: `${process.env.LUMINATI_PROXY_HOST}:${process.env.LUMINATI_PROXY_PORT}`,
      username: process.env.LUMINATI_PROXY_RESIDENTIAL_USER,
      password: process.env.LUMINATI_PROXY_RESIDENTIAL_USER,
    }
    console.log('Starting browser', proxy)
    browserHasLoadedOriginOnce = false
    browser = await webkit.launch({
      headless: true,
      proxy,
    })
    page = await browser.newPage()
  }
  return page!
}

export async function fetchBrowser(
  uri: string,
  type: 'html' | 'json' | 'hyperscript',
  selector?: string,
  maxTries = 3
) {
  try {
    if (type === 'hyperscript') {
      return await fetchBrowserHyperscript(uri, selector ?? '')
    }
    if (type === 'html') {
      return await fetchBrowserHTML(uri)
    }
    return await fetchBrowserJSON(uri)
  } catch (err) {
    if (maxTries > 0) {
      console.log(`Trying again (${maxTries} tries left)`)
      await ensurePage(true)
      return await fetchBrowser(uri, type, selector, maxTries - 1)
    } else {
      console.error(`Failed: ${err.message}`)
    }
  }
}

export async function fetchBrowserJSON(uri: string, retry = 0) {
  const page = await ensurePage()
  const url = new URL(uri)
  try {
    if (!browserHasLoadedOriginOnce) {
      console.log('loading origin once first')
      await page.goto(url.origin)
      await page.waitForLoadState('domcontentloaded')
      browserHasLoadedOriginOnce = true
    }
    // if (retry == 0) {
    //   console.log('inline fetch', uri)
    //   // first attempt, lets try fetch inline
    //   let tm
    //   const timeout = new Promise((res) => {
    //     tm = setTimeout(() => res('failed'), 10_000)
    //   })
    //   const res = await Promise.race([
    //     timeout,
    //     page.evaluate((uri: string) => {
    //       return fetch(uri, {
    //         headers: {
    //           'content-type': 'application/json',
    //           accept: 'application/json',
    //           'Accept-Encoding': 'br;q=1.0, gzip;q=0.8, *;q=0.1',
    //         },
    //       }).then((res) => res.json())
    //     }, uri),
    //   ])
    //   console.log('res is', `${res}`.slice(0, 100) + '...')
    //   if (res !== 'failed') {
    //     clearTimeout(tm)
    //     return res
    //   }
    //   console.log('timed out inline fetch')
    // }
    console.log('goto url', uri)
    await page.goto(uri)
    const out = ((await page.textContent('body')) ?? '').trim()
    console.log('got body', out.slice(0, 100) + '...')
    if (out) {
      return JSON.parse(out) as { [key: string]: any }
    }
  } catch (err) {
    console.error(`Error: ${err.message}`)
    if (retry < 2) {
      console.log('rety', retry)
      browserHasLoadedOriginOnce = false
      return await fetchBrowserJSON(uri, retry + 1)
    }
    throw err
  }
  return null
}

export async function fetchBrowserHTML(uri: string) {
  try {
    const page = await ensurePage()
    await page.goto(uri)
    const content = await page.content()
    console.log('returning html content', content.slice(0, 50) + '...')
    return content
  } catch (err) {
    console.error(`Error: ${err.message}`)
    throw err
  }
}

export async function fetchBrowserHyperscript(uri: string, selector: string) {
  const page = await ensurePage()
  await page.goto(uri)
  console.log('hyperscript selector', selector)
  const content = await page.textContent(selector)
  if (content) {
    console.log('got hyperscript, parsing..', content.slice(0, 50) + '...')
    return hyperDecode(content)
  }
  return null
}

function hyperDecode(jsonPayload: string) {
  return decode(
    jsonPayload.slice(LEFT.length, jsonPayload.length - RIGHT.length)
  )
}
const LEFT = '<!--'
const RIGHT = '-->'
const ENCODE = [
  ['&', '&amp;'],
  ['>', '&gt;'],
]
function decode(res) {
  const jsonPayload = ENCODE.reduceRight((str, coding) => {
    const [encodeChar, htmlEntity] = coding
    return str.replace(new RegExp(htmlEntity, 'g'), encodeChar)
  }, res)

  return JSON.parse(jsonPayload)
}
