import { exec } from 'child_process'

import express from 'express'
import fetch from 'node-fetch'

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 6154
const GORSE_ENDPOINT = process.env.GORSE_ENDPOINT || 'http://gorse:9000'
const dev_root = './src'
const docker_root = '/app/services/dish-hooks/src'
const ROOT = process.env.DISH_ENV == 'production' ? docker_root : dev_root

type GorseFeedback = {
  UserId: string
  ItemId: string
  Feedback: number
}

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
    throw new Error(
      'Gorse response error: ' + error.message + ' for response: ' + result
    )
  }
  return result
}

function shell(cmd: string) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error)
        return reject(error)
      }
      return resolve(stdout ? stdout : stderr)
    })
  })
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
    const args = `'${payload.photo_url}' ${payload.photo_id} ${payload.content_type}`
    const result = await shell(`${ROOT}/do_image_upload.sh ${args}`)
    console.log(result)
    res.send('OK')
  } catch (error) {
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
