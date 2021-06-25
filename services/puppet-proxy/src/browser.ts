import { Page, WebKitBrowser, devices, webkit } from 'playwright-webkit'

if (!process.env.LUMINATI_PROXY_HOST) {
  throw new Error(`No proxy config`)
}

const awsProxies = {
  'https://ubereats.com/': process.env.UBEREATS_PROXY,
  'https://yelp.com/': process.env.YELP_AWS_PROXY,
  'https://m.yelp.com/': process.env.YELP_MOBILE_AWS_PROXY,
  'https://infatuated.com/': process.env.INFATUATED_PROXY,
  'https://michelin.com/': process.env.MICHELIN_PROXY,
  'https://tripadvisor.com/': process.env.TRIPADVISOR_PROXY,
  'https://google.com/': process.env.GOOGLE_AWS_PROXY,
  'https://doordash_graphql.com/': process.env.DOORDASH_GRAPHQL_AWS_PROXY,
  'https://grubhub.com/': process.env.GRUBHUB_AWS_PROXY,
}

const baseProxy = {
  server: `${process.env.LUMINATI_PROXY_HOST}:${process.env.LUMINATI_PROXY_PORT}`,
  username: process.env.LUMINATI_PROXY_RESIDENTIAL_USER,
  password: process.env.LUMINATI_PROXY_RESIDENTIAL_USER,
}

const instances: {
  [key: string]: {
    browser: WebKitBrowser | null
    page: Page | null
    tries: number
    proxy: null | string | typeof baseProxy
  }
} = {}

function getProxyURL(full: string, useAWS = false) {
  let uri = full
  const proxy = (() => {
    if (useAWS) {
      const proxyURI = uri.replace('//www.', '//')
      for (const key in awsProxies) {
        if (proxyURI.startsWith(key)) {
          console.log('Using aws proxy', key, uri)
          uri = proxyURI.replace(key, awsProxies[key])
          return null
        }
      }
      console.error(`No aws proxy found`)
      return null
    } else {
      return baseProxy
    }
  })()
  return {
    uri,
    isMobile: full.includes('//m.'),
    origin: new URL(uri).origin,
    proxy,
  }
}

type CreateBrowserOpts = { recreate?: boolean; useAWS?: boolean }

async function ensureInstance(
  fullURL: string,
  { recreate = false, useAWS = false }: CreateBrowserOpts = {}
) {
  try {
    const url = getProxyURL(fullURL, useAWS)
    const instance = instances[url.origin]
    if (!instance || recreate) {
      if (instance) {
        console.log('closing existing...')
        await instance.browser.close()
      }
      console.log('start browser with', { recreate, useAWS }, url)
      const browser = await webkit.launch({
        headless: true,
        ...(url.proxy && {
          proxy: url.proxy,
        }),
      })
      const contextConfig = url.isMobile
        ? {
            ...devices['iPhone 11 Pro'],
          }
        : {}
      console.log('using context', contextConfig)
      const context = await browser.newContext(contextConfig)
      const page = await context.newPage()
      if (process.env.NODE_ENV === 'production') {
        console.log('loading origin once first', url.origin)
        await page.goto(url.origin)
      }
      console.log('creating page')
      instances[url.origin] = {
        proxy: url.proxy,
        tries: instance?.tries ?? 0,
        browser,
        page,
      }
    }
    return instances[url.origin]!
  } catch (err) {
    console.log(`Error creating browser instance`, err.message, err.stack)
    throw err
  }
}

async function getBrowserAndURL(uri: string, retry = 0, userOpts?: CreateBrowserOpts) {
  const opts = {
    useAWS: retry > 1 ? true : false,
    recreate: retry < 1,
    ...userOpts,
  }
  console.log('using opts', opts)
  const instance = await ensureInstance(uri, opts)
  const url = getProxyURL(uri, opts.useAWS)
  return {
    instance,
    url,
  }
}

export async function fetchBrowser(
  uri: string,
  type: 'html' | 'json' | 'script-data',
  selectors?: string[] | null,
  retry = 3
) {
  try {
    if (type === 'script-data') {
      return await fetchBrowserScriptData(uri, selectors ?? [], retry)
    }
    if (type === 'html') {
      return await fetchBrowserHTML(uri, retry)
    }
    return await fetchBrowserJSON(uri, retry)
  } catch (err) {
    if (retry > 0) {
      console.log('error fetching', err)
      console.log(`Trying again (retry ${retry})`)
      return await fetchBrowser(uri, type, selectors ?? [], retry - 1)
    } else {
      console.error(`Failed: ${err.message}`)
    }
  }
}

export async function fetchBrowserJSON(uri: string, retry = 0) {
  const { instance, url } = await getBrowserAndURL(uri, retry)
  if (!instance || !instance.page) throw new Error(`No browser instance`)
  try {
    // all except last two attempts, do it inline for less resource usage
    if (retry > 1) {
      try {
        console.log('inline fetch', url)
        return await timeout(
          instance.page.evaluate((uri: string) => {
            return fetch(uri, {
              headers: {
                'content-type': 'application/json',
                accept: 'application/json',
                'Accept-Encoding': 'br;q=1.0, gzip;q=0.8, *;q=0.1',
              },
            }).then((res) => res.json())
          }, url.uri),
          10_000
        )
      } catch (err) {
        console.error(`Error inline fetching, will try navigating: ${err.message}`)
        // allow to continue
      }
    }
    console.log('goto url', url.uri)
    await instance.page.goto(url.uri, {
      waitUntil: 'domcontentloaded',
      timeout: 10_000,
    })
    console.log('get text content')
    const out = await instance.page.textContent('body', {
      timeout: 10_000,
    })
    if (out) {
      console.log('got body', typeof out, out.slice(0, 1000))
      return JSON.parse(out) as { [key: string]: any }
    }
    console.log('got no out')
  } catch (err) {
    console.error(`Error: ${err.message}`)
    if (retry < 2) {
      console.log('err retry', retry)
      return await fetchBrowserJSON(uri, retry + 1)
    }
    throw err
  }
  return null
}

export async function fetchBrowserHTML(uri: string, retry = 0) {
  try {
    const {
      instance: { page },
      url,
    } = await getBrowserAndURL(uri, retry)
    if (!page) throw new Error(`No browser instance`)
    console.log('fetch browser html', uri, retry)
    await page.goto(url.uri, {
      timeout: 60_000,
    })
    const content = await page.content()
    console.log('returning html content', content.slice(0, 50) + '...')
    return content
  } catch (err) {
    console.error(`Error: ${err.message}`)
    throw err
  }
}

export async function fetchBrowserScriptData(uri: string, selectors: string[], retry = 0) {
  const {
    instance: { page },
    url,
  } = await getBrowserAndURL(uri, retry)
  if (!page) throw new Error(`No browser instance`)
  console.log('fetch browser hyperscript', uri, retry)
  await page.goto(url.uri, {
    timeout: 60_000,
  })

  let results: any[] = []

  console.log('script selectors', selectors)
  if (!selectors) {
    console.log('error no selectors')
    return
  }

  for (const selector of selectors) {
    const handles = await page.$$(selector)
    if (handles) {
      results.push(
        await Promise.all(
          handles.map(async (handle) => {
            try {
              const isHyperscript = !!(await handle.getAttribute('data-hypernova-key'))
              if (isHyperscript) {
                const textContent = await handle.textContent()
                if (!textContent) {
                  return null
                }
                console.log('got hyperscript, parsing..', textContent.slice(0, 50) + '...')
                return hyperDecode(textContent)
              }
              const isLDJSON = (await handle.getAttribute('type')) == 'application/ld+json'
              if (isLDJSON) {
                const textContent = await handle.textContent()
                if (!textContent) {
                  return null
                }
                console.log('got ldjson')
                return JSON.parse(textContent)
              }
              return await handle.innerHTML()
            } catch (err) {
              console.log('error processing handle', err.message, err.stack)
              return null
            }
          })
        )
      )
    }
  }

  return results
}

function hyperDecode(jsonPayload: string) {
  return decode(jsonPayload.slice(LEFT.length, jsonPayload.length - RIGHT.length))
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

async function timeout<A extends Promise<any>>(promise: A, time = 0): Promise<any> {
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
