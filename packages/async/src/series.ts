import { CancelFn, cancelPromise } from './cancellablePromise'
import { sleep } from './sleep'

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
