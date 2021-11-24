import { BoxProps, YStack, useTheme } from '@dish/ui'
import React from 'react'

import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'

export const slantedBoxStyle: BoxProps = {
  position: 'relative',
  zIndex: 10,
  paddingVertical: 8,
  paddingHorizontal: 10,
  shadowColor: '#000',
  shadowOpacity: 0.125,
  shadowRadius: 6,
  shadowOffset: { height: 2, width: 0 },
  borderRadius: 7,
  transform: [{ rotate: '-1.25deg' }],
}

export const SlantedBox = (props: BoxProps) => {
  const theme = useTheme()
  return <YStack {...slantedBoxStyle} backgroundColor={theme.bgCard} {...props} />
}

export const SlantedLinkButton = (props: LinkButtonProps) => {
  return <LinkButton {...slantedBoxStyle} {...props} />
}
