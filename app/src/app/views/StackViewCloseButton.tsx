import { sleep } from '@dish/async'
import React, { memo } from 'react'

import { homeStore } from '../homeStore'
import { CloseButton } from './CloseButton'

export const StackViewCloseButton = memo(() => {
  return (
    <CloseButton
      size={40}
      shadowed
      pointerEvents="auto"
      onPressOut={async () => {
        await sleep(16)
        homeStore.up()
      }}
    />
  )
})
