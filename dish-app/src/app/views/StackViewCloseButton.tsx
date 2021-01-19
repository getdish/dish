import React, { memo } from 'react'

import { homeStore } from '../homeStore'
import { CloseButton } from './CloseButton'

export const StackViewCloseButton = memo(() => {
  return <CloseButton shadowed onPressOut={homeStore.up} size={16} />
})
