const cancelsMap = new WeakMap()
export type CancelFn = () => void

export const createCancellablePromise = <A>(
  cb: (
    res: (value?: any) => any,
    rej: (value?: any) => any,
    onCancel: Function
  ) => A
): Promise<A> => {
  const promise = new Promise((res, rej) => {
    cb(res, rej, (onCancel) => {
      cancelsMap.set(promise, onCancel)
    })
  })
  return promise as Promise<A>
}

export const cancelPromise = (promise: any) => {
  cancelsMap.get(promise)?.()
}
