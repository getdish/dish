import './polyfill-localStorage'

import { Tag } from '@dish/graph'

export * from './constants'
export * from './assertHelpers'

export const stringify = (a: any) => JSON.stringify(a)

export function ellipseText(
  str: string,
  { maxLength = 100, ellipse = '…' }: { maxLength?: number; ellipse?: string }
) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 1) + ellipse
  }
  return str
}

export function hasProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop)
}

export function isPresent<T extends Object>(
  input: null | undefined | T
): input is T {
  return input != null
}

// WARNING:
// This function is used by both the front and backend. It is critical to our
// entire scoring system. Any changes to it could potentially alter the scores
// for all restaurants and rishes.
export async function fetchBertSentiment(sentence: string) {
  return fetch(
    `https://bert.k8s.dishapp.com/?text="${encodeURIComponent(sentence)}"`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((res) => res.json())
    .then((x) => x)
}

export function bertResultToNumber(bert_sentiment: [string, number]) {
  const score = bert_sentiment[1]
  switch (bert_sentiment[0]) {
    case 'Positive':
      return 1 * score
    case 'Negative':
      return -1 * score
    default:
      return 0
  }
}

export async function fetchBertSentimentNumber(text: string) {
  const result = await fetchBertSentiment(text)
  const number = bertResultToNumber(result.result[0])
  return number
}

export function doesStringContainTag(text: string, tag: Tag) {
  const tag_names = [tag.name, ...(tag.alternates || [])]
  for (const tag_name of tag_names) {
    const regex = new RegExp(`\\b${tag_name}\\b`, 'i')
    const is_found = regex.test(text)
    if (is_found) return true
  }
  return false
}

export function breakIntoSentences(text: string) {
  return text.match(/[^\.!\?]+[\.!\?]+/g) || [text]
}
