import crypto from 'crypto'

import { chunk } from 'lodash'

import { order_by, photos_constraint, query, uuid } from '../graphql'
import { Photos } from '../types'
import { createQueryHelpersFor } from './queryHelpers'
import { resolvedWithFields } from './queryResolvers'

const QueryHelpers = createQueryHelpersFor<Photos>('photos')
export const photosInsert = QueryHelpers.insert
export const photosUpdate = QueryHelpers.update
export const photosFindOne = QueryHelpers.findOne
export const photosDelete = QueryHelpers.delete
export const photosRefresh = QueryHelpers.refresh

const _photosUpsert = QueryHelpers.upsert

export async function photosUpsert(photos: Photos[]) {
  let constraint: string | undefined = undefined
  if (photos.length == 0) return
  if (photos[0].restaurant_id && !photos[0].tag_id) {
    constraint = photos_constraint.photos_restaurant_id_url_key
  }
  if (photos[0].restaurant_id && photos[0].tag_id) {
    constraint = photos_constraint.photos_restaurant_id_tag_id_url_key
  }
  if (photos[0].tag_id && !photos[0].restaurant_id) {
    constraint = photos_constraint.photos_tag_id_url_key
  }
  if (!constraint) throw 'SELF CRAWLER: No constraint for photos'

  await _photosUpsert(photos, constraint)

  if (!photos[0].quality) {
    const unassessed_photos = await findUnassessedPhotos(photos)
    await assessNewPhotos(unassessed_photos)
  }
}

export async function unassessedPhotosForRestaurant(
  restaurant_id: uuid
): Promise<Photos[]> {
  const photos = await resolvedWithFields(() =>
    query.photos({
      where: {
        restaurant_id: {
          _eq: restaurant_id,
        },
        quality: {
          _eq: null,
        },
      },
    })
  )
  return photos
}

export async function unassessedPhotosForTag(tag_id: uuid): Promise<Photos[]> {
  const photos = await resolvedWithFields(() =>
    query.photos({
      where: {
        tag_id: {
          _eq: tag_id,
        },
        quality: {
          _eq: null,
        },
      },
    })
  )
  return photos
}

export async function unassessedPhotosForRestaurantTag(
  restaurant_id: uuid
): Promise<Photos[]> {
  const photos = await resolvedWithFields(() =>
    query.photos({
      where: {
        restaurant_id: {
          _eq: restaurant_id,
        },
        tag_id: {
          _neq: null,
        },
        quality: {
          _eq: null,
        },
      },
    })
  )
  return photos
}

export async function bestPhotosForRestaurant(
  restaurant_id: uuid
): Promise<Photos[]> {
  const photos = await resolvedWithFields(() =>
    query.photos({
      where: {
        restaurant_id: {
          _eq: restaurant_id,
        },
      },
      order_by: [{ quality: order_by.desc }],
    })
  )
  return photos
}

export async function bestPhotosForTag(tag_id: uuid): Promise<Photos[]> {
  const photos = await resolvedWithFields(() =>
    query.photos({
      where: {
        tag_id: {
          _eq: tag_id,
        },
      },
      order_by: [{ quality: order_by.desc }],
    })
  )
  return photos
}

export async function bestPhotosForRestaurantTags(
  restaurant_id: uuid
): Promise<Photos[]> {
  const photos = await resolvedWithFields(() =>
    query.photos({
      where: {
        restaurant_id: {
          _eq: restaurant_id,
        },
        tag_id: {
          _neq: null,
        },
      },
      order_by: [{ quality: order_by.desc }],
    })
  )
  return photos
}

async function assessNewPhotos(unassessed_photos: Photos[]) {
  const IMAGE_QUALITY_API_BATCH_SIZE = 30
  unassessed_photos = proxyYelpCDN(unassessed_photos)
  let assessed: Photos[] = []
  for (const batch of chunk(unassessed_photos, IMAGE_QUALITY_API_BATCH_SIZE)) {
    assessed = [...assessed, ...(await assessPhotoQuality(batch))]
  }
  await photosUpsert(assessed)
}

async function assessPhotoQuality(photos: Photos[]) {
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

function proxyYelpCDN(photos: Photos[]) {
  if (typeof process.env.YELP_CDN_AWS_PROXY === undefined) {
    throw Error('SELF CRAWLER: Yelp AWS CDN proxy not set')
  }
  return photos.map((p) => {
    p.url = p.url?.replace(
      'https://s3-media0.fl.yelpcdn.com/',
      //@ts-ignore
      process.env.YELP_CDN_AWS_PROXY
    )
    return p
  })
}

async function findUnassessedPhotos(photos: Photos[]) {
  let unassessed_photos: Photos[] = []
  if (photos[0].restaurant_id && !photos[0].tag_id) {
    unassessed_photos = await unassessedPhotosForRestaurant(
      photos[0].restaurant_id
    )
  }
  if (photos[0].restaurant_id && photos[0].tag_id) {
    unassessed_photos = await unassessedPhotosForRestaurantTag(
      photos[0].restaurant_id
    )
  }
  if (photos[0].tag_id && !photos[0].restaurant_id) {
    unassessed_photos = await unassessedPhotosForTag(photos[0].tag_id)
  }
  return unassessed_photos
}
