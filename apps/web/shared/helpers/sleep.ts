import { CANCEL_ASYNC_SYMBOL, createCancellablePromise } from './async'

export const sleep = (ms: number) => {
  return createCancellablePromise((res, _rej, onCancel) => {
    const tm = setTimeout(res, ms)
    onCancel(() => {
      clearTimeout(tm)
    })
  })
}
