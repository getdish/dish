import './polyfill-localStorage'

export * from './constants'

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

export class AssertionError extends Error {}
export class NullError extends AssertionError {}

export function isPresent<T extends Object>(
  input: null | undefined | T
): input is T {
  return input != null
}

export function assertNonNull<T>(value: T): NonNullable<T> {
  if (value == null) {
    throw new NullError()
  }
  return value as any
}

export function assert(value: unknown): asserts value {
  if (value !== true) {
    throw new AssertionError()
  }
}

export function handleAssertionError(err: any) {
  if (err instanceof AssertionError) {
    if (process.env.DEBUG || process.env.DEBUG_ASSERT) {
      if (+(process.env.DEBUG ?? 0) > 1) {
        console.log('assert failed', err)
      } else {
        console.log('assert failed')
      }
    }
    return
  }
  throw err
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
