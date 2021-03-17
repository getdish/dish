import { Page, WebKitBrowser, webkit } from 'playwright'

if (!process.env.LUMINATI_PROXY_HOST) {
  throw new Error(`No proxy`)
}

let browser: WebKitBrowser | null = null
let browserHasLoadedOriginOnce = false
let page: Page | null = null
let tries = 0

const baseProxy = {
  server: `${process.env.LUMINATI_PROXY_HOST}:${process.env.LUMINATI_PROXY_PORT}`,
  username: process.env.LUMINATI_PROXY_RESIDENTIAL_USER,
  password: process.env.LUMINATI_PROXY_RESIDENTIAL_USER,
}

let activeProxy: typeof baseProxy | null = baseProxy

const awsProxies = {
  'https://ubereats.com/': process.env.UBEREATS_PROXY,
  'https://yelp.com/': process.env.YELP_AWS_PROXY,
  'https://infatuated.com/': process.env.INFATUATED_PROXY,
  'https://michelin.com/': process.env.MICHELIN_PROXY,
  'https://tripadvisor.com/': process.env.TRIPADVISOR_PROXY,
  'https://google.com/': process.env.GOOGLE_AWS_PROXY,
  'https://doordash_graphql.com/': process.env.DOORDASH_GRAPHQL_AWS_PROXY,
  'https://grubhub.com/': process.env.GRUBHUB_AWS_PROXY,
}

export async function ensurePage(forceRefresh = false) {
  if (!browser || forceRefresh) {
    tries++
    if (browser) {
      console.log('Force refresh from failed proxy, opening new browser')
      await browser.close()
    }
    if (tries > 1) {
      activeProxy = null
    }
    console.log('Starting browser, proxies:', activeProxy, awsProxies)
    browserHasLoadedOriginOnce = false
    browser = await webkit.launch({
      headless: true,
      ...(activeProxy && {
        proxy: activeProxy,
      }),
    })
    console.log('Browser version', browser.version())
    page = await browser.newPage()
  }
  return page!
}

export async function fetchBrowser(
  uriBase: string,
  type: 'html' | 'json' | 'hyperscript',
  selector?: string,
  maxTries = 3
) {
  let uri = uriBase
  if (!activeProxy) {
    uri = uri.replace('//www.', '//')
    for (const key in awsProxies) {
      if (uri.startsWith(key)) {
        console.log('Using aws proxy', key)
        uri = uri.replace(key, awsProxies[key])
      }
    }
  }
  console.log('fetchBrowser', uri)
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
      browserHasLoadedOriginOnce = true
    }
    if (retry == 0) {
      // first attempt, lets try fetch inline
      try {
        console.log('inline fetch', uri)
        return await timeout(
          page.evaluate((uri: string) => {
            return fetch(uri, {
              headers: {
                'content-type': 'application/json',
                accept: 'application/json',
                'Accept-Encoding': 'br;q=1.0, gzip;q=0.8, *;q=0.1',
              },
            }).then((res) => res.json())
          }, uri),
          5_000
        )
      } catch (err) {
        console.error(`Error inline fetching: ${err.message}`)
        // allow to continue
      }
    }
    console.log('goto url', uri)
    await page.goto(uri, {
      waitUntil: 'domcontentloaded',
      timeout: 10_000,
    })
    console.log('get text content')
    const out = await page.textContent('body', {
      timeout: 10_000,
    })
    if (out) {
      console.log('got body', typeof out, out)
      return JSON.parse(out) as { [key: string]: any }
    }
    console.log('got no out')
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

async function timeout<A extends Promise<any>>(
  promise: A,
  time = 0
): Promise<any> {
  const failed = Symbol()
  let tm
  // @ts-ignore
  const res = await Promise.race([
    promise,
    new Promise((res) => {
      tm = setTimeout(() => res(failed), time)
    }),
  ])
  if (res === failed) {
    throw new Error(`Timed out in ${time}ms`)
  }
  clearTimeout(tm)
  return res
}
