// debug
import React from 'react'
import { Box, BoxProps, StackProps, useTheme } from 'snackui'

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

export const slantedBoxStyle: StackProps = {
  position: 'relative',
  zIndex: 10,
  paddingVertical: 7,
  paddingHorizontal: 10,
  shadowColor: 'rgba(0,0,0)',
  shadowOpacity: 0.12,
  shadowRadius: 6,
  shadowOffset: { height: 2, width: 0 },
  borderRadius: 5,
  transform: [{ rotate: '-2deg' }],
}
