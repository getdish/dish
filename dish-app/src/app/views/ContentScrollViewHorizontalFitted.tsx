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
  const layoutProps = useLayout({
    onLayout({ nativeEvent }) {
      props.setWidth?.(nativeEvent.layout.width)
    },
  })

  console.log('layoutProps', layoutProps.layout)

  return (
    <VStack
      {...layoutProps}
      width={layoutProps.layout?.width ?? '100%'}
      maxWidth="100%"
      position="relative"
      zIndex={100}
    >
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
