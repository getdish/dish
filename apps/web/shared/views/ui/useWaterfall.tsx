import { useEffect } from 'react'

import { sleep } from '../../helpers/sleep'

export const useWaterfall = (cb: Function) => {
  useEffect(() => {
    waterfalls.push(cb)
    start()
    return () => {
      const index = waterfalls.indexOf(cb)
      if (index > -1) {
        waterfalls.splice(index, 1)
      }
    }
  }, [])
}

let waterfalls = []
let running = false

async function start() {
  if (running) return
  running = true
  while (waterfalls.length) {
    await sleep(waterfalls.length ? 10 : 100)
    await new Promise((res) => requestIdleCallback(res))
    const amt = Math.max(1, Math.round(waterfalls.length * 0.1))
    const cur = waterfalls.slice(0, amt)
    waterfalls = waterfalls.slice(amt)
    cur.forEach((x) => x())
  }
  running = false
}
