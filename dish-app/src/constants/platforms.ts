import { isSSR } from './constants'

export const rootEl =
  typeof document !== 'undefined' && document.getElementById('root')
export const supportsTouchWeb =
  typeof window !== 'undefined' && 'ontouchstart' in window
