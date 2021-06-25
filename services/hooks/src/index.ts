import AWS from 'aws-sdk'
import express from 'express'
import fetch from 'node-fetch'

const s3 = new AWS.S3({
  endpoint: 'sfo2.digitaloceanspaces.com',
  accessKeyId: process.env.DO_SPACES_ID,
  secretAccessKey: process.env.DO_SPACES_SECRET,
})

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 6154
const GORSE_ENDPOINT = process.env.GORSE_ENDPOINT || 'http://gorse:9000'
const dev_root = './src'
const docker_root = '/app/services/hooks/src'
const ROOT = process.env.DISH_ENV == 'production' ? docker_root : dev_root

type GorseFeedback = {
  UserId: string
  ItemId: string
  Feedback: number
}

process.on('beforeExit', (code) => {
  console.log('exiting with code', code)
})

async function putFeedback(feedback: GorseFeedback) {
  const response = await fetch(GORSE_ENDPOINT + '/feedback', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([feedback]),
  })
  let result = await response.text()
  try {
    result = JSON.parse(result)
  } catch (error) {
    throw new Error('Gorse response error: ' + error.message + ' for response: ' + result)
  }
  return result
}

app.post('/gorse_sync', async (req, res) => {
  try {
    const payload = req.body
    if (payload.trigger.name == 'gorse_sync') {
      const review = payload.event.data.new
      const gorse_response = await putFeedback({
        UserId: review.username,
        ItemId: review.restaurant_id,
        Feedback: review.rating,
      })
      res.json({
        message: 'Review sent to Gorse',
        gorse: gorse_response,
      })
    } else {
      res.json({
        message: 'Nothing sent to Gorse',
      })
    }
  } catch (error) {
    res.send('Error: ' + error.message)
  }
})

app.post('/do_image_upload', async (req, res) => {
  try {
    const payload = req.body
    // const args = `'${payload.photo_url}' ${payload.photo_id} ${payload.content_type}`
    const contents = await fetch(payload.photo_url).then((res) => res.buffer())
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
    // const result = await shell(`${ROOT}/do_image_upload.sh ${args}`)
    // console.log(result)
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

app.listen(PORT, () => {
  console.log(`Dish Hooks server started at http://localhost:${PORT}`)
})
