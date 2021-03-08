import { createCancellablePromise } from './cancellablePromise'

export const requestIdle = () => {
  return createCancellablePromise((res, _rej, onCancel) => {
    // @ts-ignore
    let tm = requestIdleCallback(res)
    onCancel(() => {
      clearTimeout(tm)
    })
  })
}
