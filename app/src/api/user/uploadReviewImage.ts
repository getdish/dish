import { route, runMiddleware, useRouteBodyParser } from '@dish/api'
import {
  PhotoQueryHelpers,
  PhotoXrefQuery,
  PhotoXrefQueryHelpers,
  globalTagId,
  photo,
  photo_constraint,
  photo_xref,
  photo_xref_constraint,
} from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { selectFields } from 'gqty'

import { createMulterUploader, ensureBucket } from './_multerUploader'
import { ensureSecureRoute, getUserFromRoute } from './_user'

const BUCKET_NAME = 'review-image'
ensureBucket(BUCKET_NAME)
const upload = createMulterUploader(BUCKET_NAME).array(BUCKET_NAME, 1)

export default route(async (req, res) => {
  try {
    await useRouteBodyParser(req, res, { raw: { limit: '62mb' } })
    await ensureSecureRoute(req, res, 'user')
    await runMiddleware(req, res, upload)
    const user = await getUserFromRoute(req)
    if (!user) {
      res.json({
        error: 'no user',
      })
      return
    }

    const { files, headers } = req

    if (!Array.isArray(files) || !files.length || !headers.restaurantid || !user.id) {
      res.status(500).json({
        error: 'no files / restuarant',
      })
      return
    }

    const photos = files
      .map((x) => x['location'])
      .filter(isPresent)
      .map((url) => ({ url, user_id: user.id }))

    const insertedPhotos = await PhotoQueryHelpers.upsert(photos, photo_constraint.photo_url_key, {
      select: (v: photo[]) => v.map((p) => selectFields(p, '*', 1)),
    })

    // set into photo_xref
    const photoXrefs = insertedPhotos.map(({ id }) => {
      return {
        user_id: user.id,
        restaurant_id: headers.restaurantid,
        review_id: headers.reviewid,
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
