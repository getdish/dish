import React from 'react'
import { Box, BoxProps, StackProps, extendStaticConfig } from 'snackui'

export const SlantedBox = (props: BoxProps) => {
  return <Box {...slantedBoxStyle} {...props} />
}

export const slantedBoxStyle: StackProps = {
  position: 'relative',
  zIndex: 10,
  paddingVertical: 7,
  paddingHorizontal: 10,
  shadowColor: 'rgba(0,0,0,0.1)',
  shadowRadius: 6,
  shadowOffset: { height: 2, width: 0 },
  backgroundColor: '#fff',
  borderRadius: 5,
  transform: [{ rotate: '-2deg' }],
}

if (process.env.IS_STATIC) {
  Box.staticConfig = extendStaticConfig(Box, {
    defaultProps: slantedBoxStyle,
  })
}
