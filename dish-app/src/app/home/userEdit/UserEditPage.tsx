import React, { Suspense, memo } from 'react'
import { AbsoluteVStack, LoadingItems, VStack } from 'snackui'

import { useHomeStore } from '../../homeStore'
import { UserOnboard } from '../../UserOnboard'
import { DarkModal } from '../../views/DarkModal'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'

export default memo(function UserEditPage() {
  const home = useHomeStore()
  const state = home.currentState

  if (state.type === 'userEdit') {
    return (
      <DarkModal hide={false}>
        <VStack
          pointerEvents="auto"
          width="95%"
          maxWidth={880}
          height="100%"
          flex={1}
        >
          <AbsoluteVStack top={5} right={30}>
            <StackViewCloseButton />
          </AbsoluteVStack>
          <Suspense fallback={<LoadingItems />}>
            <UserOnboard hideLogo />
          </Suspense>
        </VStack>
      </DarkModal>
    )
  }

  return null
})
