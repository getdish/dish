import { createCancellablePromise } from './async'

export const requestIdle = () => {
  return createCancellablePromise((res, _rej, onCancel) => {
    let tm = requestIdleCallback(res)
    onCancel(() => {
      clearTimeout(tm)
    })
  })
}
