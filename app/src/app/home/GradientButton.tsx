import { XStack, useTheme } from '@dish/ui'
import React from 'react'

import { RGB } from '../../helpers/rgb'

export function GradientButton({ children }: { children?: any }) {
  const theme = useTheme()
  return (
    <XStack
      paddingVertical={12}
      paddingHorizontal={18}
      alignItems="center"
      justifyContent="center"
      borderRadius={1000}
      shadowRadius={6}
      shadowOffset={{ height: 2, width: 0 }}
      shadowColor={theme.shadowColor}
      position="relative"
      overflow="hidden"
      backgroundColor={theme.backgroundColor}
      // flexShrink={1}
      hoverStyle={{
        backgroundColor: theme.backgroundColorSecondary,
      }}
      pressStyle={{
        transform: [{ scale: 0.98 }],
      }}
    >
      {children}
    </XStack>
  )
}
