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
