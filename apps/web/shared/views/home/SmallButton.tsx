import React from 'react'
import { Text, TextStyle } from 'react-native'

import { HStack, StackBaseProps } from '../ui/Stacks'
import { flatButtonStyle } from './baseButtonStyle'
import { bg, bgLight, bgLightHover } from './colors'

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
      backgroundColor={isActive ? 'transparent' : bgLight}
      borderRadius={20}
      borderWidth={2}
      borderColor={isActive ? `#aaa` : 'white'}
      hoverStyle={
        isActive
          ? {
              // backgroundColor: bgHover,
            }
          : {
              backgroundColor: bgLightHover,
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
