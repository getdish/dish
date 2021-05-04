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
      position="relative"
      backgroundColor="rgba(20,20,20,0.1)"
      hoverStyle={{
        backgroundColor: 'rgba(20,20,20,0.15)',
      }}
      focusStyle={{
        backgroundColor: 'rgba(20,20,20,0.25)',
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
