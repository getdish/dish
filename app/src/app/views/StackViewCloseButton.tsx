import { homeStore } from '../homeStore'
import { CloseButton } from './CloseButton'
import { sleep } from '@dish/async'
import React, { memo } from 'react'

export const StackViewCloseButton = memo(() => {
  return (
    <CloseButton
      elevation="$3"
      pointerEvents="auto"
      onPressOut={async () => {
        await sleep(16)
        homeStore.up()
      }}
    />
  )
})
