import React, { forwardRef } from 'react'
import { HStack, useMedia, useTheme } from 'snackui'

export const InputFrame = forwardRef(({ children }: { children: any }, ref) => {
  const theme = useTheme()
  const media = useMedia()
  return (
    <HStack
      alignItems="center"
      // borderRadius={180}
      flex={1}
      maxWidth="100%"
      paddingLeft={10}
      overflow="hidden"
      position="relative"
      backgroundColor="rgba(50,50,50,0.1)"
      hoverStyle={{
        backgroundColor: 'rgba(50,50,50,0.3)',
      }}
      focusStyle={{
        backgroundColor: 'rgba(50,50,50,0.35)',
      }}
      {...(media.sm && {
        backgroundColor: theme.backgroundColorSecondary,
        borderRadius: 12,
        hoverStyle: {
          backgroundColor: theme.backgroundColorSecondary,
        },
        focusStyle: {
          backgroundColor: theme.backgroundColorSecondary,
        },
      })}
    >
      {children}
    </HStack>
  )
})
