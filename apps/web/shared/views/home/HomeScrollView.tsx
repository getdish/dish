import { useDebounce } from '@dish/ui'
import React, { useRef } from 'react'
import { useCallback } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'

import { searchBarHeight } from '../../constants'
import { useOvermind } from '../../state/useOvermind'

export const HomeScrollView = (props: ScrollViewProps & { children: any }) => {
  const om = useOvermind()
  const tm = useRef<any>(0)
  const setIsScrolling = useCallback(() => {
    om.actions.home.setIsScrolling(true)
    clearTimeout(tm.current)
    tm.current = setTimeout(() => {
      om.actions.home.setIsScrolling(false)
    }, 150)
  }, [])
  return (
    <ScrollView
      onScroll={setIsScrolling}
      scrollEventThrottle={50}
      {...props}
      style={[{ flex: 1, paddingTop: searchBarHeight }, props.style]}
    />
  )
}
