export * from 'tslib'

export function hasProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop)
}

export class AssertionError extends Error {}
export class NullError extends AssertionError {}

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
      console.log('assert failed', err)
    }
    return
  }
  throw err
}
