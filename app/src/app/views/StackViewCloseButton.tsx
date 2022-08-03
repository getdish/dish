import { homeStore } from '../homeStore'
import { CloseButton } from './CloseButton'
import { sleep } from '@dish/async'
import { ButtonProps } from '@dish/ui'
import React, { memo } from 'react'

export const StackViewCloseButton = memo((props: ButtonProps) => {
  return (
    <CloseButton
      elevation="$3"
      pointerEvents="auto"
      onPress={async () => {
        await sleep(16)
        homeStore.up()
      }}
      {...props}
    />
  )
})
