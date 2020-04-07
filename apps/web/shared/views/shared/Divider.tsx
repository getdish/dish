import React, { memo } from 'react'
import { View } from 'react-native'

import { HStack, StackBaseProps } from './Stacks'

export const Divider = memo(
  ({
    flex,
    vertical,
    height,
    width,
    flexLine = 10,
    ...rest
  }: Omit<StackBaseProps, 'flex'> & {
    flexLine?: number
    flex?: boolean
    vertical?: boolean
  }) => {
    return (
      <HStack
        flexDirection={vertical ? 'column' : 'row'}
        flex={flex === true ? 1 : 0}
        width={width ?? (vertical ? 1 : flex == true ? 'auto' : '100%')}
        height={height ?? (!vertical ? 1 : flex == true ? 'auto' : '100%')}
        {...rest}
      >
        <View style={{ flex: 1 }} />
        <View
          style={{
            [vertical ? 'width' : 'height']: 1,
            flex: flexLine,
            backgroundColor: '#000',
            opacity: 0.045,
          }}
        />
        <View style={{ flex: 1 }} />
      </HStack>
    )
  }
)
