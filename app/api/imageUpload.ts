import { route } from '@dish/api'
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  endpoint: 'sfo2.digitaloceanspaces.com',
  accessKeyId: process.env.DO_SPACES_ID,
  secretAccessKey: process.env.DO_SPACES_SECRET,
})

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
    await new Promise((res, rej) => {
      s3.upload(
        {
          Bucket: 'dish-images',
          Body: contents,
          Key: payload.photo_id,
          ACL: 'public-read',
          ContentType: payload.content_type,
        },
        {},
        (err, data) => {
          if (err) {
            return rej(err)
          }
          res(data)
        }
      )
    })
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
