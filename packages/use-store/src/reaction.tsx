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

  const disposeSubscribe = store.subscribe(() => {
    const next = selector(store)
    disposeInner()
    if (!equalityFn(last, next)) {
      last = next
      innerDispose = receiver(next)
    }
  })

  return () => {
    disposeSubscribe()
    disposeInner()
  }
}
