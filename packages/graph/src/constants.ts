export const constants = 0
export const isNode = typeof window == 'undefined'
export const isBrowserProd =
  !isNode && window.location.hostname.includes('dish')

export const isWorker =
  typeof document !== 'undefined' && !document.getElementById('root')
