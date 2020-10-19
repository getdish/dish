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
  const url = `https://bert.k8s.dishapp.com/?text=${encodeURIComponent(
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
  if (confidence < 0.9) return 0
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

export function doesStringContainTag(text: string, tag: Tag) {
  const tag_names = [tag.name, ...(tag.alternates || [])]
  for (const tag_name of tag_names) {
    let is_found = false
    try {
      const regex = new RegExp(`\\b${tag_name}\\b`, 'i')
      is_found = regex.test(text)
    } catch (e) {
      console.log('Tag has bad characters for regex: ' + tag_name, tag.id)
      console.error(e)
      return false
    }
    if (is_found) return true
  }
  return false
}

export function breakIntoSentences(text: string) {
  return text.match(/[^\.!\?]+[\.!\?]+/g) || [text]
}
