import React, { memo } from 'react'
import { View } from 'react-native'

import { HStack } from './Stacks'

export const Divider = memo(
  ({
    flex,
    vertical,
    height,
    width,
  }: {
    flex?: boolean
    vertical?: boolean
    height?: number
    width?: number
  }) => {
    return (
      <HStack
        flexDirection={vertical ? 'column' : 'row'}
        flex={flex === true ? 1 : 0}
        width={width ?? (vertical ? 1 : flex == true ? 'auto' : '100%')}
        height={height ?? (!vertical ? 1 : flex == true ? 'auto' : '100%')}
      >
        <View style={{ flex: 1 }} />
        <View
          style={{
            [vertical ? 'width' : 'height']: 1,
            flex: 10,
            backgroundColor: '#000',
            opacity: 0.0666,
          }}
        />
        <View style={{ flex: 1 }} />
      </HStack>
    )
  }
)
