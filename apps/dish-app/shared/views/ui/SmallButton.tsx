import { HStack, StackProps, Text } from '@dish/ui'
import React from 'react'
import { TextStyle } from 'react-native'

import { bg, bgLight, bgLightHover, bgLightLight } from '../../colors'
import { isWeb } from '../../constants'
import { RoutesTable } from '../../state/router'
import { baseButtonStyle } from '../baseButtonStyle'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'

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
      {...(isWeb && {
        minHeight: 40,
        minWidth: 44,
      })}
      {...(!isWeb && {
        height: 44,
        minWidth: 44,
        alignItems: 'center',
        justifyContent: 'center',
      })}
      {...smallButtonBaseStyle}
      {...(isActive && {
        backgroundColor: 'transparent',
        borderColor: `#999`,
        hoverStyle: {
          backgroundColor: 'transparent',
        },
      })}
      {...rest}
    >
      <Text
        color={isActive ? '#000' : bg}
        fontSize={14}
        fontWeight="600"
        {...textStyle}
      >
        {isWeb ? <HStack alignItems="center">{children}</HStack> : children}
      </Text>
    </DeoptHStack>
  )
}

export const smallButtonBaseStyle: StackProps = {
  alignItems: 'center',
  justifyContent: 'center',
  ...baseButtonStyle,
  paddingHorizontal: 11,
  paddingVertical: 8,
  borderRadius: 20,
  borderWidth: 1,
  backgroundColor: '#fff',
  borderColor: bgLight,
  hoverStyle: {
    backgroundColor: bgLightLight,
  },
}

export function SmallLinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>({
  name,
  params,
  tag,
  tags,
  children,
  fontWeight,
  ellipse,
  color,
  ...props
}: LinkButtonProps<Name, Params>) {
  return (
    <SmallButton {...props}>
      <LinkButton
        flex={1}
        {...{ name, params, tag, tags, fontWeight, color, ellipse }}
      >
        {children}
      </LinkButton>
    </SmallButton>
  )
}
