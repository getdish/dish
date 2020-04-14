import { useEffect } from 'react'

import { sleep } from '../../helpers/sleep'

export const useWaterfall = (cb: Function) => {
  useEffect(() => {
    waterfalls.push(cb)
    return () => {
      const index = waterfalls.indexOf(cb)
      if (index > -1) {
        waterfalls.splice(index, 1)
      }
    }
  }, [])
}

let waterfalls = []

async function runWaterfalls() {
  while (true) {
    await sleep(20)
    const amt = Math.max(1, Math.round(waterfalls.length * 0.1))
    const cur = waterfalls.slice(0, amt)
    waterfalls = waterfalls.slice(amt)
    cur.forEach((x) => x())
    await sleep(20)
  }
}

runWaterfalls()
