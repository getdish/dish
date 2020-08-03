class MemoCache {
  map = new Map()
  weakmap = new WeakMap()

  // create or retrieve a nested Cache instance based on an arguments object
  get(args: any[]) {
    return args.reduce(MemoCache.reducer, this)
  }

  // get a backing store (map/weakmap) based on a given value
  store(value: any) {
    const t = typeof value
    const isObject = (t === 'object' || t === 'function') && value !== null
    return Reflect.get(this, isObject ? 'weakmap' : 'map')
  }

  static reducer(cache: MemoCache, value: any) {
    const store = cache.store(value)
    return store.get(value) || store.set(value, new MemoCache()).get(value)
  }
}

export function memoize<A extends Function>(
  fn: A,
  opts?: { ttl?: number; debugId?: string }
): A {
  const cache = new MemoCache()
  return function (this: A, ...args: any[]) {
    // get (or create) a cache item
    const item = cache.get(args)
    if (item.hasOwnProperty('value') && item.expires >= Date.now()) {
      if (opts?.debugId) console.log('cache hit', opts?.debugId)
      return item.value
    }
    item.expires = Date.now() + (opts?.ttl ?? Infinity)
    return (item.value = fn.apply(this, args))
  } as any
}
