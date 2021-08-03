import { ArrowUp, ChevronLeft, MapPin, Search } from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { TouchableOpacity } from 'react-native'
import { HStack, Spacer, VStack, useMedia } from 'snackui'

import { isWeb, searchBarHeight } from '../constants/constants'
import { AppMenu } from './AppMenu'
import { AppSearchInput } from './AppSearchInput'
import { AppSearchInputLocation } from './AppSearchInputLocation'
import { autocompletesStore } from './AutocompletesStore'
import { homeStore, useHomeStoreSelector } from './homeStore'
import { DishLogoButton } from './views/DishLogoButton'
import { Link } from './views/Link'

export const AppSearchBarContents = memo(({ isColored }: { isColored: boolean }) => {
  const autocompletes = useStoreInstance(autocompletesStore)
  const focus = autocompletes.visible ? autocompletes.target : false
  const media = useMedia()
  const showLocation = focus === 'location'

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
      paddingHorizontal={media.xs ? 5 : 14}
      minHeight={searchBarHeight}
    >
      {!media.sm && <SearchBarActionButton />}

      <VStack paddingHorizontal={media.xs ? 2 : 12}>
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
            flex={1}
          >
            {searchLocationEl}
          </VStack>
          <Spacer size={16} />
        </>
      )}

      {media.xs && (
        <TouchableOpacity
          onPressOut={() => {
            autocompletes.setTarget(showLocation ? 'search' : 'location')
          }}
        >
          <VStack padding={12}>
            {showLocation ? (
              <Search color={isWeb ? 'var(--color)' : '#999'} size={22} opacity={0.5} />
            ) : (
              <MapPin color={isWeb ? 'var(--color)' : '#999'} size={22} opacity={0.5} />
            )}
          </VStack>
        </TouchableOpacity>
      )}

      {!media.sm && !media.xs && (
        <Suspense fallback={null}>
          <AppMenu />
        </Suspense>
      )}
    </HStack>
  )
})
const SearchBarActionButton = memo(() => {
  const upRoute = useHomeStoreSelector((x) => x.upRoute)
  const isOnHome = useHomeStoreSelector((x) => x.currentStateType === 'home')
  const autocompletes = useStoreInstance(autocompletesStore)
  const showAutocomplete = autocompletes.visible
  const isDisabled = !showAutocomplete && isOnHome
  // const theme = useTheme()
  const Icon = (() => {
    if (showAutocomplete) {
      // if (media.sm) {
      //   return ArrowDown
      // }
      return ArrowUp
    }
    return ChevronLeft
  })()

  return (
    <Link
      marginRight={-5}
      onPress={() => {
        if (showAutocomplete) {
          autocompletes.setVisible(false)
        } else {
          homeStore.popBack()
        }
      }}
    >
      <Link {...upRoute}>
        <VStack
          alignSelf="center"
          skewX="-12deg"
          pointerEvents={isDisabled ? 'none' : 'auto'}
          width={30}
          height={searchBarHeight}
          alignItems="center"
          justifyContent="center"
          opacity={0}
          padding={0}
          backgroundColor="rgba(0,0,0,0.1)"
          {...(!isDisabled && {
            opacity: 0.5,
            hoverStyle: {
              opacity: 1,
            },
            pressStyle: {
              opacity: 0.2,
            },
          })}
        >
          <VStack skewX="12deg">
            <Icon color={isWeb ? 'var(--color)' : '#888'} size={20} />
          </VStack>
        </VStack>
      </Link>
    </Link>
  )
})
