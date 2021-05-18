export * from './constants'
export * from './assertHelpers'
export * from './reduce'
export * from './fetchBertSentiment'
export * from './doesStringContainTag'

export const stringify = (a: any) => JSON.stringify(a)

export const timer = () => {
  let last = Date.now()
  return (name: string, min?: number) => {
    const next = Date.now()
    const t = next - last
    last = next
    if (!min || t > min) {
      console.log(` - (${t}ms) ${name}`)
      return t
    }
  }
}

export const allSettledFirstFulfilled = async <A, B extends Promise<A> = Promise<A>>(
  args: B[]
): Promise<A | undefined> => {
  const res = await Promise.allSettled(args)
  // @ts-expect-error
  return res.flatMap((x) => (x.status === 'fulfilled' ? x.value : []))[0]
}

export const log = (val: any) => {
  console.log(val)
  return val
}

export function ellipseText(
  str: string,
  { maxLength = 100, ellipse = '…' }: { maxLength?: number; ellipse?: string } = {}
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

export function isPresent<T extends Object>(input: null | undefined | T): input is T {
  return input != null
}

export function breakIntoSentences(text: string) {
  return text.match(/[^\.!\?]+[\.!\?]+/g) || [text]
}
