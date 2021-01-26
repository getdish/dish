export class AssertionError extends Error {}
export class AsserionNullError extends AssertionError {}

export type NonNullish = string | number | boolean | symbol | bigint | object

type AssertOpts = { onAssertFail?: (why?: string) => any }
let assertConfig: AssertOpts = {}
export function configureAssertHelpers(opts: AssertOpts) {
  assertConfig = opts
}

function logAssert(why?: string) {
  assertConfig.onAssertFail?.(why)
}

export function assertPresent(
  value: any,
  why?: string
): asserts value is NonNullish {
  if (value == undefined || value == null) {
    logAssert(why)
    throw new AssertionError(`Expected ${why ?? 'value: ' + value}`)
  }
}

export function assertSame<T>(a: T, b: T) {
  if (a !== b) {
    throw new AssertionError(`Expected same: ${a} ${b}`)
  }
}

export function assertIsString(
  val: unknown,
  why?: string
): asserts val is string {
  if (typeof val !== 'string') {
    logAssert(why)
    throw new AssertionError(`Expected ${why ?? 'string ' + val}`)
  }
}

export function assertInstanceOf<T>(
  val: unknown,
  clazz: new (...args: any[]) => T,
  why?: string
): asserts val is T {
  if (!(val instanceof clazz)) {
    logAssert(why)
    throw new AssertionError(`Expected ${why ?? `instance of ${clazz}`}`)
  }
}

export function assert(value: unknown, why?: string): asserts value {
  if (value !== true) {
    logAssert(why)
    throw new AssertionError(why)
  }
}

export function assertNever(value: never, why?: string) {
  logAssert(why)
  throw new AssertionError('unexpected value ' + value)
}

export function assertNonNull<T>(value: T, why?: string): NonNullable<T> {
  if (value == null) {
    logAssert(why)
    throw new AsserionNullError(why)
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
