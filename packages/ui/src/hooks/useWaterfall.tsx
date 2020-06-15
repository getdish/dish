import { fullyIdle } from '@dish/async'
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
    await fullyIdle({ min: 120 })
    const amt = Math.max(1, Math.round(waterfalls.length * 0.2))
    const cur = waterfalls.slice(0, amt)
    waterfalls = waterfalls.slice(amt)
    cur.forEach((x) => x())
  }
  running = false
}
