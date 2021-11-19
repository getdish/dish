const cancelsMap = new WeakMap()
export type CancelFn = () => void

const emptyFn = () => {}

export class CancellablePromise<T = any> extends Promise<T> {
  cancel: () => any = emptyFn

  constructor(
    executor: (
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    super(executor as any)
  }
}

export const createCancellablePromise = <A>(
  cb: (res: (value?: any) => any, rej: (value?: any) => any, onCancel: Function) => A
): CancellablePromise<A> => {
  let canceller: any = null
  const promise = new Promise((res, rej) => {
    cb(res, rej, (onCancel) => {
      canceller = onCancel
    })
  })
  promise['cancel'] = canceller
  cancelsMap.set(promise, canceller)
  return promise as CancellablePromise<A>
}

export const cancelPromise = (promise: CancellablePromise<any> | Promise<any>) => {
  if (!promise) return
  if ('cancel' in promise) {
    promise.cancel?.()
  }
  cancelsMap.get(promise)?.()
}
