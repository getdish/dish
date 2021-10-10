import { sleep } from '@dish/async'
import _ from 'lodash'
import fetch, { FetchOptions } from 'make-fetch-happen'

import { fetchBrowserHTML, fetchBrowserJSON, fetchBrowserScriptData } from './browser'

if (!process.env.LUMINATI_PROXY_HOST || !process.env.STORMPROXY_HOSTS) {
  console.error('Warning: Missing proxy config ⚠️ ⚠️ ⚠️', {
    LUMINATI_PROXY_HOST: process.env.LUMINATI_PROXY_HOST,
    STORMPROXY_HOSTS: process.env.STORMPROXY_HOSTS,
  })
}

type Opts = Partial<FetchOptions> & {
  skipBrowser?: boolean
}

export class ProxiedRequests {
  constructor(
    public domain: string,
    public aws_proxy: string,
    public config: Opts = { timeout: null }
  ) {}

  async getJSON(uri: string, props?: Opts) {
    try {
      return await this.get(uri, props).then((x) => x.json() as Promise<{ [key: string]: any }>)
    } catch (err) {
      if (!props?.skipBrowser) {
        const url = this.domain + uri
        console.log(`ProxiedRequests.getJSON`, url)
        return await fetchBrowserJSON(url)
      } else {
        throw err
      }
    }
  }

  async getScriptData(uri: string, selectors: string[]): Promise<any> {
    return await fetchBrowserScriptData(this.domain + uri, selectors)
  }

  async getText(uri: string, props?: Opts) {
    if (!props?.skipBrowser) {
      try {
        return await fetchBrowserHTML(this.domain + uri)
      } catch (err) {
        console.warn('Error with browser fetch, fall back to proxies', err)
      }
    }
    return await this.get(uri, props).then((x) => x.text())
  }

  proxies = [
    ...(process.env.NODE_ENV === 'development' ? [{ name: 'Unproxied', base: this.domain }] : []),
    // fly.io - basically free but may not like us crawling
    // { name: 'Fly', base: this.domain, host: 'fly-proxy.fly.dev', port: 10080, protocol: 'https' },
    // $0.000005/request regardless of bandwidth
    { name: 'AWS', base: this.aws_proxy.replace(/\/$/, '') },
    // $0.5/GB or ~$0.00005/request for ~100kb requests
    { name: 'Luminati', base: this.domain, ...getLuminatiProxyConfig() },
    // $12.5/GB or ~$0.00125/request for ~100kb requests
    { name: 'Luminati Residential', base: this.domain, ...getLuminatiResidentialConfig() },
    // $50/mo "unlimited"
    { name: 'Storm', base: this.domain, ...getStormProxyConfig() },
  ] as const

  async get(uri: string, props: Opts = { timeout: null }) {
    const config = _.merge(this.config, props)
    let tries = 0
    const { name, base, ...agentConfig } = this.proxies[tries]
    const tried: any[] = []
    while (true) {
      const url = base + uri
      const options = {
        ...config,
      }
      // if proxied by us
      if ('host' in agentConfig) {
        // @ts-ignore
        const { host, port, auth } = agentConfig
        const proto = agentConfig.protocol ?? 'http'
        const user = auth ? `${auth.username}:${auth.password}@` : ''
        options.proxy = `${proto}://${user}${host}:${port}`
      }
      tried.push({ url, options })
      try {
        const tm = sleep(8000).then(() => 'failed')
        console.log('ProxiedRequests.get', name, url, options)
        // @ts-ignore
        const res = await Promise.race([fetch(url, options), tm])
        if (res === 'failed') {
          throw new Error(`ProxiedRequests.get Timed out`)
        }
        if (res.status !== 200) {
          console.warn('⚠️ non 200 response: ', res.status, res.statusText)
          throw new Error(`non 200`)
        } else {
          console.log('✅ 200')
        }
        return res
      } catch (e) {
        tries++
        if (tries > this.proxies.length - 1) {
          console.log('Error:', e.message, { options, tried })
          throw new Error('Too many 503 errors for: ' + uri)
        }
        const errMsg = e.message?.replace(url, '(url)')
        console.warn(`ProxiedRequests: error, retrying (${tries}) with ${name}: ${errMsg}`)
        console.warn(`  options: ${JSON.stringify(options || null, null, 2)}`)
      }
    }
  }
}

function getStormProxyConfig() {
  if (!process.env.STORMPROXY_HOSTS) {
    throw new Error(`No STORMPROXY_HOSTS env`)
  }
  const hosts = process.env.STORMPROXY_HOSTS.split(',')
  const index = Math.floor(Math.random() * (hosts.length - 1))
  const [host, port] = hosts[index].split(':')
  return { host, port: +port, protocol: 'https' }
}

function getLuminatiBaseConfig() {
  return {
    protocol: 'https',
    host: process.env.LUMINATI_PROXY_HOST!,
    port: +`${process.env.LUMINATI_PROXY_PORT ?? 0}`,
  }
}

function getLuminatiProxyConfig() {
  return {
    ...getLuminatiBaseConfig(),
    auth: {
      username: process.env.LUMINATI_PROXY_DATACENTRE_USER!,
      password: process.env.LUMINATI_PROXY_DATACENTRE_PASSWORD!,
    },
  }
}

function getLuminatiResidentialConfig() {
  return {
    ...getLuminatiBaseConfig(),
    auth: {
      username: process.env.LUMINATI_PROXY_RESIDENTIAL_USER!,
      password: process.env.LUMINATI_PROXY_RESIDENTIAL_PASSWORD!,
    },
  }
}
