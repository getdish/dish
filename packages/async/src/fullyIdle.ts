import { sleep } from './sleep'
import { requestIdle } from '.'

export async function fullyIdle(atLeastMs: number = 1) {
  let hasIdled = false
  while (!hasIdled) {
    let t0 = Date.now()
    await sleep(atLeastMs)
    await requestIdle()
    const td = Date.now() - t0
    if (td < 16) {
      return
    }
  }
}
