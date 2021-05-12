import { useEffect, useState } from 'react'

import { UNWRAP_PROXY } from './constants'
import { isEqualSubsetShallow } from './isEqualShallow'
import { subscribe, trackStoresAccess } from './useStore'

// TODO i think we can just replace reaction() with this, its not worse in any way

const logUpdate =
  process.env.NODE_ENV === 'development'
    ? (fn: any, stores: any[], last: any, next: any) => {
        const getStoreLogName = (store: any) => {
          const str = store[UNWRAP_PROXY] ?? store
          return `${str.constructor.name}${store.props?.id ? `:${store.props.id}` : ''}`
        }
        const storeNames = stores.map(getStoreLogName).join(', ')
        const name = `💰  ▶️ %c${fn.name} ${storeNames} () ${last} => ${next}`
        console.groupCollapsed(name, 'color: tomato;')
        console.groupCollapsed('trace >')
        console.trace()
        console.groupEnd()
        console.log('  next', next)
        console.groupEnd()
      }
    : null

// TODO test this works the same as useSelector
export function selector(fn: () => any) {
  let prev = runStoreSelector(fn)
  const subscribe = () => {
    return subscribeToStores([...prev.stores], () => {
      const next = runStoreSelector(fn)
      if (
        isEqualSubsetShallow(prev.stores, next.stores) &&
        isEqualSubsetShallow(prev.value, next.value)
      ) {
        return
      }
      if (process.env.NODE_ENV === 'development') {
        logUpdate!(fn, [...prev.stores], prev.value, next.value)
      }
      prev = next
      dispose()
      dispose = subscribe()
    })
  }
  let dispose = subscribe()
  return () => {
    dispose()
  }
}

export function useSelector<A>(fn: () => A): A {
  const [state, setState] = useState(() => {
    return runStoreSelector(fn)
  })

  useEffect(() => {
    return subscribeToStores([...state.stores], () => {
      const next = runStoreSelector(fn)
      setState((prev) => {
        if (
          isEqualSubsetShallow(prev.stores, next.stores) &&
          isEqualSubsetShallow(prev.value, next.value)
        ) {
          return prev
        }
        if (process.env.NODE_ENV === 'development') {
          logUpdate!(fn, [...prev.stores], prev.value, next.value)
        }
        return next
      })
    })
  }, [...state.stores])

  return state.value
}
function runStoreSelector<A>(selector: () => A): { value: A; stores: Set<any> } {
  const stores = new Set()
  const dispose = trackStoresAccess((store) => {
    stores.add(store)
  })
  const value = selector()
  dispose()
  return {
    value,
    stores,
  }
}
function subscribeToStores(stores: any[], onUpdate: () => any) {
  const disposes: Function[] = []
  for (const store of stores) {
    disposes.push(subscribe(store, onUpdate))
  }
  return () => {
    disposes.forEach((x) => x())
  }
}
