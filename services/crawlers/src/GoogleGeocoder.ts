import '@dish/common'

import { settingFindOne } from '@dish/graph'
import { ProxiedRequests } from '@dish/worker'
import _ from 'lodash'

export const GOOGLE_SEARCH_ENDPOINT_KEY = 'GOOGLE_SEARCH_ENDPOINT'
export const LON_TOKEN = '%LON%'
export const LAT_TOKEN = '%LAT%'
export const google_geocoder_id_regex = /(0x[a-f0-9]{13,16}:0x[a-f0-9]{13,16})/

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))
const PLEASE = 'PLEASE'
const GOOGLE_DOMAIN = 'https://www.google.com'
const SEARCH_ENDPOINT_EXPIRED = 'GOOGLE GEOCODER: search endpoint expired'
const ID_NOT_FOUND = 'GOOGLE GEOCODER: ID not found'
const googleAPI = new ProxiedRequests(
  GOOGLE_DOMAIN,
  process.env.GOOGLE_AWS_PROXY || GOOGLE_DOMAIN,
  {
    headers: {
      common: {
        'X-My-X-Forwarded-For': 'www.google.com',
      },
    },
  },
  true
)

String.prototype.replaceAll = function (search, replacement) {
  var target = this
  return target.replace(new RegExp(search, 'g'), replacement)
}

export class GoogleGeocoder {
  query!: string
  lon!: number
  lat!: number
  searchEndpoint!: string

  async searchForID(query: string, lat: number, lon: number) {
    let retries = 0
    this.query = query
    this.lat = lat
    this.lon = lon
    await this._getSearchEndpoint()
    while (retries < 3) {
      try {
        return await this._searchForID()
      } catch (e) {
        if (e.message == ID_NOT_FOUND || e.message == SEARCH_ENDPOINT_EXPIRED) {
          console.log(
            `GOOGLE GEOCODER (retry ${retries}) failed for: "${query}". Error: ${e.message}`
          )
          retries++
          await sleep(1000)
          await this._getSearchEndpoint()
        } else {
          throw new Error(e)
        }
      }
    }
    const message = 'GOOGLE GEOCODER: retries failed getting ID for: ' + query
    if (process.env.DISH_ENV == 'production') {
      throw new Error(message)
    } else {
      console.error(message)
    }
  }

  async _getSearchEndpoint() {
    const result = await settingFindOne({
      key: GOOGLE_SEARCH_ENDPOINT_KEY,
    })
    if (result) {
      this.searchEndpoint = result.value
    } else {
      throw new Error('GOOGLE_SEARCH_ENDPOINT not found in DB')
    }
  }

  _formatSearchURL() {
    return this.searchEndpoint
      .replaceAll(LON_TOKEN, this.lon.toString())
      .replaceAll(LAT_TOKEN, this.lat.toString())
      .replaceAll(PLEASE, encodeURIComponent(this.query))
  }

  async _searchForID() {
    const url = this._formatSearchURL()
    const response = await googleAPI.get(url, {
      headers: { 'user-agent': 'PLEASE' },
    })
    if (this._hasSearchExpired(response.data)) {
      throw new Error(SEARCH_ENDPOINT_EXPIRED)
    }
    // For example: 0x7b300695e1e94c7:0x1706843e5f6d1bd2
    const matches = response.data.match(google_geocoder_id_regex)
    if (matches) {
      return matches[0]
    } else {
      console.error(response.data)
      throw new Error(ID_NOT_FOUND)
    }
  }

  // Example of expired search:
  // "search?tbm=map&authuser=0&hl=en&gl=us&pb=!4m9!1m3!1d3285.0632427323467!2d%LON%!3d%LAT%!2m0!3m2!1i1366!2i800!4f13.1!7i20!10b1!12m8!1m1!18b1!2m3!5m1!6e2!20e3!10b1!16b1!19m4!2m3!1i360!2i120!4i8!20m57!2m2!1i203!2i100!3m2!2i4!5b1!6m6!1m2!1i86!2i86!1m2!1i408!2i240!7m42!1m3!1e1!2b0!3e3!1m3!1e2!2b1!3e2!1m3!1e2!2b0!3e3!1m3!1e3!2b0!3e3!1m3!1e8!2b0!3e3!1m3!1e3!2b1!3e2!1m3!1e9!2b1!3e2!1m3!1e10!2b0!3e3!1m3!1e10!2b1!3e2!1m3!1e10!2b0!3e4!2b1!4b1!9b0!22m6!1schwPX7CqB9H99AOy-r0o%3A1!2s1i%3A0%2Ct%3A11886%2Cp%3AchwPX7CqB9H99AOy-r0o%3A1!7e81!12e5!17schwPX7CqB9H99AOy-r0o%3A2!18e15!24m50!1m12!13m6!2b1!3b1!4b1!6i1!8b1!9b1!18m4!3b1!4b1!5b1!6b1!2b1!5m5!2b1!3b1!5b1!6b1!7b1!10m1!8e3!14m1!3b1!17b1!20m4!1e3!1e6!1e14!1e15!24b1!25b1!26b1!30m1!2b1!36b1!43b1!52b1!54m1!1b1!55b1!56m2!1b1!3b1!65m5!3m4!1m3!1m2!1i224!2i298!26m4!2m3!1i80!2i92!4i8!30m28!1m6!1m2!1i0!2i0!2m2!1i458!2i800!1m6!1m2!1i1316!2i0!2m2!1i1366!2i800!1m6!1m2!1i0!2i0!2m2!1i1366!2i20!1m6!1m2!1i0!2i780!2m2!1i1366!2i800!34m14!2b1!3b1!4b1!6b1!8m4!1b1!3b1!4b1!6b1!9b1!12b1!14b1!20b1!23b1!37m1!1e81!42b1!47m0!49m1!3b1!50m4!2e2!3m2!1b1!3b1!65m0&q=P%20LEASE&oq=P%20LEASE&gs_l=maps.3...158.237.1.246.5.1.0.0.0.0.0.0..0.0....0...1ac.1.64.maps..5.0.0....0.&tch=1&ech=1&psi=chwPX7CqB9H99AOy-r0o.1594825843774.1"
  _hasSearchExpired(result: string) {
    const query_matches = result.match(/q=(.*?)\\u0026/)
    if (!query_matches) return true
    const google_formatted_query = query_matches[1]
    const expected_query = encodeURIComponent(this.query)
      .replaceAll('%20', '+')
      .replaceAll('%2C', ',')
      .replaceAll('%2F', '\\/')
      .replaceAll('%3A', ':')
      .replaceAll('%40', '@')
      .replaceAll('%3B', ';')
      .replaceAll('%24', '$')
    const has_expired = google_formatted_query != expected_query
    if (has_expired) {
      console.log(
        `GOOGLE GEOCODER: possible search expiry, query mismatch:`,
        `Google's: "${google_formatted_query}"`,
        `Dish's: "${expected_query}"`
      )
    }
    return has_expired
  }
}

export function isGoogleGeocoderID(id: string) {
  return id.match(google_geocoder_id_regex)
}
