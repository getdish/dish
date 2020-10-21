import React from 'react'
import { HStack, Text, Tooltip } from 'snackui'

import { bg, bgLight, bgLightLight, lightBlue } from '../../colors'
import { isWeb } from '../../constants'
import { isStringChild } from './isStringChild'
import { Link } from './Link'
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
  fontWeight = '600',
  lineHeight,
  textAlign,
  tooltip,
  ellipse,
  before,
  name,
  tag,
  tags,
  params,
  ...rest
}: SmallButtonProps) => {
  let contents = isStringChild(children) ? (
    <Text
      color={isActive ? '#000' : bg}
      fontSize={14}
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
    <HStack
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      paddingHorizontal={11}
      paddingVertical={8}
      borderRadius={20}
      borderWidth={1}
      backgroundColor="transparent"
      borderColor={bgLight}
      hoverStyle={{
        backgroundColor: bgLightLight,
      }}
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
      {...(isActive && {
        backgroundColor: bgLight,
        borderColor: lightBlue,
        hoverStyle: {
          backgroundColor: bgLight,
        },
      })}
      {...rest}
    >
      {before}
      {contents}
    </HStack>
  )

  if (name || tag || tags || params) {
    contents = (
      <Link name={name} tag={tag} tags={tags} params={params}>
        {contents}
      </Link>
    )
  }

  if (tooltip) {
    return <Tooltip contents={tooltip}>{contents}</Tooltip>
  }

  return contents
}
