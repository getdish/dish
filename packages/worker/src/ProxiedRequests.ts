import _ from 'lodash'
import fetch, { FetchOptions } from 'make-fetch-happen'

import {
  fetchBrowserHTML,
  fetchBrowserHyperscript,
  fetchBrowserJSON,
} from './browser'

if (!process.env.LUMINATI_PROXY_HOST || !process.env.STORMPROXY_HOSTS) {
  console.error('Warning: Missing proxy config ⚠️ ⚠️ ⚠️', {
    LUMINATI_PROXY_HOST: process.env.LUMINATI_PROXY_HOST,
    STORMPROXY_HOSTS: process.env.STORMPROXY_HOSTS,
  })
}

type Opts = FetchOptions & {
  skipBrowser?: boolean
}

export class ProxiedRequests {
  constructor(
    public domain: string,
    public aws_proxy: string,
    public config: Opts = {},
    public start_with_aws = false
  ) {}

  async getJSON(uri: string, props?: Opts) {
    if (!props?.skipBrowser) {
      try {
        return await fetchBrowserJSON(this.domain + uri)
      } catch (err) {
        console.warn('Error with browser fetch, fall back to proxies', err)
      }
    }
    return await this.get(uri, props).then(
      (x) => x.json() as Promise<{ [key: string]: any }>
    )
  }

  async getHyperscript(uri: string, selector: string) {
    return await fetchBrowserHyperscript(this.domain + uri, selector)
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

  async get(uri: string, props: Opts = {}) {
    const config = _.merge(this.config, props, {
      headers: {
        'Accept-Encoding': 'br;q=1.0, gzip;q=0.8, *;q=0.1',
      },
    })

    let agentConfig: any = this.getStormProxyConfig()
    let tries = 0
    let base: string = this.domain
    let method: string = 'none'

    const setStormProxy = () => {
      // $50/mo "unlimited"
      method = 'STORMPROXY RESIDENTIAL PROXY'
      base = this.domain
      agentConfig = this.getStormProxyConfig()
    }

    const setLuminatiProxy = () => {
      // $0.5/GB or ~$0.00005/request for ~100kb requests
      method = 'LUMINATI DATACENTRE PROXY'
      base = this.domain
      agentConfig = this.luminatiProxyConfig()
    }

    const setLuminatiResidentialProxy = () => {
      // $12.5/GB or ~$0.00125/request for ~100kb requests
      method = 'LUMINATI RESIDENTIAL PROXY'
      base = this.domain
      agentConfig = this.luminatiResidentialConfig()
    }

    const setAwsProxy = () => {
      // $0.000005/request regardless of bandwidth
      base = this.aws_proxy.replace(/\/$/, '')
      method = 'AWS GATEWAY PROXY'
    }

    if (this.start_with_aws) {
      setAwsProxy()
    } else {
      setStormProxy()
      // setLuminatiResidentialProxy()
    }

    while (true) {
      const url = base + uri
      const { host, port, auth } = agentConfig
      const proto = agentConfig.protocol ?? 'http'
      const user = auth ? `${auth.username}:${auth.password}@` : ''
      const proxy = `${proto}://${user}${host}:${port}`
      const options = {
        ...config,
        proxy,
      }
      try {
        const res = await fetch(url, options)
        if (res.status !== 200) {
          console.warn('⚠️ non 200 response: ', res.status, res.statusText)
        } else {
          console.log('✅ 200')
        }
        return res
      } catch (e) {
        console.log('Error:', e.message, options)
        tries++
        if (tries > 2) {
          setStormProxy()
        } else if (tries < 4) {
          if (process.env.DISABLE_LUMINATI) {
            break
          }
          setLuminatiProxy()
        } else {
          setLuminatiResidentialProxy()
        }
        if (tries > 5) {
          throw new Error('Too many 503 errors for: ' + uri)
        }
        console.warn(
          `CRAWLER PROXY: 503 response, so retrying (${tries}) with ${method}: ` +
            uri
        )
      }
    }

    throw new Error(`Couldn't make fetch after a few tries, giving up`)
  }

  getStormProxyConfig() {
    if (!process.env.STORMPROXY_HOSTS) {
      throw new Error(`No STORMPROXY_HOSTS env`)
    }
    const hosts = process.env.STORMPROXY_HOSTS.split(',')
    const index = Math.floor(Math.random() * (hosts.length - 1))
    const [host, port] = hosts[index].split(':')
    return { host, port: +port, protocol: 'https' }
  }

  luminatiBaseConfig() {
    return {
      protocol: 'https',
      host: process.env.LUMINATI_PROXY_HOST!,
      port: +`${process.env.LUMINATI_PROXY_PORT ?? 0}`,
    }
  }

  luminatiProxyConfig() {
    return {
      ...this.luminatiBaseConfig(),
      auth: {
        username: process.env.LUMINATI_PROXY_DATACENTRE_USER!,
        password: process.env.LUMINATI_PROXY_DATACENTRE_PASSWORD!,
      },
    }
  }

  luminatiResidentialConfig() {
    return {
      ...this.luminatiBaseConfig(),
      auth: {
        username: process.env.LUMINATI_PROXY_RESIDENTIAL_USER!,
        password: process.env.LUMINATI_PROXY_RESIDENTIAL_PASSWORD!,
      },
    }
  }
}
