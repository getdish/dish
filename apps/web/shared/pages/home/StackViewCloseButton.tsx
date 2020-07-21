import { AbsoluteVStack, StackProps } from '@dish/ui'
import React, { memo } from 'react'

import { useOvermind } from '../../state/useOvermind'
import { CloseButton } from './CloseButton'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const StackViewCloseButton = memo((props: StackProps) => {
  const om = useOvermind()
  return (
    <AbsoluteVStack
      className="cursor-pointer"
      pointerEvents="auto"
      zIndex={100000}
      {...props}
    >
      <CloseButton size={16} onPressOut={() => om.actions.home.up()} />
    </AbsoluteVStack>
  )
})
