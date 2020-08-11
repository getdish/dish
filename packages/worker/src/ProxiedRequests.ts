import axios, { AxiosRequestConfig } from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import _ from 'lodash'

export class ProxiedRequests {
  constructor(
    public domain: string,
    public aws_proxy: string,
    public config: AxiosRequestConfig = {}
  ) {}

  async get(uri: string, config: AxiosRequestConfig = {}) {
    _.merge(config, this.config, {
      headers: {
        common: {
          'Accept-Encoding': 'br;q=1.0, gzip;q=0.8, *;q=0.1',
        },
      },
    })
    let tries = 0

    // Yelp seem to be on to us with the AWS Gateway :'(
    // $0.000005/request regardless of bandwidth
    //let base = this.aws_proxy
    //let method = 'AWS GATEWAY PROXY'

    // $0.5/GB or ~$0.00005/request for ~100kb requests
    let method = 'LUMINATI DATACENTRE PROXY'
    let base = this.domain
    config = {
      ...config,
      httpsAgent: new HttpsProxyAgent(this.luminatiDatacentreConfig()),
    }

    while (true) {
      try {
        const response = await axios.get(base + uri, config)
        return response
      } catch (e) {
        // TODO: detect other blocking signatures
        if (e.response.status != 503) {
          throw e
        }
        tries++
        if (tries > 3) {
          // $12.5/GB or ~$0.00125/request for ~100kb requests
          method = 'LUMINATI RESIDENTIAL PROXY'
          config = {
            ...config,
            httpsAgent: new HttpsProxyAgent(this.luminatiResidentialConfig()),
          }
        }
        if (tries > 8) {
          throw new Error('Too many 503 errors for: ' + uri)
        }
        console.warn(
          `CRAWLER PROXY: 503 response, so retrying (${tries}) with ${method}: ` +
            uri
        )
      }
    }
  }

  luminatiBaseConfig() {
    return {
      host: process.env.LUMINATI_PROXY_HOST,
      port: process.env.LUMINATI_PROXY_PORT,
    }
  }

  luminatiDatacentreConfig() {
    return {
      ...this.luminatiBaseConfig(),
      auth:
        process.env.LUMINATI_PROXY_DATACENTRE_USER +
        ':' +
        process.env.LUMINATI_PROXY_DATACENTRE_PASSWORD,
    }
  }

  luminatiResidentialConfig() {
    return {
      ...this.luminatiBaseConfig(),
      auth:
        process.env.LUMINATI_PROXY_RESIDENTIAL_USER +
        ':' +
        process.env.LUMINATI_PROXY_RESIDENTIAL_PASSWORD,
    }
  }
}
