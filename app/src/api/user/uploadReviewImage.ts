import { route, runMiddleware, useRouteBodyParser } from '@dish/api'
import {
  PhotoXrefQuery,
  PhotoXrefQueryHelpers,
  globalTagId,
  photo_xref_constraint,
} from '@dish/graph'
import { isPresent } from '@dish/helpers'

import { createMulterUploader, ensureBucket } from './_multerUploader'
import { ensureSecureRoute, getUserFromRoute } from './_user'

const BUCKET_NAME = 'review-images'
ensureBucket(BUCKET_NAME)
const upload = createMulterUploader(BUCKET_NAME).array('review-images', 1)

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

    const { files, params } = req

    if (!Array.isArray(files) || !files.length || !params.restuarant_id) {
      res.status(500).json({
        error: 'no files / restuarant',
      })
      return
    }

    // set into photo_xref
    const photoXrefs = files
      .map((x) => x['location'])
      .filter(isPresent)
      .map((url) => {
        return {
          restaurant_id: params.restuarant_id,
          tag_id: globalTagId,
          type: 'user-review',
          photo: { url },
        } as PhotoXrefQuery
      })

    const upserted = await PhotoXrefQueryHelpers.upsert(
      photoXrefs,
      photo_xref_constraint.photos_xref_photos_id_restaurant_id_tag_id_key,
      {
        select: (x: PhotoXrefQuery[]) => x.map((x) => x.photo.url),
      }
    )

    // return array
    res.json(upserted)
  } catch (error) {
    console.error('error', error)
    res.status(401).json({ error })
  }
})
