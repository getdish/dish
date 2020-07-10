import { sleep as sleepFn } from './sleep'
import { requestIdle } from '.'

// a bit more conservative

export async function fullyIdle({
  min = 16,
  sleep,
  max = 1000,
}: {
  min?: number
  max?: number
  sleep?: number
} = {}) {
  sleep = sleep ?? min * 0.33
  let hasIdled = false
  let start = Date.now()
  while (!hasIdled) {
    let t0 = Date.now()
    if (t0 - start > max) {
      return
    }
    await Promise.all([
      // sleep + idle
      sleepFn(sleep),
      requestIdle(),
    ])
    const td = Date.now() - t0
    if (td < min) {
      return
    }
  }
}
