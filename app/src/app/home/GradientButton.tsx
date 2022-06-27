import { Button, XStack, useTheme } from '@dish/ui'
import React from 'react'

export function GradientButton({ children }: { children?: any }) {
  const theme = useTheme()
  return (
    <Button borderRadius={1000} elevation="$0.5">
      {children}
    </Button>
  )
}
