import { sep } from 'path'

import { Auth } from '../auth'

export * from './tag-helpers'

export const isNode = typeof window == 'undefined'
export const isBrowserProd =
  !isNode && window.location.hostname.includes('dish')

const isWorker =
  typeof document !== 'undefined' && !document.getElementById('root')

export function getGraphEndpointDomain() {
  const LOCAL_HASURA = 'http://localhost:8080'
  const LIVE_HASURA = 'https://hasura.rio.dishapp.com'

  if (isWorker) {
    return LIVE_HASURA
  }

  let domain: string
  if (isNode) {
    domain =
      process.env.HASURA_ENDPOINT ||
      process.env.REACT_APP_HASURA_ENDPOINT ||
      LOCAL_HASURA
  } else {
    if (isBrowserProd) {
      domain = LIVE_HASURA
    } else {
      if (window.location.hostname.includes('hasura_live')) {
        domain = LIVE_HASURA
      } else {
        domain = process.env.REACT_APP_HASURA_ENDPOINT || LOCAL_HASURA
      }
    }
  }

  return domain
}

export function getGraphEndpoint() {
  return `${getGraphEndpointDomain()}/v1/graphql`
}

export async function graphqlGet(query: string = '', variables: Object = {}) {
  const res = await fetch(getGraphEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...Auth.getHeaders(),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    mode: 'cors',
  })
  return await res.json()
}

const slugCache = {}
const sets = [
  { to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]' },
  { to: 'c', from: '[ÇĆĈČ]' },
  { to: 'd', from: '[ÐĎĐÞ]' },
  { to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]' },
  { to: 'g', from: '[ĜĞĢǴ]' },
  { to: 'h', from: '[ĤḦ]' },
  { to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]' },
  { to: 'j', from: '[Ĵ]' },
  { to: 'ij', from: '[Ĳ]' },
  { to: 'k', from: '[Ķ]' },
  { to: 'l', from: '[ĹĻĽŁ]' },
  { to: 'm', from: '[Ḿ]' },
  { to: 'n', from: '[ÑŃŅŇ]' },
  { to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]' },
  { to: 'oe', from: '[Œ]' },
  { to: 'p', from: '[ṕ]' },
  { to: 'r', from: '[ŔŖŘ]' },
  { to: 's', from: '[ßŚŜŞŠ]' },
  { to: 't', from: '[ŢŤ]' },
  { to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]' },
  { to: 'w', from: '[ẂŴẀẄ]' },
  { to: 'x', from: '[ẍ]' },
  { to: 'y', from: '[ÝŶŸỲỴỶỸ]' },
  { to: 'z', from: '[ŹŻŽ]' },
  { to: '-', from: "[·/_,:;']" },
].map((x) => ({
  ...x,
  from: new RegExp(x.from, 'gi'),
}))

export const slugify = (text: string, separator = '-') => {
  if (!slugCache[separator]) {
    slugCache[separator] = {}
  }
  if (slugCache[separator][text]) {
    return slugCache[separator][text]
  }

  let out = text.toString().toLowerCase().trim()

  for (const set of sets) {
    out = out.replace(set.from, set.to)
  }

  out = out
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text

  if (typeof separator !== 'undefined' && separator !== '-') {
    out = out.replace(/-/g, separator)
  }

  if (out == '') {
    return `no-slug`
  }

  slugCache[separator][out] = out
  return out
}
