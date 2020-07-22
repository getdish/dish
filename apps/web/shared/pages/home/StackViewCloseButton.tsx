import { AbsoluteVStack, StackProps } from '@dish/ui'
import React, { memo } from 'react'

import { omStatic, useOvermind } from '../../state/useOvermind'
import { CloseButton } from './CloseButton'

export const StackViewCloseButton = memo((props: StackProps) => {
  return (
    <AbsoluteVStack
      className="cursor-pointer"
      pointerEvents="auto"
      zIndex={100000}
      {...props}
    >
      <CloseButton size={16} onPressOut={() => omStatic.actions.home.up()} />
    </AbsoluteVStack>
  )
})
