import { AbsoluteVStack, LoadingItems, Modal, VStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { useOvermind } from '../../state/om'
import { UserOnboard } from '../../UserOnboard'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'

export default memo(function UserEditPage() {
  const om = useOvermind()
  const state = om.state.home.currentState

  if (state.type === 'userEdit') {
    return (
      <Modal>
        <VStack width="95%" maxWidth={880} height="100%" flex={1}>
          <AbsoluteVStack top={5} right={30}>
            <StackViewCloseButton />
          </AbsoluteVStack>
          <Suspense fallback={<LoadingItems />}>
            <UserOnboard state={state} />
          </Suspense>
        </VStack>
      </Modal>
    )
  }

  return null
})
