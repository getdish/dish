import { LoadingItems, Spacer, YStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { router } from '../../../router'
import { useIsHomeTypeActive } from '../../homeStore'
import { UserOnboard } from '../../UserOnboard'
import { useUserStore, userStore } from '../../userStore'
import { DarkModal } from '../../views/DarkModal'
import { PaneControlButtons } from '../../views/PaneControlButtons'
import { SlantedTitle } from '../../views/SlantedTitle'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'

export default memo(function UserEditPage() {
  const isActive = useIsHomeTypeActive('userEdit')
  if (!isActive) return null
  return (
    <DarkModal
      hide={false}
      outside={
        <>
          <UserSlantedTitle />
          <PaneControlButtons>
            <StackViewCloseButton />
          </PaneControlButtons>
        </>
      }
    >
      <YStack pointerEvents="auto" width="95%" maxWidth={880} height="100%" flex={1}>
        <Suspense fallback={<LoadingItems />}>
          <UserOnboard
            hideLogo
            onFinish={() => {
              router.navigate({
                name: 'user',
                params: {
                  username: userStore.user?.username ?? '',
                },
              })
            }}
          />
        </Suspense>
      </YStack>
    </DarkModal>
  )
})

const UserSlantedTitle = memo(({}) => {
  const userStore = useUserStore()
  const username = userStore.user?.username ?? ''

  return (
    <YStack marginTop={-20}>
      <SlantedTitle alignSelf="center">{username}</SlantedTitle>
    </YStack>
  )
})
