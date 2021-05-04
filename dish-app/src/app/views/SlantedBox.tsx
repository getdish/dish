import React from 'react'
import { BoxProps, VStack, useTheme } from 'snackui'

import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'

export const slantedBoxStyle: BoxProps = {
  position: 'relative',
  zIndex: 10,
  paddingVertical: 7,
  paddingHorizontal: 10,
  shadowColor: '#000',
  shadowOpacity: 0.125,
  shadowRadius: 6,
  shadowOffset: { height: 2, width: 0 },
  borderRadius: 7,
  transform: [{ rotate: '-2deg' }],
}

export const SlantedBox = (props: BoxProps) => {
  const theme = useTheme()
  return <VStack {...slantedBoxStyle} backgroundColor={theme.cardBackgroundColor} {...props} />
}

export const SlantedLinkButton = (props: LinkButtonProps) => {
  return <LinkButton {...slantedBoxStyle} {...props} />
}
