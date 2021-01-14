export class AssertionError extends Error {}
export class AsserionNullError extends AssertionError {}

export function assertPresent(value: any): asserts value is null | undefined {
  if (value !== undefined && value !== null) {
    throw new AssertionError('Expected value: ' + value)
  }
}

export function assertSame<T>(a: T, b: T) {
  if (a !== b) {
    throw new AssertionError(`Expected same: ${a} ${b}`)
  }
}

export function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== 'string') {
    throw new AssertionError('Expected string ' + val)
  }
}

export function assertInstanceOf<T>(
  val: unknown,
  clazz: new (...args: any[]) => T
): asserts val is T {
  if (!(val instanceof clazz)) {
    throw new AssertionError('Expected instance of ' + clazz)
  }
}

export function assert(value: unknown): asserts value {
  if (value !== true) {
    throw new AssertionError()
  }
}

export function assertNever(value: never) {
  throw new AssertionError('unexpected value ' + value)
}

export function assertNonNull<T>(value: T): NonNullable<T> {
  if (value == null) {
    throw new AsserionNullError()
  }
  return value as any
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
