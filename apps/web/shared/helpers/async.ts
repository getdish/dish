import { sleep } from './sleep'

const cancelsMap = new WeakMap()
type CancelFn = () => void

export const createCancellablePromise = <A>(
  cb: (
    res: (value?: any) => any,
    rej: (value?: any) => any,
    onCancel: Function
  ) => A
): Promise<A> => {
  let cancel: Function
  const promise = new Promise((res, rej) => {
    cb(res, rej, (onCancel) => {
      cancel = onCancel
    })
  })
  cancelsMap.set(promise, cancel)
  return promise as Promise<A>
}

export const cancelPromise = (promise: any) => {
  cancelsMap.get(promise)?.()
}

export const series = (fns: (() => Promise<any> | any)[]): CancelFn => {
  let current: any

  async function run() {
    for (const fn of fns) {
      current = fn()
      await current
    }
  }

  run()

  return () => {
    cancelPromise(current)
  }
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
