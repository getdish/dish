import { requestIdle, sleep } from '@dish/async'
import { useEffect } from 'react'

export const useWaterfall = (cb: Function, args: any[] = []) => {
  useEffect(() => {
    waterfalls.push(cb)
    start()
    return () => {
      const index = waterfalls.indexOf(cb)
      if (index > -1) {
        waterfalls.splice(index, 1)
      }
    }
  }, args)
}

let waterfalls = []
let running = false

async function start() {
  if (running) return
  running = true
  while (waterfalls.length) {
    await sleep(waterfalls.length ? 0 : 40)
    await requestIdle()
    await sleep(1)
    await requestIdle()
    await sleep(1)
    await requestIdle()
    const amt = Math.max(1, Math.round(waterfalls.length * 0.1))
    const cur = waterfalls.slice(0, amt)
    waterfalls = waterfalls.slice(amt)
    cur.forEach((x) => x())
  }
  running = false
}
