import { requestIdle } from './requestIdle'
import { sleep as sleepFn } from './sleep'

export async function fullyIdle({
  min = 1,
  max = 500,
}: {
  min?: number
  max?: number
} = {}) {
  return await Promise.all([
    sleepFn(min),
    Promise.race([sleepFn(max), requestIdle()]),
  ])
}
