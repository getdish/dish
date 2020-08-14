import express from 'express'
import fetch from 'node-fetch'
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 6154
const GORSE_ENDPOINT = process.env.GORSE_ENDPOINT || 'http://gorse:9000'

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

app.post('*', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Dish Hooks server started at http://localhost:${PORT}`)
})
