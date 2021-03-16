import { Page, WebKitBrowser, webkit } from 'playwright'

if (!process.env.STORMPROXY_HOSTS) {
  throw new Error(`No proxy`)
}

const proxies = process.env.STORMPROXY_HOSTS.split(',')
const maxProxies = proxies.length
console.log('Proxies', proxies, maxProxies)
let proxyIndex = Math.floor(Math.random() * maxProxies)
let proxiesUsed = 0
const getNextProxy = () => {
  proxyIndex++
  proxiesUsed++
  if (proxiesUsed === maxProxies) {
    console.log('Tried every proxy, next attempt will not use one')
    return null
  }
  return proxies[proxyIndex % maxProxies]
}

let browser: WebKitBrowser | null = null
let page: Page | null = null

export async function ensurePage(forceRefresh = false) {
  if (!browser || forceRefresh) {
    if (browser) {
      console.log('Force refresh from failed proxy, opening new browser')
      await browser.close()
    }
    const proxy = getNextProxy()
    console.log('Disabling proxy for now... ', proxy)
    browser = await webkit.launch({
      headless: true,
      // ...(proxy && {
      //   env: {
      //     // https_proxy: `https://${proxy}`,
      //     http_proxy: `http://${proxy}`,
      //   },
      // }),
    })
    page = await browser.newPage()
  }
  return page!
}

export async function fetchBrowser(
  uri: string,
  type: 'html' | 'json' | 'hyperscript',
  selector?: string,
  maxTries = 0
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
      return await fetchBrowser(uri, type, selector, maxTries - 1)
    } else {
      console.error(`Failed: ${err.message}`)
    }
  }
}

export async function fetchBrowserJSON(uri: string, retry = false) {
  const page = await ensurePage()
  const url = new URL(uri)
  try {
    console.log('first visiting the origin', url.origin)
    console.log('now going to url', uri)
    await page.goto(uri)
    await page.waitForLoadState('domcontentloaded')
    let out = ((await page.textContent('body')) ?? '').trim()
    console.log('got body', out.slice(0, 100) + '...')
    if (out) {
      return JSON.parse(out) as { [key: string]: any }
    }
  } catch (err) {
    console.error(`Error: ${err.message}`)
    if (!retry) {
      console.log('try again first visit origin')
      await page.goto(url.origin)
      return await fetchBrowserJSON(uri, true)
    }
    await ensurePage(true)
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
    await ensurePage(true)
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
