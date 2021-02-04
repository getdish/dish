import { useEffect, useRef, useState } from 'react'

import { isEqualSubsetShallow } from './isEqualShallow'
import { useCurrentComponent } from './useStoreDebug'

const TARGET = Symbol()
const GET_VERSION = Symbol()

export const createMutableSource = (target: any, getVersion: any) => ({
  [TARGET]: target,
  [GET_VERSION]: getVersion,
})

export const useMutableSource = (
  source: any,
  getSnapshot: any,
  subscribe: any
) => {
  const currentVersion = source[GET_VERSION](source[TARGET])
  const [state, setState] = useState(() => {
    return [
      /* [0] */ source,
      /* [1] */ getSnapshot,
      /* [2] */ subscribe,
      /* [3] */ currentVersion,
      /* [4] */ getSnapshot(source[TARGET]),
    ] as const
  })
  const internal = useRef<{
    version: number
    state: readonly [any, any, any, any, any]
  }>()

  let currentSnapshot = state[4]

  if (!internal.current) {
    internal.current = {
      version: 0,
      state,
    }
  } else {
    const shouldUpdate = (() => {
      const hasChangedRefs =
        state[0] !== source ||
        state[1] !== getSnapshot ||
        state[2] !== subscribe
      const hasChangedVersion =
        currentVersion !== state[3] &&
        currentVersion !== internal.current.version
      if (hasChangedRefs || hasChangedVersion) {
        const prev = currentSnapshot
        const next = getSnapshot(source[TARGET])
        if (!isEqualSubsetShallow(prev, next)) {
          currentSnapshot = next
          return true
        }
      }
      return hasChangedRefs
    })()

    if (shouldUpdate) {
      setState([
        /* [0] */ source,
        /* [1] */ getSnapshot,
        /* [2] */ subscribe,
        /* [3] */ currentVersion,
        /* [4] */ currentSnapshot,
      ])
    }
  }

  internal.current.state = state

  useEffect(() => {
    let didUnsubscribe = false

    const checkForUpdates = () => {
      if (didUnsubscribe) {
        return
      }
      const nextVersion = source[GET_VERSION](source[TARGET])
      internal.current!.version = nextVersion
      const nextSnapshot = getSnapshot(source[TARGET])
      const prev = internal.current!.state
      const next = [
        /* [0] */ prev[0],
        /* [1] */ prev[1],
        /* [2] */ prev[2],
        /* [3] */ nextVersion,
        /* [4] */ nextSnapshot,
      ] as const
      const shouldUpdate =
        prev[0] !== source ||
        prev[1] !== getSnapshot ||
        prev[2] !== subscribe ||
        !isEqualSubsetShallow(prev[4], nextSnapshot)
      if (shouldUpdate) {
        setState(next)
      }
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
