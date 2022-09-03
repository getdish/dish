import { ensureBucket, uploadMultipartFiles } from '../_s3'
import { ensureSecureRoute, getUserFromRoute } from './_user'
import { route, useRouteBodyParser } from '@dish/api'
import { userUpdate } from '@dish/graph'
import { extname } from 'path'
import { v4 } from 'uuid'

const BUCKET_NAME = 'user-images'
ensureBucket(BUCKET_NAME)

export default route(async (req, res) => {
  await useRouteBodyParser(req, res, { raw: { limit: '20000mb' } })
  await ensureSecureRoute(req, res, 'user')
  const user = await getUserFromRoute(req)
  if (!user) {
    res.json({
      error: 'no user',
    })
    return
  }

  const uploadResponses = await uploadMultipartFiles(req, BUCKET_NAME, (name) => {
    const extension = extname(name)
    return `${v4()}${extension}`
  })
  const avatar = uploadResponses[0]?.url
  const failedResponse = uploadResponses.find((r) => r.httpStatusCode !== 200)

  if (!avatar || failedResponse) {
    res.status(failedResponse?.httpStatusCode || 500).json({
      error: 'no files / restuarant',
    })
    return
  }

  await userUpdate({
    id: user.id,
    avatar,
  })

  res.json({
    avatar,
  })
})
