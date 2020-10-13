import { HStack, StackProps, Text, Tooltip } from '@dish/ui'
import React from 'react'
import { TextStyle } from 'react-native'

import { bg, bgLight, bgLightLight, lightBlue } from '../../colors'
import { isWeb } from '../../constants'
import { RoutesTable } from '../../state/router'
import { baseButtonStyle } from '../baseButtonStyle'
import { isStringChild } from './isStringChild'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'

export type SmallButtonProps = LinkButtonProps & {
  isActive?: boolean
  tooltip?: string
  before?: any
}

export const SmallButton = ({
  isActive,
  children,
  color,
  fontSize,
  fontWeight,
  lineHeight,
  activeTextStyle,
  textAlign,
  tooltip,
  ellipse,
  before,
  ...rest
}: SmallButtonProps) => {
  let contents = isStringChild(children) ? (
    <Text
      color={isActive ? '#000' : bg}
      fontSize={14}
      fontWeight="600"
      {...{
        color,
        fontSize,
        fontWeight,
        lineHeight,
        textAlign,
        ellipse,
        activeTextStyle,
      }}
    >
      {children}
    </Text>
  ) : (
    children
  )

  contents = (
    <LinkButton
      className={rest.className}
      {...(isWeb && {
        minHeight: 36,
        minWidth: 44,
      })}
      {...(!isWeb && {
        height: 44,
        minWidth: 48,
        alignItems: 'center',
        justifyContent: 'center',
      })}
      {...smallButtonBaseStyle}
      {...rest}
      {...(isActive && {
        backgroundColor: bgLight,
        borderColor: lightBlue,
        hoverStyle: {
          backgroundColor: bgLight,
        },
      })}
    >
      {before}
      {contents}
    </LinkButton>
  )

  if (tooltip) {
    return <Tooltip contents={tooltip}>{contents}</Tooltip>
  }

  return contents
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
