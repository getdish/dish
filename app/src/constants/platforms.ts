import { isSSR, isWeb } from './constants'

export const rootEl = typeof document !== 'undefined' && document.getElementById('root')

// @ts-ignore
export const isHermes = !!global.HermesInternal

export const supportsTouchWeb = typeof window !== 'undefined' && 'ontouchstart' in window
export const isTouchDevice = !isWeb || supportsTouchWeb
