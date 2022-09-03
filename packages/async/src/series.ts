import { cancelPromise } from './cancellablePromise'
import { sleep } from './sleep'

// sanity check types
// series([
//   () => Promise.resolve(1),
//   (x) => x,
//   (y) => y.charAt(0),
//   // (z) => z,
// ])

type AsyncFlowFn<A = any, B = any> = (arg?: A extends Promise<infer X> ? X : A) => B
type AsyncFlowReturn = {
  (): void
  value(): any
}

type SeriesOptions = { signal: AbortSignal }

// prettier-ignore
export function series<A, B>(fns: [AsyncFlowFn<A, B>, AsyncFlowFn<B, any>], options?: SeriesOptions): AsyncFlowReturn
// prettier-ignore
export function series<A, B, C>(fns: [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, any>], options?: SeriesOptions): AsyncFlowReturn
// prettier-ignore
export function series<A, B, C, D>(fns: [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, D>, AsyncFlowFn<D, any>], options?: SeriesOptions): AsyncFlowReturn
// prettier-ignore
export function series<A, B, C, D, E>(fns: [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, D>, AsyncFlowFn<D, E>, AsyncFlowFn<E, any>], options?: SeriesOptions): AsyncFlowReturn

export function series(fns: (Function | ((x?: any) => any))[], options?: SeriesOptions) {
  let current: any
  let cancelled = false
  let val: any

  async function run() {
    if (options?.signal.aborted) {
      return
    }
    for (const fn of fns) {
      if (cancelled) return
      current = fn(val)
      if (current instanceof Promise) {
        val = await current
      } else {
        val = current
      }
    }
  }

  run()

  function cancel() {
    cancelled = true
    cancelPromise(current)
  }

  cancel.value = () => val
  return cancel
}

// simple sanity test
if (process.env.NODE_ENV === 'development') {
  const cancel = series([
    () => sleep(1000),
    () => {
      throw new Error('Should not reach')
    },
  ])
  setTimeout(() => {
    cancel()
  })
}
