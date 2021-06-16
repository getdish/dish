import React from 'react'
import { StyleSheet } from 'react-native'
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

  const width = layoutProps.layout?.width ?? '100%'

  return (
    <VStack
      {...layoutProps}
      minWidth={width}
      width="100%"
      maxWidth="100%"
      position="relative"
      zIndex={100}
    >
      <ContentScrollViewHorizontal
        {...props}
        style={[style.scrollView, props.contentContainerStyle]}
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

const style = StyleSheet.create({
  scrollView: {
    width: '100%',
    maxWidth: '100%',
  },
})