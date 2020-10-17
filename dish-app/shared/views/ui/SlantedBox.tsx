import React from 'react'
import { Box, BoxProps, StackProps } from 'snackui'

export const SlantedBox = (props: BoxProps) => {
  return <Box {...slantedBoxStyle} {...props} />
}

export const slantedBoxStyle: StackProps = {
  position: 'relative',
  zIndex: 10,
  paddingVertical: 5,
  paddingHorizontal: 6,
  shadowColor: 'rgba(0,0,0,0.1)',
  shadowRadius: 6,
  shadowOffset: { height: 2, width: 0 },
  backgroundColor: '#fff',
  borderRadius: 8,
  transform: [{ rotate: '-2deg' }],
}
