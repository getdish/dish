import { HStack, StackProps, Text } from '@dish/ui'
import React from 'react'
import { TextStyle } from 'react-native'

import { bg, bgLight, bgLightHover } from '../../colors'
import { flatButtonStyle } from '../../pages/home/baseButtonStyle'

export type SmallButtonProps = StackProps & {
  isActive?: boolean
  textStyle?: TextStyle
}

export const SmallButton = ({
  isActive,
  children,
  textStyle,
  ...rest
}: SmallButtonProps) => {
  return (
    <HStack
      alignItems="center"
      justifyContent="center"
      {...flatButtonStyle}
      paddingHorizontal={11}
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
        color={isActive ? '#000' : bg}
        fontSize={12}
        fontWeight="600"
        {...textStyle}
      >
        {children}
      </Text>
    </HStack>
  )
}
