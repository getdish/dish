import React from 'react'
import { Text, TextStyle } from 'react-native'

import { HStack, StackProps } from '../ui/Stacks'
import { flatButtonStyle } from './baseButtonStyle'
import { bg, bgLight, bgLightHover } from './colors'

export const SmallButton = ({
  isActive,
  children,
  textStyle,
  ...rest
}: StackProps & {
  isActive?: boolean
  textStyle?: TextStyle
}) => {
  return (
    <HStack
      alignItems="center"
      justifyContent="center"
      {...flatButtonStyle}
      paddingHorizontal={12}
      paddingVertical={3}
      backgroundColor={isActive ? 'transparent' : bgLight}
      borderRadius={20}
      borderWidth={1}
      borderColor={isActive ? `#aaa` : bgLight}
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
