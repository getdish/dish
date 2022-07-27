import { GestureResponderEvent, NativeSyntheticEvent } from 'react-native'

export * from 'tamagui'
export { useWindowSize } from '@tamagui/use-window-size'

export * from './AbsoluteStacks'
export * from './LoadingItems'
export * from './UnorderedList'
export * from './SlantedYStack'
export * from './SearchInput'
export * from './Dialog'
export * from './Modal'
export * from './Table'
export * from './BlurView'
export * from './Hoverable'
export * from './Toast'

export * from './useOnMount'
export * from './useComposeRefs'
export * from './useDebounceEffect'
export * from './useLazyEffect'

export const prevent = (e: Event | GestureResponderEvent | NativeSyntheticEvent<any>) => {
  e.preventDefault()
  e.stopPropagation()
} 
