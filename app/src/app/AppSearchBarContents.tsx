import { MapPin, Search } from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { TouchableOpacity } from 'react-native'
import { Button, HStack, Spacer, VStack, useMedia } from 'snackui'

import { isWeb, searchBarHeight } from '../constants/constants'
import { AppActionButton } from './AppActionButton'
import { AppMenuButton } from './AppMenuButton'
import { AppSearchInput } from './AppSearchInput'
import { AppSearchInputLocation } from './AppSearchInputLocation'
import { autocompletesStore } from './AutocompletesStore'
import { SearchBarActionButton } from './SearchBarActionButton'
import { UserMenuButton } from './UserMenuButton'
import { useUserStore } from './userStore'
import { DishLogoButton } from './views/DishLogoButton'

export const AppSearchBarContents = memo(({ isColored }: { isColored: boolean }) => {
  const autocompletes = useStoreInstance(autocompletesStore)
  const focus = autocompletes.visible ? autocompletes.target : false
  const media = useMedia()
  const showLocation = focus === 'location'
  const userStore = useUserStore()

  const searchInputEl = <AppSearchInput key={0} />
  const searchLocationEl = <AppSearchInputLocation key={1} />

  return (
    <HStack
      width="100%"
      flex={1}
      pointerEvents="auto"
      alignItems="center"
      justifyContent="center"
      userSelect="none"
      paddingHorizontal={media.sm ? 5 : 14}
      minHeight={searchBarHeight}
    >
      {!media.sm && <SearchBarActionButton />}

      <VStack paddingHorizontal={media.sm ? 2 : 12} maxHeight={searchBarHeight} overflow="hidden">
        <DishLogoButton color={isColored ? '#fff' : undefined} />
      </VStack>

      <VStack
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
              <VStack justifyContent="center" width="100%" maxWidth="100%" flex={1}>
                {searchInputEl}
              </VStack>
            )}
          </>
        )}

        {media.xs && isWeb && (
          <>
            {/* keep both in dom so we have access to ref */}
            <VStack
              flex={1}
              maxWidth="100%"
              width="100%"
              overflow="hidden"
              display={showLocation ? 'flex' : 'none'}
            >
              {searchLocationEl}
            </VStack>
            <VStack
              flex={1}
              maxWidth="100%"
              width="100%"
              overflow="hidden"
              display={!showLocation ? 'flex' : 'none'}
            >
              {searchInputEl}
            </VStack>
          </>
        )}
      </VStack>

      {!media.xs && (
        <>
          <Spacer size={4} />
          <VStack
            className="ease-in-out"
            overflow="hidden"
            minWidth={media.sm ? 220 : 260}
            width="19%"
            maxWidth="50%"
            {...(media.sm && {
              maxWidth: focus === 'search' ? 120 : focus === 'location' ? '100%' : '25%',
            })}
            flex={media.sm ? 1 : 10}
          >
            {searchLocationEl}
          </VStack>
        </>
      )}

      {media.xs && (
        <>
          <TouchableOpacity>
            <Button
              chromeless
              onPressOut={() => {
                autocompletes.setTarget(showLocation ? 'search' : 'location')
              }}
            >
              {showLocation ? (
                <Search color={'#999'} size={20} opacity={0.5} />
              ) : (
                <MapPin color={'#999'} size={20} opacity={0.5} />
              )}
            </Button>
          </TouchableOpacity>
        </>
      )}

      {!media.sm && !media.xs && (
        <>
          <Spacer />

          {userStore.isLoggedIn && (
            <>
              <Suspense fallback={<Spacer size={32} />}>
                <UserMenuButton />
              </Suspense>
            </>
          )}

          <VStack>
            <AppActionButton />
          </VStack>

          <Suspense fallback={null}>
            <AppMenuButton />
          </Suspense>
        </>
      )}
    </HStack>
  )
})
