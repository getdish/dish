import React from 'react'
import { VStack, useLayout } from 'snackui'

import {
  ContentScrollViewHorizontal,
  ContentScrollViewHorizontalProps,
} from './ContentScrollViewHorizontal'

export const ContentScrollViewHorizontalFitted = (
  props: ContentScrollViewHorizontalProps & {
    width: number
    setWidth: Function
  }
) => {
  const layout = useLayout({
    stateless: true,
    onLayout({ nativeEvent }) {
      props.setWidth?.(nativeEvent.layout.width)
    },
  })

  return (
    <VStack {...(layout as any)} width="100%" position="relative" zIndex={100}>
      <ContentScrollViewHorizontal
        {...props}
        style={[
          {
            width: '100%',
            maxWidth: '100%',
          },
          props.contentContainerStyle,
        ]}
        contentContainerStyle={[
          {
            minWidth: props.width,
          },
          props.contentContainerStyle,
        ]}
      />
    </VStack>
  )
}
