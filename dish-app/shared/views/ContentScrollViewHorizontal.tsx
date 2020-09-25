import { VStack } from '@dish/ui'
import { useStore } from '@dish/use-store'
import React, { useMemo } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'

import { ScrollStore } from './ContentScrollView'

export let isScrollingSubDrawer = false

export const ContentScrollViewHorizontal = (
  props: ScrollViewProps & { children: any }
) => {
  const { isScrolling } = useStore(ScrollStore)

  const children = useMemo(() => {
    return (
      <ScrollView
        {...{
          horizontal: true,
          showsHorizontalScrollIndicator: false,
          onScrollBeginDrag: () => {
            isScrollingSubDrawer = true
          },
          onScrollEndDrag: () => {
            isScrollingSubDrawer = false
          },
          style: {
            pointerEvents: 'inherit',
          } as any,
        }}
        {...props}
      />
    )
  }, [props])

  return (
    // needs both pointer events to prevent/enable scroll on safari
    <VStack
      pointerEvents={isScrolling ? 'none' : 'auto'}
      overflow="hidden"
      width="100%"
    >
      {children}
    </VStack>
  )
}
