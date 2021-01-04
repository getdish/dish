import React, { memo } from 'react'

import { homeStore } from '../state/home'
import { CloseButton } from './CloseButton'

export const StackViewCloseButton = memo(() => {
  return (
    <CloseButton
      shadowColor="rgba(0,0,0,0.25)"
      shadowRadius={10}
      shadowOffset={{ width: 0, height: 2 }}
      onPressOut={() => homeStore.up()}
      size={16}
    />
  )
})
