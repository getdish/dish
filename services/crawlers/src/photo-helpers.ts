import '@dish/common'

import crypto from 'crypto'

import { sleep } from '@dish/async'
import { sentryException, sentryMessage } from '@dish/common'
import {
  PhotoBase,
  PhotoXref,
  ZeroUUID,
  createQueryHelpersFor,
  deleteByIDs,
  globalTagId,
  order_by,
  photo,
  photo_constraint,
  photo_xref,
  photo_xref_constraint,
  photo_xref_select_column,
  query,
  resolvedWithFields,
  uuid,
} from '@dish/graph'
import { selectFields } from 'gqless'
import { chunk, clone, uniqBy } from 'lodash'
import fetch, { Response } from 'node-fetch'

import { DB } from './utils'

const PhotoBaseQueryHelpers = createQueryHelpersFor<PhotoBase>('photo')
const PhotoXrefQueryHelpers = createQueryHelpersFor<PhotoXref>('photo_xref')
const photoBaseUpsert = PhotoBaseQueryHelpers.upsert
export const photoXrefUpsert = PhotoXrefQueryHelpers.upsert

const selectBasePhotoXrefFields = {
  select: (v: photo_xref[]) => {
    return v.map((p) => {
      return {
        ...selectFields(p, '*', 2),
      }
    })
  },
}

export const DO_BASE = 'https://dish-images.sfo2.digitaloceanspaces.com/'

const prod_hooks_endpoint = 'https://hooks.dishapp.com'
const dev_hooks_endpoint = 'http://localhost:6154'
const DISH_HOOKS_ENDPOINT =
  process.env.DISH_ENV == 'production'
    ? prod_hooks_endpoint
    : dev_hooks_endpoint

export async function photoUpsert(photosOg: Partial<PhotoXref>[]) {
  if (photosOg.length == 0) return
  const photos = normalizePhotos(photosOg)
  await photoXrefUpsert(photos)
  await postUpsert(photos)
}

function normalizePhotos(photos: Partial<PhotoXref>[]) {
  let next = [...photos]
  if (next[0].restaurant_id && !next[0].tag_id) {
    next.map((p) => (p.tag_id = ZeroUUID))
  }
  if (next[0].tag_id && !next[0].restaurant_id) {
    next.map((p) => (p.restaurant_id = ZeroUUID))
  }
  next = uniqBy(next, (el) =>
    [el.tag_id, el.restaurant_id, el.photo?.url].join()
  )
  return next.map((p) => {
    if (!p.photo || !p.photo.url) {
      throw 'Photo must have URL'
    }
    p.photo.origin = p.photo?.url
    return p
  })
}

async function postUpsert(photos: Partial<PhotoXref>[]) {
  if (process.env.NODE_ENV != 'test') {
    await uploadToDO(photos)
  }
  await updatePhotoQualityAndCategories(photos)
}

export async function uploadToDO(photos: Partial<PhotoXref>[]) {
  const not_uploaded = await findNotUploadedPhotos(photos)
  if (!not_uploaded) return
  const uploaded = await uploadToDOSpaces(not_uploaded)
  const updated = uploaded.map((p) => {
    if (!p.photo) throw 'uploadToDO() No photo!?'
    return {
      id: p.photo.id,
      url: DO_BASE + p.photo_id,
    } as PhotoBase
  })
  await photoBaseUpsert(updated, photo_constraint.photos_pkey)
}

export async function updatePhotoQualityAndCategories(
  photos: Partial<PhotoXref>[]
) {
  const unassessed_photos = await findUnassessedPhotos(photos)
  await assessNewPhotos(unassessed_photos)
}

async function findNotUploadedRestaurantPhotos(
  restaurant_id: uuid
): Promise<PhotoXref[]> {
  const photos = await resolvedWithFields(() => {
    const d = query.photo_xref({
      where: {
        _or: [
          {
            restaurant_id: {
              _eq: restaurant_id,
            },
            photo: {
              url: {
                _nlike: '%digitalocean%',
              },
            },
          },
          {
            restaurant_id: {
              _eq: restaurant_id,
            },
            photo: {
              url: {
                _is_null: true,
              },
            },
          },
        ],
      },
      distinct_on: [photo_xref_select_column.photo_id],
    })

    return d
  }, selectBasePhotoXrefFields)
  return photos
}

export async function findNotUploadedTagPhotos(
  tag_id: uuid
): Promise<PhotoXref[]> {
  const photos = await resolvedWithFields(
    () =>
      query.photo_xref({
        where: {
          _or: [
            {
              tag_id: {
                _eq: tag_id,
              },
              photo: {
                url: {
                  _nlike: '%digitalocean%',
                },
              },
            },
            {
              tag_id: {
                _eq: tag_id,
              },
              photo: {
                url: {
                  _is_null: true,
                },
              },
            },
          ],
        },
        distinct_on: [photo_xref_select_column.photo_id],
      }),
    selectBasePhotoXrefFields
  )
  return photos
}

async function unassessedPhotosForRestaurant(
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
        distinct_on: [photo_xref_select_column.photo_id],
      }),
    selectBasePhotoXrefFields
  )
  return photos
}

async function unassessedPhotosForTag(tag_id: uuid): Promise<PhotoXref[]> {
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
        distinct_on: [photo_xref_select_column.photo_id],
      }),
    selectBasePhotoXrefFields
  )
  return photos
}

async function unassessedPhotosForRestaurantTag(
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
        distinct_on: [photo_xref_select_column.photo_id],
      }),
    {
      select: (v: photo_xref[]) => {
        return v.map((p) => {
          const d = {
            ...selectFields(p, '*', 2),
          }
          return d
        })
      },
    }
  )

  return photos
}

export async function bestPhotosForRestaurant(
  restaurant_id: uuid
): Promise<PhotoXref[]> {
  const TOP_FRACTION_CUTOFF = process.env.NODE_ENV == 'test' ? 1 : 0.2
  const result = await DB.one_query_on_main(`
    SELECT json_agg(j1) FROM (
      SELECT * FROM (
        SELECT
          *,
          (
            SELECT json_agg(j2) FROM (
              SELECT * FROM photo WHERE photo.id = photo_id LIMIT 1
            ) j2
          )->>0 AS photo,
          percent_rank() OVER (ORDER BY photo.quality DESC NULLS LAST) AS rank_by_percent
          FROM photo_xref
          JOIN photo ON photo_xref.photo_id = photo.id
            WHERE photo_xref.restaurant_id = '${restaurant_id}'
      ) s
      WHERE rank_by_percent <= ${TOP_FRACTION_CUTOFF}
      ORDER by random()
      LIMIT 50
    ) j1;
  `)
  const agg = result.rows[0].json_agg ?? []
  const photos = agg.map((p) => {
    p.photo = JSON.parse(p.photo)
    return p
  })
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
        limit: 10,
      }),
    selectBasePhotoXrefFields
  )
  return uniqBy(photos, (p) => p.photo_id)
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
        limit: 10,
      }),
    selectBasePhotoXrefFields
  )
  return uniqBy(photos, (p) => p.photo_id)
}

const IMAGE_QUALITY_API_BATCH_SIZE = 10

async function assessNewPhotos(unassessed_photos: string[]) {
  let assessed: Partial<PhotoBase>[] = []
  for (const batch of chunk(unassessed_photos, IMAGE_QUALITY_API_BATCH_SIZE)) {
    assessed.push(...(await assessPhoto(batch)))
  }
  await photoBaseUpsert(assessed, photo_constraint.photo_url_key)
}

async function assessPhoto(urls: string[]) {
  const MAX_RETRIES = 3
  let retries = 0
  while (true) {
    try {
      return await assessPhotoWithoutRetries(urls)
    } catch (error) {
      console.log(error.message, 'on urls', urls, error.stack)
      if (!error.message.includes('json')) {
        throw error
      }
      retries += 1
      if (retries > MAX_RETRIES) {
        sentryMessage(
          MAX_RETRIES + ' failed attempts requesting image quality',
          urls
        )
        return []
      }
      console.log('Retrying Image Quality API')
      await sleep(1000 * retries)
    }
  }
}

// gets quality + categories
async function assessPhotoWithoutRetries(urls: string[]) {
  if (process.env.DISH_DEBUG) {
    // prettier-ignore
    console.log('Fetching Image Quality API batch...', urls.length, 'first:', urls[0])
  }
  const [imageQualities, imageCategories] = await Promise.all([
    getImageQuality(urls),
    getImageCategory(urls),
  ])
  const res: Partial<PhotoBase>[] = []
  for (const url of urls) {
    const id = crypto.createHash('md5').update(url).digest('hex')
    const quality = imageQualities.find((r) => id == r.image_id)
      ?.mean_score_prediction
    const categories = imageCategories.find((x) => x.url === url)?.categories
    if (!quality || !categories) {
      console.warn('No result found!')
      continue
    }
    res.push({
      url,
      quality,
      categories,
    })
  }
  return res
}

async function getImageCategory(
  urls: string[]
): Promise<
  { url: string; categories: { label: string; probability: number }[] }[]
> {
  const IMAGE_CATEGORY_API = 'https://dish-image-recognize.fly.dev/recognize'
  // lets do serially to not overload the memory of image-recognize
  return Promise.all(
    urls.map(async (url) => {
      const body = await fetch(url).then((res) => res.buffer())
      const response = await fetch(IMAGE_CATEGORY_API, {
        method: 'POST',
        body,
      }).then((res) => res.json())
      return {
        categories: response.labels,
        url,
      }
    })
  )
}

async function getImageQuality(
  urls: string[]
): Promise<{ mean_score_prediction: number; image_id: string }[]> {
  const IMAGE_QUALITY_API = 'https://image-quality.dishapp.com/prediction'
  const qualityResponse = await fetch(IMAGE_QUALITY_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(urls),
  })
  return await qualityResponse.json()
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

async function findUnassessedPhotos(
  photos: Partial<PhotoXref>[]
): Promise<string[]> {
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
  return unassessed_photos
    .filter((p) => {
      if (!p.photo?.url) {
        console.error('findUnassessedPhotos(): Photo.url NOT NULL violation')
        return false
      }
      return true
    })
    .map((p) => p.photo.url!)
}

async function findNotUploadedPhotos(photos: Partial<PhotoXref>[]) {
  let not_uploaded: PhotoXref[] = []
  if (photos[0].restaurant_id != ZeroUUID && photos[0].tag_id == ZeroUUID) {
    not_uploaded = await findNotUploadedRestaurantPhotos(
      photos[0].restaurant_id
    )
  }
  if (photos[0].restaurant_id != ZeroUUID && photos[0].tag_id != ZeroUUID) {
    not_uploaded = await findNotUploadedRestaurantPhotos(
      photos[0].restaurant_id
    )
  }
  if (photos[0].tag_id != ZeroUUID && photos[0].restaurant_id == ZeroUUID) {
    not_uploaded = await findNotUploadedTagPhotos(photos[0].tag_id)
  }
  return not_uploaded
}

async function uploadToDOSpaces(photos: PhotoXref[]) {
  const DO_SPACES_UPLOAD_BATCH_SIZE = 50
  let uploaded: PhotoXref[] = []
  for (const batch of chunk(photos, DO_SPACES_UPLOAD_BATCH_SIZE)) {
    uploaded.push(...(await uploadToDOSpacesBatch(batch)))
  }
  return uploaded
}

async function uploadToDOSpacesBatch(photos: PhotoXref[]) {
  console.log('Uploading images to DO Spaces...')
  let failed_ids = await Promise.all(
    photos.map(async (p) => {
      if (!p.photo || !p.photo.origin) {
        console.error('DO UPLOADER: Photo must have URL: ' + p)
        return p.photo?.id
      }
      return sendToDO(p.photo.origin, p.photo.id)
    })
  )
  failed_ids = failed_ids.filter(Boolean)
  await deleteByIDs('photo', failed_ids)
  const uploaded = photos.filter((p) => {
    return !failed_ids.includes(p.id)
  })
  console.log(
    `... ${uploaded.length} (${failed_ids.length} failed) images uploaded DO Spaces.`
  )
  return uploaded
}

export async function sendToDO(url: string, id: string) {
  url = proxyYelpCDN(url)
  let response: Response
  try {
    response = await fetch(url, { method: 'HEAD' })
  } catch (e) {
    sentryMessage('Failed downloading image HEAD', { url })
    return id
  }
  const mime_type = response.headers.get('content-type')

  while (true) {
    let retries = 1
    const result = await doPut(url, id, mime_type || 'application/json')
    const status = result.status
    if (status < 300) {
      return
    }
    if (status > 299 && status != 408) {
      return id
    }
    if (status == 408) retries += 1
    if (retries > 10) {
      sentryException(new Error('DO Spaces PUT Rate Limit'), {
        url: url,
        id: id,
      })
      return id
    }
  }
}

async function doPut(url: string, id: uuid, content_type: string) {
  const uploadUrl = DISH_HOOKS_ENDPOINT + '/do_image_upload'
  const result = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      photo_id: id,
      photo_url: url,
      content_type,
    }),
  })
  console.log(
    'Dish hook do_image_upload response: ',
    result.status,
    await result.text(),
    url
  )
  return result
}

export async function findHeroImage(restaurant_id: uuid) {
  return await PhotoXrefQueryHelpers.findOne(
    {
      restaurant_id,
      type: 'hero',
    },
    selectBasePhotoXrefFields
  )
}

export async function uploadHeroImage(url: string, restaurant_id: uuid) {
  const existing = await findHeroImage(restaurant_id)
  const do_url = DO_BASE + restaurant_id
  let shouldUpdate = false
  if (existing) {
    if (!existing.photo?.origin) {
      shouldUpdate = true
      // delete previous before insert to avoid constraint
      await PhotoXrefQueryHelpers.delete({
        id: existing.id,
      })
    } else if (existing.photo?.origin != url) {
      shouldUpdate = true
    }
  }
  if (!existing || shouldUpdate) {
    const failed_id = await sendToDO(url, restaurant_id)
    if (failed_id) return
    const existingPhoto = await PhotoBaseQueryHelpers.findOne({ url })
    console.log('Setting new hero image', url, restaurant_id, existingPhoto)
    const photo =
      existingPhoto ||
      (
        await PhotoBaseQueryHelpers.upsert(
          [
            {
              origin: url,
              url: do_url,
            },
          ],
          photo_constraint.photo_url_key
        )
      )?.[0]

    await photoXrefUpsert([
      {
        restaurant_id,
        tag_id: globalTagId,
        type: 'hero',
        photo,
      },
    ])
  }
  return do_url
}
