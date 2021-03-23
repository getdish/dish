import React from 'react'
import { BoxProps, VStack, useTheme } from 'snackui'

import { slantedBoxStyle } from '../../constants/constants'

export const SlantedBox = (props: BoxProps) => {
  const theme = useTheme()
  return (
    <VStack
      data-is="slanted-box"
      {...slantedBoxStyle}
      backgroundColor={theme.cardBackgroundColor}
      {...props}
    />
  )
}
