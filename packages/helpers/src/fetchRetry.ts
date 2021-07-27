// TODO rename to fetchSmart or something and add timeout

export const fetchRetry = async (
  url: RequestInfo,
  {
    retry = 1,
    retryDelay = 1000,
    backoff,
    ...opts
  }: RequestInit & { retry?: number; backoff?: boolean; retryDelay?: number } = {}
) => {
  try {
    return await fetch(url, opts)
  } catch (err) {
    if (retry > 0) {
      if (process.env.DISH_DEBUG) {
        console.log('retry fetching', retry)
      }
      await new Promise((res) => setTimeout(res, retryDelay))
      return await fetchRetry(url, {
        retry: retry - 1,
        retryDelay: retryDelay * (backoff ? 2 : 1),
        ...opts,
      })
    }
    throw err
  }
}
