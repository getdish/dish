export async function fetchBrowserJSON(url: string) {
  const res = await fetchBrowser(url, {
    'content-type': 'application/json',
  })
  return await res.json()
}

export function fetchBrowserHTML(url: string) {
  return fetchBrowser(url)
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
