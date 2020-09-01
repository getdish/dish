import { Box, BoxProps, StackProps } from '@dish/ui'
import React from 'react'

export const SlantedBox = (props: BoxProps) => {
  return <Box {...slantedBoxStyle} {...props} />
}

export const slantedBoxStyle: StackProps = {
  position: 'relative',
  zIndex: 10,
  paddingVertical: 5,
  paddingHorizontal: 6,
  shadowColor: 'rgba(0,0,0,0.1)',
  shadowRadius: 8,
  shadowOffset: { height: 2, width: 0 },
  backgroundColor: '#fff',
  borderRadius: 8,
  transform: [{ rotate: '-4deg' }],
}
