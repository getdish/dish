// debug
import React from 'react'
import { Box, BoxProps, StackProps, useTheme } from 'snackui'

import { slantedBoxStyle } from '../../constants'

export const SlantedBox = (props: BoxProps) => {
  const theme = useTheme()
  return (
    <Box
      {...slantedBoxStyle}
      backgroundColor={theme.cardBackgroundColor}
      {...props}
    />
  )
}
