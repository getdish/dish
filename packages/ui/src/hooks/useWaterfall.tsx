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

let waterfalls: Function[] = []
let running = false

async function start() {
  if (running) return
  running = true
  while (waterfalls.length) {
    let hasIdled = false
    while (!hasIdled) {
      let t0 = Date.now()
      await sleep(1)
      await requestIdle()
      const td = Date.now() - t0
      //  if you want to debug:
      // console.log('we waited', td)
      if (td < 16) {
        hasIdled = true
      }
    }
    const amt = Math.max(1, Math.round(waterfalls.length * 0.2))
    const cur = waterfalls.slice(0, amt)
    waterfalls = waterfalls.slice(amt)
    cur.forEach((x) => x())
  }
  running = false
}
