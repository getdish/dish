import { s3 } from './_s3'
import { Upload } from '@aws-sdk/lib-storage'
import { route } from '@dish/api'

export default route(async (req, res) => {
  try {
    const payload = req.body
    if (!payload) {
      res.status(500)
      console.error('no body', req.body, req.path, req.params, req.headers)
      res.send(`No body sent on request`)
      return
    }
    const contents = await fetch(payload.photo_url).then((res) => res.blob())
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: 'dish-images',
        Body: contents,
        Key: payload.photo_id,
        ACL: 'public-read',
        ContentType: payload.content_type,
      },
    })
    await upload.done()
    console.log('Uploaded', payload.photo_id)
    res.send('OK')
  } catch (error) {
    console.error(error.message, error.stack)
    if (error.message.includes('rate')) {
      res.status(408)
      res.send('Digital Ocean Spaces rate limit')
    } else {
      res.status(400)
      res.send('Error: ' + error.message)
    }
  }
})
