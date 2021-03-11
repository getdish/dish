import { Page, WebKitBrowser, webkit } from 'playwright'

if (!process.env.STORMPROXY_HOSTS) {
  throw new Error(`No proxy`)
}

const proxies = process.env.STORMPROXY_HOSTS.split(',')
const maxProxies = proxies.length
let proxyIndex = Math.floor(Math.random() * proxies.length)
let proxiesUsed = 0
const getNextProxy = () => {
  proxyIndex++
  proxiesUsed++
  if (proxiesUsed === proxies.length) {
    console.log('Tried every proxy, next attempt will not use one')
    return null
  }
  return proxies[proxyIndex % proxies.length]
}

let browser: WebKitBrowser | null = null
let page: Page | null = null

export async function ensurePage(forceRefresh = false) {
  if (!browser || forceRefresh) {
    if (browser) {
      console.log('Force refresh from failed proxy, opening new browse')
      await browser.close()
    }
    const proxy = getNextProxy()
    console.log('Starting browser with proxy', proxy)
    browser = await webkit.launch({
      headless: true,
      ...(proxy && {
        env: {
          https_proxy: `https://${proxy}`,
          http_proxy: `http://${proxy}`,
        },
      }),
    })
    page = await browser.newPage()
  }
  return page!
}

export async function fetchBrowser(
  uri: string,
  type: 'html' | 'json',
  maxTries = 0
) {
  try {
    if (type === 'html') {
      return await fetchBrowserHTML(uri)
    }
    return await fetchBrowserJSON(uri)
  } catch (err) {
    if (maxTries > 0) {
      console.log(`Trying again (${maxTries} tries left)`)
      return await fetchBrowser(uri, type, maxTries - 1)
    } else {
      console.error(`Failed: ${err.message}`)
    }
  }
}

export async function fetchBrowserJSON(uri: string) {
  try {
    const page = await ensurePage()
    await page.goto(uri)
    const out = await page.textContent('body')
    if (out) {
      return JSON.parse(out) as { [key: string]: any }
    }
  } catch (err) {
    console.error(`Error: ${err.message}`)
    await ensurePage(true)
    throw err
  }
  return null
}

export async function fetchBrowserHTML(uri: string) {
  try {
    const page = await ensurePage()
    await page.goto(uri)
    await page.waitForLoadState('domcontentloaded')
    return await page.content()
  } catch (err) {
    console.error(`Error: ${err.message}`)
    await ensurePage(true)
    throw err
  }
  return null
}
