export function race<A>(
  promise: Promise<A>,
  timeout: number,
  error: string = '',
  options?: { warnOnly?: boolean }
) {
  let timer: any = null
  return Promise.race([
    new Promise<void>((resolve, reject) => {
      const msg = `timed out after ${timeout}ms: ${error}`
      timer = setTimeout(() => {
        if (options?.warnOnly) {
          console.warn(msg)
          resolve()
        } else {
          reject(msg)
        }
      }, timeout)
    }),
    promise.then((value) => {
      clearTimeout(timer)
      return value
    }),
  ])
}
