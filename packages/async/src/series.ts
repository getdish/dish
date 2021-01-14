import { cancelPromise } from './cancellablePromise'
import { sleep } from './sleep'

// type AsyncFlowFn<A = any, B = any> = ((arg?: A extends Promise<infer X> ? X : A) => B)
// type AsyncFlowReturn = {
//   (): void;
//   value(): any;
// }

// prettier-ignore
// type AsyncFlow<A, B, C, D, E, F, G, H> =

// | AsyncFlowFn[]

// // sanity check
// series([
//   () => Promise.resolve(1),
//   (x) => x,
//   (y) => y.charAt(0),
//   // (z) => z,
// ])

//   | [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, D>]
//   | [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, D>, AsyncFlowFn<D, E>]
//   | [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, D>, AsyncFlowFn<D, E>, AsyncFlowFn<E, F>]
//   | [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, D>, AsyncFlowFn<D, E>, AsyncFlowFn<E, F>, AsyncFlowFn<F, G>]
//   | [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, D>, AsyncFlowFn<D, E>, AsyncFlowFn<E, F>, AsyncFlowFn<F, G>, AsyncFlowFn<G, H>]

// export function series<A, B>(fns: [AsyncFlowFn<A, B>, AsyncFlowFn<B, any>]): AsyncFlowReturn
// export function series<A, B, C>(fns: [AsyncFlowFn<A, B>, AsyncFlowFn<B, C>, AsyncFlowFn<C, any>]): AsyncFlowReturn
export function series(fns: (Function | ((x?: any) => any))[]) {
  let current: any
  let cancelled = false
  let val: any

  async function run() {
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
  cancel()
}
