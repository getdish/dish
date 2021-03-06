// WARNING:
// This function is used by both the front and backend. It is critical to our
// entire scoring system. Any changes to it could potentially alter the scores
// for all restaurants and rishes.

type Sentiment = {
  positive: boolean
}

export async function fetchBertSentiment(sentence: string): Promise<Sentiment> {
  const url = `https://bert.dishapp.com/predict`
  return fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([sentence]),
  }).then((res) => res.json())
}

export function bertResultToNumber({ positive }: Sentiment) {
  return positive ? 1 : -1
}

export async function fetchBertSentimentNumber(text: string) {
  const result = await fetchBertSentiment(text)
  const number = bertResultToNumber(result.result[0])
  return number
}
