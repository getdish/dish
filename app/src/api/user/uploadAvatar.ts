import { route, runMiddleware, useRouteBodyParser } from '@dish/api'
import { userUpdate } from '@dish/graph'

import { createMulterUploader, ensureBucket } from './_multerUploader'
import { ensureSecureRoute, getUserFromRoute } from './_user'

const BUCKET_NAME = 'user-images'
ensureBucket(BUCKET_NAME)
const upload = createMulterUploader(BUCKET_NAME).array('avatar', 1)

export default route(async (req, res) => {
  // try {
  await useRouteBodyParser(req, res, { raw: { limit: '20000mb' } })
  await runMiddleware(req, res, upload)
  await ensureSecureRoute(req, res, 'user')
  const user = await getUserFromRoute(req)
  if (!user) {
    res.json({
      error: 'no user',
    })
    return
  }

  const { files } = req
  if (!Array.isArray(files) || !files.length) {
    res.status(500).json({
      error: 'no files',
    })
    return
  }
  const [file] = files
  const avatar = file['location']
  await userUpdate({
    id: user.id,
    avatar,
  })
  res.json({
    avatar,
  })
  // } catch (error) {
  //   console.error('error', error.message, error.stack)
  //   res.status(401).json({ error })
  // }
})
