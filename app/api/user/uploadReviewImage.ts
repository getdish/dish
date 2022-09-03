import { ensureBucket, uploadMultipartFiles } from '../_s3'
import { ensureSecureRoute, getUserFromRoute } from './_user'
import { route, useRouteBodyParser } from '@dish/api'
import {
  PhotoQueryHelpers,
  PhotoXrefQueryHelpers,
  globalTagId,
  photo,
  photo_constraint,
  photo_xref,
  photo_xref_constraint,
  query,
  resolved,
} from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { selectFields } from 'gqty'
import { extname } from 'path'
import { v4 } from 'uuid'

const BUCKET_NAME = 'review-image'
ensureBucket(BUCKET_NAME)

export default route(async (req, res) => {
  try {
    await useRouteBodyParser(req, res, { raw: { limit: '62mb' } })
    await ensureSecureRoute(req, res, 'user')
    const user = await getUserFromRoute(req)
    if (!user || !user.id) {
      res.json({
        error: 'no user',
      })
      return
    }

    const { headers } = req

    // headers come lowercased
    const restaurant_slug = `${headers.restaurantslug}`
    const review_id = headers.reviewid
    const restaurant_id = restaurant_slug
      ? await resolved(
          () =>
            query.restaurant({
              where: {
                slug: {
                  _eq: restaurant_slug,
                },
              },
            })[0]?.id
        )
      : null

    const uploadResponses = await uploadMultipartFiles(req, BUCKET_NAME, (name) => {
      const extension = extname(name)
      return `${v4()}${extension}`
    })

    const failedResponse = uploadResponses.find((r) => r.httpStatusCode !== 200)
    if (failedResponse) {
      console.error(`error with upload`, { restaurant_slug, restaurant_id })
      res.status(failedResponse.httpStatusCode || 500).json({
        error: 'no files / restuarant',
      })
      return
    }

    const photos = uploadResponses.map((x) => x.url).map((url) => ({ url, user_id: user.id }))

    const insertedPhotos = await PhotoQueryHelpers.upsert(
      photos,
      photo_constraint.photo_url_key,
      {
        select: (v: photo[]) => v.map((p) => selectFields(p, '*', 1)),
      }
    )

    // set into photo_xref
    const photoXrefs = insertedPhotos.map(({ id }) => {
      return {
        user_id: user.id,
        restaurant_id,
        review_id,
        tag_id: globalTagId,
        type: 'user-review',
        photo_id: id,
      } as const
    })

    const upserted = await PhotoXrefQueryHelpers.upsert(
      photoXrefs,
      photo_xref_constraint.photos_xref_photos_id_restaurant_id_tag_id_key,
      {
        select: (v: photo_xref[]) => v.map((p) => selectFields(p, '*', 1)),
      }
    )

    // return array
    res.json(upserted)
  } catch (error) {
    console.error('error', error)
    res.status(401).json({ error })
  }
})
