// WARNING:
// This function is used by both the front and backend. It is critical to our
// entire scoring system. Any changes to it could potentially alter the scores
// for all restaurants and rishes.

export async function fetchBertSentiment(sentence: string) {
  const url = `https://bert-staging.dishapp.com/?text=${encodeURIComponent(
    sentence
  )}`
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((x) => x)
}

export function bertResultToNumber(bert_sentiment: [string, number]) {
  const confidence = bert_sentiment[1]
  switch (bert_sentiment[0]) {
    case 'Positive':
      return 1 * confidence
    case 'Negative':
      return -1 * confidence
    default:
      return 0
  }
}

export async function fetchBertSentimentNumber(text: string) {
  const result = await fetchBertSentiment(text)
  const number = bertResultToNumber(result.result[0])
  return number
}
