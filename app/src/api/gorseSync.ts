import { route } from '@dish/api'

const GORSE_ENDPOINT = process.env.GORSE_ENDPOINT || 'http://gorse:9000'

type GorseFeedback = {
  UserId: string
  ItemId: string
  Feedback: number
}

export default route(async (req, res) => {
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
