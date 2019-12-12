import URI from 'urijs'

export const urlSimilarity = (wanted: string, given: string) => {
  let score = 100
  // de-weight paths with ?params just a lil
  if (/[?](.*)$/g.test(given)) {
    score -= 4
  }
  // avoid those paths confusing the score
  let curPath = cleanUrlEnd(given)
  const segments = given.split('/').length
  for (let i = 0; i < segments; i++) {
    if (wanted === curPath) {
      return score
    }
    score--
    curPath = removeLastSegmentOfPath(curPath)
  }
  return 0
}

export const urlMatchesExtensions = (url: string, extensions: string[]) => {
  const extension = cleanUrlEnd(url).slice(url.length - 4, url.length)
  return extensions.indexOf(extension) >= 0
}

export const normalizeHref = (baseUrl: string, href: string) => {
  let url = new URI(href)
  if (url.is('relative')) {
    url = url.absoluteTo(baseUrl)
  }
  return url.toString()
}

export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

const ENDING_QUERY = /[?](.*)$/g
const ENDING_HASH = /[#](.*)$/g

export const removeLastSegmentOfPath = x => x.replace(/\/[^\/]+$/g, '')
export const cleanUrlHash = url => url.replace(ENDING_HASH, '')
const cleanUrlSearch = url => url.replace(ENDING_QUERY, '')
export const cleanUrlEnd = url => cleanUrlHash(cleanUrlSearch(url))
