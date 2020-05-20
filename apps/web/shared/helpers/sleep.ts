import { createCancellablePromise } from './async'

export const sleep = (ms: number) => {
  return createCancellablePromise((res, _rej, onCancel) => {
    const tm = setTimeout(res, ms)
    onCancel(() => {
      clearTimeout(tm)
    })
  })
}
