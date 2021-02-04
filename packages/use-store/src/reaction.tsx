import { UNWRAP_PROXY } from './constants'
import { isEqualSubsetShallow } from './isEqualShallow'
import { Store } from './Store'

export function reaction<
  StoreInstance extends Store,
  Selector extends (a: StoreInstance) => any
>(
  store: StoreInstance,
  selector: Selector,
  receiver: Selector extends (a: StoreInstance) => infer Derived
    ? (a: Derived) => any
    : unknown,
  equalityFn: (a: any, b: any) => boolean = isEqualSubsetShallow
) {
  let last: any = undefined
  let innerDispose: any
  const disposeInner = () => {
    if (typeof innerDispose === 'function') {
      innerDispose()
    }
  }

  function updateReaction() {
    const next = selector(store)
    disposeInner()
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
      last = next
      innerDispose = receiver(next)
    }
  }

  const disposeSubscribe = store.subscribe(updateReaction)
  updateReaction()

  return () => {
    disposeSubscribe()
    disposeInner()
  }
}
