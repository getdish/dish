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
  if (photos[0].restaurant_id) {
    constraint = photos_constraint.photos_restaurant_id_url_key
  }
  if (photos[0].tag_id) {
    constraint = photos_constraint.photos_tag_id_url_key
  }
  if (!constraint) throw 'SELF CRAWLER: No constraint for photos'
  await _photosUpsert(photos, constraint)
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

export async function bestPhotosTag(tag_id: uuid): Promise<Photos[]> {
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
