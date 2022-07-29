import { searchBarHeight } from '../constants/constants'
import { AppActionButton } from './AppActionButton'
import { AppMenuButton } from './AppMenuButton'
import { AppSearchInput } from './AppSearchInput'
import { UserMenuButton } from './UserMenuButton'
import { useUserStore } from './userStore'
import { DishLogoButton } from './views/DishLogoButton'
import { Spacer, XStack, YStack, useMedia } from '@dish/ui'
import React, { Suspense, memo } from 'react'

export const AppSearchBarContents = memo(() => {
  const media = useMedia()
  const userStore = useUserStore()

  return (
    <XStack
      width="100%"
      flex={1}
      pointerEvents="auto"
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="$2"
      minHeight={searchBarHeight}
    >
      <YStack px="$2" maxHeight={searchBarHeight} overflow="hidden">
        <DishLogoButton />
      </YStack>

      <YStack f={10} className="ease-in-out" position="relative" alignItems="center">
        <AppSearchInput />
      </YStack>

      {media.gtSm && (
        <>
          <Spacer />

          {userStore.isLoggedIn && (
            <>
              <Suspense fallback={<Spacer size={32} />}>
                <UserMenuButton />
              </Suspense>
            </>
          )}

          <AppActionButton />

          <Suspense fallback={null}>
            <AppMenuButton />
          </Suspense>
        </>
      )}
    </XStack>
  )
})
