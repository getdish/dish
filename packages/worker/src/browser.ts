export async function fetchBrowserJSON(url: string) {
  const res = await fetchBrowser(url, {
    'content-type': 'application/json',
    parse: 'json',
  })
  return await res.json()
}

export async function fetchBrowserHyperscript(url: string, selector: string) {
  const res = await fetchBrowser(url, {
    'content-type': 'application/json',
    parse: 'hyperscript',
    selector,
  })
  return await res.json()
}

export async function fetchBrowserHTML(url: string) {
  const res = await fetchBrowser(url)
  return await res.text()
}

const regions = ['atl', 'sea', 'lax', 'dfw', 'ord', 'iad', 'sjc', 'vin', 'yyz']
async function fetchBrowser(url: string, headers = {}, retry = 3) {
  let i = 0
  while (i < retry) {
    i++
    try {
      const region = regions[Math.round(Math.random() * regions.length)]
      return await fetch('https://dish-proxy.fly.dev', {
        headers: {
          url,
          'fly-prefer-region': region,
          ...headers,
        },
      })
    } catch (err) {
      console.error(`Error ${err.message}, retries left ${retry - i}`)
    }
  }
  throw new Error(`Failed to fetch`)
}
