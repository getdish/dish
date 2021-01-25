import { UNWRAP_PROXY } from './constants'
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
  equalityFn: (a: any, b: any) => boolean = (a, b) => a === b
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
      last = next
      if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed(
          ` 💰 ⏭ ${store[UNWRAP_PROXY].constructor.name} (reaction)`
        )
        console.groupCollapsed('trace >')
        console.trace()
        console.groupEnd()
        console.log('  ARG', next)
        console.groupEnd()
      }
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
