import crypto from 'crypto'

import {
  PhotoBase,
  PhotoXref,
  ZeroUUID,
  createQueryHelpersFor,
  order_by,
  query,
  resolvedWithFields,
  uuid,
} from '@dish/graph'
import { chunk, clone, uniqBy } from 'lodash'

const PhotoBaseQueryHelpers = createQueryHelpersFor<PhotoBase>('photo')
const PhotoXrefQueryHelpers = createQueryHelpersFor<PhotoXref>('photo_xref')
const photoBaseUpsert = PhotoBaseQueryHelpers.upsert
const photoXrefUpsert = PhotoXrefQueryHelpers.upsert

export async function photoUpsert(photos: PhotoXref[]) {
  if (photos.length == 0) return
  if (photos[0].restaurant_id && !photos[0].tag_id) {
    photos.map((p) => (p.tag_id = ZeroUUID))
  }
  if (photos[0].tag_id && !photos[0].restaurant_id) {
    photos.map((p) => (p.restaurant_id = ZeroUUID))
  }

  photos = uniqBy(photos, (el) =>
    [el.tag_id, el.restaurant_id, el.photo?.url].join()
  )

  photos.map((p) => {
    if (!p.photo || !p.photo.url) throw 'Photo must have URL'
    p.photo.origin = clone(p.photo?.url)
    p.photo.url = proxyYelpCDN(p.photo?.url)
  })

  await photoXrefUpsert(photos)

  const unassessed_photos = await findUnassessedPhotos(photos)
  await assessNewPhotos(unassessed_photos)
}

export async function unassessedPhotosForRestaurant(
  restaurant_id: uuid
): Promise<PhotoXref[]> {
  const photos = await resolvedWithFields(
    () =>
      query.photo_xref({
        where: {
          restaurant_id: {
            _eq: restaurant_id,
          },
          photo: {
            quality: {
              _is_null: true,
            },
          },
        },
      }),
    { relations: ['photo'] }
  )
  return photos
}

export async function unassessedPhotosForTag(
  tag_id: uuid
): Promise<PhotoXref[]> {
  const photos = await resolvedWithFields(
    () =>
      query.photo_xref({
        where: {
          tag_id: {
            _eq: tag_id,
          },
          photo: {
            quality: {
              _is_null: true,
            },
          },
        },
      }),
    { relations: ['photo'] }
  )
  return photos
}

export async function unassessedPhotosForRestaurantTag(
  restaurant_id: uuid
): Promise<PhotoXref[]> {
  const photos = await resolvedWithFields(
    () =>
      query.photo_xref({
        where: {
          restaurant_id: {
            _eq: restaurant_id,
          },
          tag_id: {
            _neq: ZeroUUID,
          },
          photo: {
            quality: {
              _is_null: true,
            },
          },
        },
      }),
    { relations: ['photo'] }
  )
  return photos
}

export async function bestPhotosForRestaurant(
  restaurant_id: uuid
): Promise<PhotoXref[]> {
  const photos = await resolvedWithFields(
    () =>
      query.photo_xref({
        where: {
          restaurant_id: {
            _eq: restaurant_id,
          },
        },
        order_by: [
          {
            photo: {
              quality: order_by.desc,
            },
          },
        ],
      }),
    { relations: ['photo'] }
  )
  return photos
}

export async function bestPhotosForTag(tag_id: uuid): Promise<PhotoXref[]> {
  const photos = await resolvedWithFields(
    () =>
      query.photo_xref({
        where: {
          tag_id: {
            _eq: tag_id,
          },
        },
        order_by: [
          {
            photo: {
              quality: order_by.desc,
            },
          },
        ],
      }),
    { relations: ['photo'] }
  )
  return photos
}

export async function bestPhotosForRestaurantTags(
  restaurant_id: uuid
): Promise<PhotoXref[]> {
  const photos = await resolvedWithFields(
    () =>
      query.photo_xref({
        where: {
          restaurant_id: {
            _eq: restaurant_id,
          },
          tag_id: {
            _neq: ZeroUUID,
          },
        },
        order_by: [
          {
            photo: {
              quality: order_by.desc,
            },
          },
        ],
      }),
    { relations: ['photo'] }
  )
  return photos
}

async function assessNewPhotos(unassessed_photos: string[]) {
  const IMAGE_QUALITY_API_BATCH_SIZE = 30
  let assessed: PhotoBase[] = []
  for (const batch of chunk(unassessed_photos, IMAGE_QUALITY_API_BATCH_SIZE)) {
    assessed.push(...(await assessPhotoQuality(batch)))
  }
  await photoBaseUpsert(assessed)
}

async function assessPhotoQuality(urls: string[]) {
  const IMAGE_QUALITY_API = 'https://image-quality.rio.dishapp.com/prediction'
  if (process.env.LOG_TIMINGS == '1') {
    console.log('Fetching Image Quality API batch...')
  }
  const response = await fetch(IMAGE_QUALITY_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(urls),
  })
  let results = await response.json()
  let photo_bases: PhotoBase[] = []
  for (const url of urls) {
    const result = results.find((r) => {
      const id = crypto.createHash('md5').update(url).digest('hex')
      return id == r.image_id
    })
    photo_bases.push({
      url,
      quality: result['mean_score_prediction'],
    })
  }
  return photo_bases
}

function proxyYelpCDN(photo: string) {
  if (typeof process.env.YELP_CDN_AWS_PROXY === undefined) {
    throw Error('SELF CRAWLER: Yelp AWS CDN proxy not set')
  }
  return photo.replace(
    'https://s3-media0.fl.yelpcdn.com/',
    //@ts-ignore
    process.env.YELP_CDN_AWS_PROXY
  )
}

async function findUnassessedPhotos(photos: PhotoXref[]): Promise<string[]> {
  let unassessed_photos: PhotoXref[] = []
  if (photos[0].restaurant_id != ZeroUUID && photos[0].tag_id == ZeroUUID) {
    unassessed_photos = await unassessedPhotosForRestaurant(
      photos[0].restaurant_id
    )
  }
  if (photos[0].restaurant_id != ZeroUUID && photos[0].tag_id != ZeroUUID) {
    unassessed_photos = await unassessedPhotosForRestaurantTag(
      photos[0].restaurant_id
    )
  }
  if (photos[0].tag_id != ZeroUUID && photos[0].restaurant_id == ZeroUUID) {
    unassessed_photos = await unassessedPhotosForTag(photos[0].tag_id)
  }
  return unassessed_photos.map((p) => {
    if (!p.photo || !p.photo.url) throw 'Photo.url NOT NULL violation'
    return p.photo.url
  })
}
