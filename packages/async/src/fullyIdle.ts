import { sleep } from './sleep'
import { requestIdle } from '.'

export async function fullyIdle({
  min = 1,
  max = Infinity,
}: {
  min?: number
  max?: number
} = {}) {
  let hasIdled = false
  let start = Date.now()
  while (!hasIdled) {
    let t0 = Date.now()
    if (start - t0 > max) {
      return
    }
    await Promise.all([
      // sleep + idle
      sleep(min),
      requestIdle(),
    ])
    const td = Date.now() - t0
    if (td < 16) {
      return
    }
  }
}
