import React, { forwardRef } from 'react'
import { HStack, useMedia, useTheme } from 'snackui'

export const InputFrame = forwardRef(({ children }: { children: any }, ref) => {
  const theme = useTheme()
  const media = useMedia()
  return (
    <HStack
      alignItems="center"
      borderRadius={6}
      flex={1}
      maxWidth="100%"
      paddingLeft={10}
      overflow="hidden"
      position="relative"
      backgroundColor="rgba(50,50,50,0.1)"
      hoverStyle={{
        backgroundColor: 'rgba(150,150,150,0.15)',
      }}
      focusStyle={{
        backgroundColor: 'rgba(150,150,150,0.25)',
      }}
      {...(media.sm && {
        maxHeight: 44,
        backgroundColor: theme.backgroundColorSecondary,
        borderRadius: 10,
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
