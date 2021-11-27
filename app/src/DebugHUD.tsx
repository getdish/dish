import { Paragraph, useSafeAreaInsets } from '@dish/ui'
import React from 'react'

import { isHermes } from './constants/platforms'

export const DebugHUD = () => {
  const safeArea = useSafeAreaInsets()
  return (
    <Paragraph
      position="absolute"
      bottom={safeArea.bottom + 5}
      right={safeArea.right + 5}
      backgroundColor="#fff"
      color="#000"
      opacity={0.2}
      size="$1"
    >
      {isHermes ? 'hermes' : 'jsc'}
    </Paragraph>
  )
}
