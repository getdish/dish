import { AbsoluteVStack, StackProps } from '@dish/ui'
import React, { memo } from 'react'

import { omStatic } from '../state/omStatic'
import { CloseButton } from './ui/CloseButton'

export const StackViewCloseButton = memo((props: StackProps) => {
  return (
    <AbsoluteVStack
      className="cursor-pointer"
      pointerEvents="auto"
      zIndex={100000}
      onPressOut={() => omStatic.actions.home.up()}
      {...props}
    >
      <CloseButton size={16} />
    </AbsoluteVStack>
  )
})
