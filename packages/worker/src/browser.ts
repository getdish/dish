export async function fetchBrowserJSON(url: string, headers?: Object) {
  const res = await fetchBrowser(url, {
    'content-type': 'application/json',
    parse: 'json',
    headers,
  })
  return await res.json()
}

export async function fetchBrowserScriptData(url: string, selectors: string[]) {
  const res = await fetchBrowser(url, {
    'content-type': 'application/json',
    parse: 'script-data',
    selectors: JSON.stringify(selectors),
  })
  return await res.json()
}

export async function fetchBrowserHTML(url: string) {
  const res = await fetchBrowser(url)
  return await res.text()
}

const URL = process.env.PUPPET_PROXY_ENDPOINT ?? 'http://localhost:3535'

async function fetchBrowser(url: string, headers = {}, retry = 3) {
  let i = 0
  while (i < retry) {
    i++
    try {
      return await fetch(URL, {
        headers: {
          url,
          ...headers,
        },
      })
    } catch (err) {
      console.error(`fetchBrowser Error ${err.message}, retries left ${retry - i}`)
    }
  }
  throw new Error(`Failed to fetch`)
}
