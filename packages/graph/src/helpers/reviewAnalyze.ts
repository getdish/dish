import { Auth } from '../Auth'
import { ORIGIN } from '../constants'

export async function reviewAnalyze({
  restaurantId,
  text,
}: {
  text: string
  restaurantId: string
}) {
  const response = await fetch(ORIGIN + '/review/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Auth.jwt,
    },
    body: JSON.stringify({
      restaurant_id: restaurantId,
      text,
    }),
  })
  const res = await response.text()
  return JSON.parse(res)
  // t.deepEqual(res.sentences, [
  //   {
  //     score: 0.9998608827590942,
  //     sentence: 'Test tag is amazing',
  //     tags: ['Test tag'],
  //   },
  // ])
}
