import { ButtonProps } from '@o/ui'
import React from 'react'

import { PillButton } from './PillButton'

export function PillButtonDark({ children, ...props }: ButtonProps) {
  return (
    <PillButton letterSpacing={2} background="rgba(0,0,0,0.5)" {...props}>
      <span
        className="clip-text"
        style={{
          background: 'linear-gradient(to left, #B74E42, #BE0FAD)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {children}
      </span>
    </PillButton>
  )
}

export function PillButtonDarkOutline({ children, ...props }: ButtonProps) {
  return (
    <PillButton letterSpacing={2} background="transparent" {...props}>
      <span
        className="clip-text"
        style={{
          background: 'linear-gradient(to left, #B74E42, #BE0FAD)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {children}
      </span>
    </PillButton>
  )
}
