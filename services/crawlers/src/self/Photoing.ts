import crypto from 'crypto'

import { photosUpsert } from '@dish/graph'
import { Photos } from '@dish/graph/src'
import { chunk } from 'lodash'

import { Self } from './Self'

export class Photoing {
  crawler: Self

  constructor(crawler: Self) {
    this.crawler = crawler
  }

  async assessNewPhotos(unassessed_photos: Photos[]) {
    const IMAGE_QUALITY_API_BATCH_SIZE = 30
    let assessed: Photos[] = []
    for (const batch of chunk(
      unassessed_photos,
      IMAGE_QUALITY_API_BATCH_SIZE
    )) {
      assessed = [...assessed, ...(await this.assessPhotoQuality(batch))]
    }
    await photosUpsert(assessed)
  }

  async assessPhotoQuality(photos: Photos[]) {
    const IMAGE_QUALITY_API = 'https://image-quality.rio.dishapp.com/prediction'
    const urls = photos.map((p) => {
      return p.url
    })
    const response = await fetch(IMAGE_QUALITY_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(urls),
    })
    let results = await response.json()
    for (let photo of photos) {
      const result = results.find((r) => {
        if (!photo.url) return false
        const id = crypto.createHash('md5').update(photo.url).digest('hex')
        return id == r.image_id
      })
      photo.quality = result['mean_score_prediction']
    }
    return photos
  }

  _proxyYelpCDN(urls: string[]) {
    if (typeof process.env.YELP_CDN_AWS_PROXY === undefined) {
      throw Error('SELF CRAWLER: Yelp AWS CDN proxy not set')
    }
    return urls.map((p) => {
      return p.replace(
        'https://s3-media0.fl.yelpcdn.com/',
        //@ts-ignore
        process.env.YELP_CDN_AWS_PROXY
      )
    })
  }
}
