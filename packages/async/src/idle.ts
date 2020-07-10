import { requestIdle } from './requestIdle'
import { sleep } from './sleep'

export const idle = async (max: number) => {
  await Promise.race([requestIdle(), sleep(max)])
}
