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

async function fetchBrowser(url: string, headers = {}, retry = 3) {
  if (!process.env.WORKER_PROXY_URL) {
    throw new Error(`no process.env.process.env.WORKER_PROXY_URL`)
  }
  let i = 0
  while (i < retry) {
    i++
    try {
      return await fetch(process.env.WORKER_PROXY_URL, {
        headers: {
          url,
          ...headers,
        },
      })
    } catch (err) {
      console.error(`Error ${err.message}, retries left ${retry - i}`)
    }
  }
  throw new Error(`Failed to fetch`)
}
