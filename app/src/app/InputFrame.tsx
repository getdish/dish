import { XStack } from '@dish/ui'
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
      // @ts-ignore
      focusStyle={{
        backgroundColor: 'rgba(150,150,150,0.1)',
      }}
      $sm={{
        maxHeight: 44,
        // borderWidth: 0,
        backgroundColor: '$backgroundHover',
        borderRadius: 10,
        // @ts-expect-error
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
        focusStyle: {
          backgroundColor: '$backgroundFocus',
        },
      }}
    >
      {children}
    </XStack>
  )
})
