import {
  ContentScrollViewHorizontal,
  ContentScrollViewHorizontalProps,
} from './ContentScrollViewHorizontal'
import { YStack } from '@dish/ui'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'

export const ContentScrollViewHorizontalFitted = (
  props: ContentScrollViewHorizontalProps & {
    width: number
    setWidth: Function
  }
) => {
  const [width, setWidth] = useState<string | number>('100%')

  return (
    <View
      onLayout={({ nativeEvent }) => {
        setWidth(nativeEvent.layout.width)
      }}
    >
      <YStack minWidth={width} width="100%" maxWidth="100%" position="relative" zIndex={100}>
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
      </YStack>
    </View>
  )
}

const style = StyleSheet.create({
  scrollView: {
    width: '100%',
    maxWidth: '100%',
  },
})
