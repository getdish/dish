/**
 * Memoize a function that takes a single argument using a weak map.
 * @param fn The function to memoize. Must be an object.
 */

export function memoizeWeak<TArg extends object = object, TResult = unknown>(
  fn: (key: TArg) => TResult
) {
  const cache = new WeakMap<TArg, TResult>()
  return function cachedFn(arg: TArg) {
    if (cache.has(arg)) {
      return cache.get(arg)!
    }
    const ret = fn(arg)
    cache.set(arg, ret)
    return ret
  }
}
