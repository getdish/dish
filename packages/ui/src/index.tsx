import { useMemo, useRef } from 'react'
import { View } from 'react-native'
import { LinearGradient as TLG } from 'tamagui/linear-gradient'

// eslint-disable-next-line import/export
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

export function useConstant<Val>(val: () => Val): Val {
  const state = useRef<any>()
  if (!state.current) {
    state.current = val()
  }
  return state.current
}

// eslint-disable-next-line import/export
export const LinearGradient = TLG

export const TestSquare = () => (
  // eslint-disable-next-line react/react-in-jsx-scope
  <View style={{ width: 200, height: 200, backgroundColor: 'red' }} />
)
