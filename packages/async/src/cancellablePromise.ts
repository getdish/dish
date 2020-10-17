const cancelsMap = new WeakMap()
export type CancelFn = () => void

export class CancellablePromise<T> extends Promise<T> {
  cancel: (() => void) | null = null

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
  cb: (
    res: (value?: any) => any,
    rej: (value?: any) => any,
    onCancel: Function
  ) => A
): Promise<A> => {
  let canceller: any = null
  const promise = new Promise((res, rej) => {
    cb(res, rej, (onCancel) => {
      canceller = onCancel
    })
  })
  cancelsMap.set(promise, canceller)
  return promise as Promise<A>
}

export const cancelPromise = (
  promise: CancellablePromise<any> | Promise<any>
) => {
  if (!promise) return
  if ('cancel' in promise) {
    promise.cancel?.()
  }
  cancelsMap.get(promise)?.()
}
