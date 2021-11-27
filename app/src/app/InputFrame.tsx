import { XStack, useMedia, useTheme } from '@dish/ui'
import React, { forwardRef } from 'react'

export const InputFrame = forwardRef(({ children }: { children: any }, ref) => {
  return (
    <XStack
      alignItems="center"
      borderRadius={10}
      width="100%"
      flex={1}
      maxWidth="100%"
      paddingLeft={10}
      position="relative"
      maxHeight={44}
      // borderWidth={0.5}
      // borderColor="rgba(0,0,0,0.2)"
      backgroundColor="rgba(150,150,150,0.04)"
      hoverStyle={{
        backgroundColor: 'rgba(150,150,150,0.1)',
      }}
      focusStyle={{
        backgroundColor: 'rgba(150,150,150,0.1)',
      }}
      $sm={{
        maxHeight: 44,
        // borderWidth: 0,
        backgroundColor: '$bg2',
        borderRadius: 10,
        hoverStyle: {
          backgroundColor: '$bg2',
        },
        focusStyle: {
          backgroundColor: '$bg2',
        },
      }}
    >
      {children}
    </XStack>
  )
})
