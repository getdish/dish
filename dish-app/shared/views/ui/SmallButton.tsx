import { HStack, StackProps, Text, Tooltip } from '@dish/ui'
import React from 'react'
import { StyleSheet, TextStyle } from 'react-native'

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
      style={[
        smallButtonStyles.base,
        isWeb ? smallButtonStyles.isWeb : smallButtonStyles.isTouch,
        isActive ? smallButtonStyles.isActive : null,
      ]}
      hoverStyle={{
        backgroundColor: isActive ? bgLight : bgLightLight,
      }}
      {...rest}
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

export const smallButtonStyles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    ...baseButtonStyle,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: bgLight,
  },
  isWeb: {
    minHeight: 36,
    minWidth: 44,
  },
  isTouch: {
    height: 44,
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  isActive: {
    backgroundColor: bgLight,
    borderColor: lightBlue,
  },
})
