export * from 'tamagui'
export { useWindowSize } from '@tamagui/use-window-size'

export * from './AbsoluteStacks'
export * from './LoadingItems'
export * from './UnorderedList'
export * from './SlantedYStack'
export * from './SearchInput'
export * from './Dialog'
export * from './Modal'

export * from './useGet'
export * from './useOnMount'
export * from './useComposeRefs'
export * from './useDebounceEffect'
export * from './useLazyEffect'

export const prevent = (e) => [e.preventDefault(), e.stopPropagation()]
