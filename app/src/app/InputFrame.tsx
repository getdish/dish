import React, { forwardRef } from 'react'
import { HStack, useMedia, useTheme } from 'snackui'

export const InputFrame = forwardRef(({ children }: { children: any }, ref) => {
  const theme = useTheme()
  const media = useMedia()
  return (
    <HStack
      alignItems="center"
      borderRadius={2}
      width="100%"
      flex={1}
      maxWidth="100%"
      paddingLeft={10}
      position="relative"
      maxHeight={44}
      // borderWidth={0.5}
      // borderColor="rgba(0,0,0,0.2)"
      backgroundColor="rgba(255,255,255,0.1)"
      hoverStyle={{
        backgroundColor: 'rgba(255,255,255,0.15)',
      }}
      focusStyle={{
        backgroundColor: 'rgba(255,255,255,0.15)',
      }}
      {...(media.sm && {
        maxHeight: 44,
        // borderWidth: 0,
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
