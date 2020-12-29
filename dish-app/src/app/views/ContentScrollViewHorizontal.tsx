import { useStore } from '@dish/use-store'
import React, { memo, useContext, useMemo } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'
import { VStack } from 'snackui'

import { ContentScrollContext, ScrollStore } from './ContentScrollView'

export let isScrollingSubDrawer = false

// takes children but we memo so we can optimize if wanted
export const ContentScrollViewHorizontal = memo(
  (props: ScrollViewProps & { children: any }) => {
    const id = useContext(ContentScrollContext)
    const { isScrolling } = useStore(ScrollStore, { id })

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
        {/* DEBUG VIEW */}
        {/* {isScrolling && (
          <AbsoluteVStack fullscreen backgroundColor="rgba(255,255,0,0.1)" />
        )} */}
        {children}
      </VStack>
    )
  }
)
