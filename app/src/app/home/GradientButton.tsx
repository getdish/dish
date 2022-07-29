import { Button, ButtonProps } from '@dish/ui'
import React from 'react'

export function GradientButton(props: ButtonProps) {
  return <Button borderRadius="$4" bw={1} boc="$borderColor" elevation="$1" {...props} />
}
