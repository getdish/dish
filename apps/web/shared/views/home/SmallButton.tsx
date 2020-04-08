import React from 'react'
import { Text, TextStyle } from 'react-native'

import { HStack, StackBaseProps } from '../shared/Stacks'
import { flatButtonStyle } from './baseButtonStyle'
import { bg, lightBg, lightBgHover } from './colors'

export const SmallButton = ({
  isActive,
  children,
  textStyle,
  ...rest
}: StackBaseProps & {
  isActive?: boolean
  textStyle?: TextStyle
}) => {
  return (
    <HStack
      alignItems="center"
      justifyContent="center"
      {...flatButtonStyle}
      paddingHorizontal={12}
      paddingVertical={4}
      backgroundColor={isActive ? 'transparent' : lightBg}
      borderRadius={20}
      borderWidth={2}
      borderColor={isActive ? `#000` : 'white'}
      hoverStyle={
        isActive
          ? {
              // backgroundColor: bgHover,
            }
          : {
              backgroundColor: lightBgHover,
            }
      }
      {...rest}
    >
      <Text
        style={[
          {
            color: isActive ? '#000' : bg,
            fontSize: 15,
            fontWeight: '600',
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </HStack>
  )
}
