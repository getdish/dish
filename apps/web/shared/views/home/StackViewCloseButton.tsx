import { MediaQuery, ZStack, mediaQueries } from '@dish/ui'
import React, { memo } from 'react'

import { useOvermind } from '../../state/useOvermind'
import { CloseButton } from './CloseButton'

export const StackViewCloseButton = memo(() => {
  const om = useOvermind()
  return (
    <MediaQuery query={mediaQueries.sm} style={{ display: 'none' }}>
      <ZStack right={10} top={10} pointerEvents="auto" zIndex={100}>
        <CloseButton onPress={() => om.actions.home.up()} />
      </ZStack>
    </MediaQuery>
  )
})
