import { sleep } from '@dish/async'
import React, { memo } from 'react'

import { homeStore } from '../homeStore'
import { CloseButton } from './CloseButton'

export const StackViewCloseButton = memo(() => {
  return (
    <CloseButton
      debug={1223}
      shadowed
      pointerEvents="auto"
      onPress={async () => {
        await sleep(16)
        homeStore.up()
      }}
      size={16}
    />
  )
})
