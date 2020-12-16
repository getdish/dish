import React from 'react'
import { Box, BoxProps, useTheme } from 'snackui'

export const SlantedBox = (props: BoxProps) => {
  const theme = useTheme()
  return (
    <Box
      position="relative"
      zIndex={10}
      paddingVertical={7}
      paddingHorizontal={10}
      shadowColor="rgba(0,0,0,0.1)"
      shadowRadius={6}
      shadowOffset={{ height: 2, width: 0 }}
      backgroundColor={theme.backgroundColorSecondary}
      borderRadius={5}
      transform={[{ rotate: '-2deg' }]}
      {...props}
    />
  )
}
