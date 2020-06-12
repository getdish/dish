import { ZStack } from '@dish/ui'
import React, { memo } from 'react'

import { useOvermind } from '../../state/useOvermind'
import { CloseButton } from './CloseButton'

export const StackViewCloseButton = memo(() => {
  const om = useOvermind()
  return (
    <ZStack right={10} top={10} pointerEvents="auto" zIndex={100}>
      <CloseButton onPressOut={() => om.actions.home.up()} />
    </ZStack>
  )
})
