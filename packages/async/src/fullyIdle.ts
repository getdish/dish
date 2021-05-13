import { createCancellablePromise } from './cancellablePromise'
import { requestIdle } from './requestIdle'
import { sleep as sleepFn } from './sleep'

export type FullyIdleProps = {
  min?: number
  max?: number
  checks?: number
}

export function fullyIdle({ min = 1, checks = 1, max = 200 }: FullyIdleProps = {}) {
  return createCancellablePromise(async (res, rej) => {
    try {
      for (const [check] of new Array(checks).fill(null).entries()) {
        await Promise.all([sleepFn(min), Promise.race([sleepFn(max), requestIdle()])])
      }
      res()
    } catch (err) {
      rej(err)
    }
  })
}
