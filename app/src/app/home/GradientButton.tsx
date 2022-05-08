import { XStack, useTheme } from '@dish/ui'
import React from 'react'

export function GradientButton({ children }: { children?: any }) {
  const theme = useTheme()
  return (
    <XStack
      paddingVertical={12}
      paddingHorizontal={18}
      alignItems="center"
      justifyContent="center"
      borderRadius={1000}
      shadowRadius={5}
      shadowOffset={{ height: 2, width: 0 }}
      shadowColor={theme.shadowColorHover}
      position="relative"
      backgroundColor="$background"
      hoverStyle={{
        backgroundColor: '$backgroundHover',
      }}
      pressStyle={{
        transform: [{ scale: 0.98 }],
      }}
    >
      {children}
    </XStack>
  )
}
