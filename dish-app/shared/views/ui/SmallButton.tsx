import React from 'react'
import { HStack, Text, Tooltip } from 'snackui'

import { bgLight, bgLightLight, brandColor, lightBlue } from '../../constants/colors'
import { isWeb } from '../../constants/constants'
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
  href,
  ...rest
}: SmallButtonProps) => {
  let contents = isStringChild(children) ? (
    <Text
      color={isActive ? '#000' : brandColor}
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
        minHeight: 42,
        minWidth: 48,
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

  if (name || tag || tags || params || href) {
    contents = (
      <Link name={name} tag={tag} tags={tags} params={params} href={href}>
        {contents}
      </Link>
    )
  }

  if (tooltip) {
    return <Tooltip contents={tooltip}>{contents}</Tooltip>
  }

  return contents
}
