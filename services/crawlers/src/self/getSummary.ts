import { SUMMARIZER_API } from '@dish/graph'

export async function getSummary(of: string) {
  const request: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: of,
  }
  if (process.env.DISH_DEBUG) {
    console.log('getting summary...', of)
  }
  const result = await fetch(`${SUMMARIZER_API}?ratio=0.1`, request)
  const response = await result.json()
  if (process.env.DISH_DEBUG) {
    console.log('...summarized: ', response.summary)
  }
  return response.summary
}
