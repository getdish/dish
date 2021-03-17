import { ButtonProps, Surface } from '@o/ui'
import React from 'react'

import { fontProps } from '../constants'

export function PillButton({ children, ...props }: ButtonProps) {
  return (
    <Surface
      sizeRadius={100}
      background="linear-gradient(to right, #B65138, #BE0DBE)"
      hoverStyle={false}
      color="#000"
      {...fontProps.TitleFont}
      fontWeight={600}
      fontSize={16}
      lineHeight={24}
      letterSpacing={3}
      whiteSpace="pre"
      textTransform="uppercase"
      userSelect="none"
      width="max-content"
      padding={[5, 16]}
      margin={[0, 'auto']}
      {...props}
    >
      {children}
    </Surface>
  )
}
