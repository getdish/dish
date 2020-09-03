import { HStack, StackProps, Text } from '@dish/ui'
import React from 'react'
import { TextStyle } from 'react-native'

import { bg, bgLight, bgLightHover } from '../../colors'
import { baseButtonStyle } from '../../pages/home/baseButtonStyle'

export type SmallButtonProps = StackProps & {
  isActive?: boolean
  textStyle?: TextStyle
}

const DeoptHStack = HStack

export const SmallButton = ({
  isActive,
  children,
  textStyle,
  ...rest
}: SmallButtonProps) => {
  return (
    <DeoptHStack
      className={rest.className}
      {...smallButtonBaseStyle}
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
      {...(isActive && {
        backgroundColor: 'transparent',
        borderColor: `#999`,
        hoverStyle: {
          backgroundColor: 'transparent',
        },
      })}
      minWidth={43}
    >
      <Text
        color={isActive ? '#000' : bg}
        fontSize={14}
        fontWeight="600"
        {...textStyle}
      >
        <HStack alignItems="center">{children}</HStack>
      </Text>
    </DeoptHStack>
  )
}

export const smallButtonBaseStyle: StackProps = {
  alignItems: 'center',
  justifyContent: 'center',
  ...baseButtonStyle,
  paddingHorizontal: 11,
  paddingVertical: '0.45rem',
  borderRadius: 20,
  borderWidth: 1,
  backgroundColor: '#fff',
  borderColor: bgLight,
}
