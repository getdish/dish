import { isWeb, searchBarHeight } from '../constants/constants'
import { AppActionButton } from './AppActionButton'
import { AppMenuButton } from './AppMenuButton'
import { AppSearchInput } from './AppSearchInput'
import { AppSearchInputLocation } from './AppSearchInputLocation'
import { autocompletesStore } from './AutocompletesStore'
import { UserMenuButton } from './UserMenuButton'
import { useUserStore } from './userStore'
import { DishLogoButton } from './views/DishLogoButton'
import { Button, Spacer, XStack, YStack, useMedia } from '@dish/ui'
import { useStoreInstance } from '@dish/use-store'
import { MapPin, Search } from '@tamagui/feather-icons'
import React, { Suspense, memo } from 'react'
import { TouchableOpacity } from 'react-native'

export const AppSearchBarContents = memo(() => {
  const autocompletes = useStoreInstance(autocompletesStore)
  const focus = autocompletes.visible ? autocompletes.target : false
  const media = useMedia()
  const showLocation = focus === 'location'
  const userStore = useUserStore()

  const searchInputEl = <AppSearchInput key={0} />
  const searchLocationEl = <AppSearchInputLocation key={1} />

  return (
    <XStack
      width="100%"
      flex={1}
      pointerEvents="auto"
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="$1"
      minHeight={searchBarHeight}
    >
      <YStack px="$1" maxHeight={searchBarHeight} overflow="hidden">
        <DishLogoButton />
      </YStack>

      <YStack
        className="ease-in-out"
        position="relative"
        width={media.sm ? 'auto' : '43%'}
        maxWidth={media.xs ? 'auto' : '100%'}
        // fixes a weird bug where it wouldn't shrink even though this is already
        // applied in base.css, adding it here fixes letting search shrink horizontally
        // on mobile...
        minWidth={0}
        // ipad
        flex={media.sm ? 6 : 1}
        alignItems="center"
      >
        {!media.xs && searchInputEl}

        {/* Search Input Start */}
        {media.xs && !isWeb && (
          <>
            {showLocation && searchLocationEl}
            {!showLocation && (
              <YStack justifyContent="center" width="100%" maxWidth="100%" flex={1}>
                {searchInputEl}
              </YStack>
            )}
          </>
        )}

        {media.xs && isWeb && (
          <>
            {/* keep both in dom so we have access to ref */}
            <YStack
              flex={1}
              maxWidth="100%"
              width="100%"
              overflow="hidden"
              display={showLocation ? 'flex' : 'none'}
            >
              {searchLocationEl}
            </YStack>
            <YStack
              flex={1}
              maxWidth="100%"
              width="100%"
              overflow="hidden"
              display={!showLocation ? 'flex' : 'none'}
            >
              {searchInputEl}
            </YStack>
          </>
        )}
      </YStack>

      {!media.xs && (
        <>
          <Spacer size={4} />
          <YStack
            className="ease-in-out"
            overflow="hidden"
            minWidth={260}
            width="19%"
            maxWidth="50%"
            flex={10}
            $sm={{
              flex: 1,
              maxWidth: focus === 'search' ? 120 : focus === 'location' ? '100%' : '25%',
              minWidth: 220,
            }}
          >
            {searchLocationEl}
          </YStack>
        </>
      )}

      {media.xs && (
        <>
          <Spacer size="$1" />
          <Button
            chromeless
            icon={showLocation ? Search : MapPin}
            scaleIcon={1.25}
            onPressOut={() => {
              autocompletes.setTarget(showLocation ? 'search' : 'location')
            }}
          />
        </>
      )}

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

          <YStack>
            <AppActionButton />
          </YStack>

          <Suspense fallback={null}>
            <AppMenuButton />
          </Suspense>
        </>
      )}
    </XStack>
  )
})
