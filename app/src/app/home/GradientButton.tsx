import { Button, XStack, useTheme } from '@dish/ui'
import React from 'react'

export function GradientButton({ children }: { children?: any }) {
  const theme = useTheme()
  return (
    <Button borderRadius="$4" bw={1} boc="$borderColor" elevation="$1">
      {children}
    </Button>
  )
}
