import { UNWRAP_PROXY } from './constants'
import { isEqualSubsetShallow } from './isEqualShallow'
import { Store } from './Store'

const dispose = (d: any) => {
  if (typeof d === 'function') {
    d()
  }
}

export function reaction<StoreInstance extends Store, Selector extends (a: StoreInstance) => any>(
  store: StoreInstance,
  selector: Selector,
  receiver: Selector extends (a: StoreInstance) => infer Derived ? (a: Derived) => any : unknown,
  equalityFn: (a: any, b: any) => boolean = isEqualSubsetShallow
) {
  let last: any = undefined
  let innerDispose: any

  function updateReaction() {
    const next = selector(store)
    if (!equalityFn(last, next)) {
      if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed(
          `💰   ⏭   %c${receiver.name} (${store[UNWRAP_PROXY].constructor.name}) ${last} => ${next}`,
          'color: chocolate;'
        )
        console.groupCollapsed('trace >')
        console.trace()
        console.groupEnd()
        console.log('  ARG', next)
        console.groupEnd()
      }
      dispose(innerDispose)
      last = next
      innerDispose = receiver(next)
    }
  }

  const disposeSubscribe = store.subscribe(updateReaction)
  updateReaction()

  return () => {
    disposeSubscribe()
    dispose(innerDispose)
  }
}
