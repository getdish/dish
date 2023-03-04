import { useMemo, useRef } from 'react'
import { LinearGradient as TLG } from 'tamagui/linear-gradient'

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

export const useConstant = <Val>(val: () => Val): Val => {
  const state = useRef<any>()
  if (!state.current) {
    state.current = val()
  }
  return state.current
}

export const LinearGradient = TLG
