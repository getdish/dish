import { useEffect, useRef, useState } from 'react'

const TARGET = Symbol()
const GET_VERSION = Symbol()

export const createMutableSource = (target: any, getVersion: any) => ({
  [TARGET]: target,
  [GET_VERSION]: getVersion,
})

export function isObjectEqualShallow(a: Object, b: Object) {
  const ak = Object.keys(a)
  const bk = Object.keys(b)
  if (ak.length !== bk.length) return false
  for (const akey of ak) {
    if (!(akey in b)) return false
    if (a[akey] !== b[akey]) return false
  }
  return true
}

export const useMutableSource = (
  source: any,
  getSnapshot: any,
  subscribe: any
) => {
  const lastVersion = useRef(0)
  const currentVersion = source[GET_VERSION](source[TARGET])
  const [state, setState] = useState(
    () =>
      [
        /* [0] */ source,
        /* [1] */ getSnapshot,
        /* [2] */ subscribe,
        /* [3] */ currentVersion,
        /* [4] */ getSnapshot(source[TARGET]),
      ] as const
  )
  let currentSnapshot = state[4]
  const hasChangedRefs =
    state[0] !== source || state[1] !== getSnapshot || state[2] !== subscribe
  if (hasChangedRefs) {
    if (currentVersion !== state[3] && currentVersion !== lastVersion.current) {
      const prevSnapshot = currentSnapshot
      currentSnapshot = getSnapshot(source[TARGET])
      if (!isObjectEqualShallow(currentSnapshot, prevSnapshot)) {
        setState([
          /* [0] */ source,
          /* [1] */ getSnapshot,
          /* [2] */ subscribe,
          /* [3] */ currentVersion,
          /* [4] */ currentSnapshot,
        ])
      }
    }
  }
  useEffect(() => {
    let didUnsubscribe = false
    const checkForUpdates = () => {
      if (didUnsubscribe) {
        return
      }
      const nextVersion = source[GET_VERSION](source[TARGET])
      lastVersion.current = nextVersion
      const nextSnapshot = getSnapshot(source[TARGET])
      setState((prev) => {
        const next = [
          /* [0] */ prev[0],
          /* [1] */ prev[1],
          /* [2] */ prev[2],
          /* [3] */ nextVersion,
          /* [4] */ nextSnapshot,
        ] as const
        if (
          prev[0] !== source ||
          prev[1] !== getSnapshot ||
          prev[2] !== subscribe
        ) {
          return next
        }
        if (isObjectEqualShallow(prev[4], nextSnapshot)) {
          return prev
        }
        return next
      })
    }
    const unsubscribe = subscribe(source[TARGET], checkForUpdates)
    checkForUpdates()
    return () => {
      didUnsubscribe = true
      unsubscribe()
    }
  }, [source, getSnapshot, subscribe])
  return currentSnapshot
}
