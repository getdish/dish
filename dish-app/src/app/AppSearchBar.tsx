import { ArrowUp, ChevronLeft, MapPin, Search } from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { AbsoluteVStack, HStack, LinearGradient, Spacer, Theme, VStack, useMedia } from 'snackui'

import { bgLightTranslucent } from '../constants/colors'
import {
  isWeb,
  searchBarHeight,
  searchBarMaxWidth,
  searchBarTopOffset,
  zIndexSearchBarFloating,
} from '../constants/constants'
import { AppMenu } from './AppMenu'
import { AppSearchInput } from './AppSearchInput'
import { AppSearchInputLocation } from './AppSearchInputLocation'
import { autocompletesStore } from './AutocompletesStore'
import { homeStore, useHomeStoreSelector } from './homeStore'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { DishLogoButton } from './views/DishLogoButton'
import { Link } from './views/Link'

export const AppSearchBar = () => {
  const media = useMedia()
  if (!media.sm) {
    return null
  }
  return (
    <Suspense fallback={null}>
      <VStack width="100%" paddingVertical={2} minHeight={searchBarHeight}>
        <AppSearchBarContents isColored={false} />
      </VStack>
    </Suspense>
  )
}

export const parentIds = {
  small: 'searchbar-small',
  large: 'searchbar-large',
}

const borderRadius = 20

export const AppSearchBarFloating = () => {
  const media = useMedia()
  const { theme: searchThemeName, background, isColored } = useSearchBarTheme()
  const height = searchBarHeight + 4

  if (media.sm) {
    return null
  }

  // useLayoutEffect(() => {
  //   if (isInitial.current) {
  //     isInitial.current = false
  //     return
  //   }
  //   const parent = parentIds[media.sm ? 'large' : 'small']
  //   const newParent = parentIds[media.sm ? 'small' : 'large']
  //   sendReparentableChild(parent, newParent, 0, 0)
  // }, [media.sm])

  const themeName = media.sm ? 'light' : searchThemeName

  return (
    <Theme name={themeName}>
      <AbsoluteVStack
        className="searchbar-container ease-in-out"
        zIndex={zIndexSearchBarFloating}
        position="absolute"
        alignItems="center"
        pointerEvents="none"
        left={0}
        right={0}
        top={0}
      >
        {/* under fade */}
        <AbsoluteVStack
          // doesnt fix flickering
          // display={media.sm ? 'none' : 'flex'}
          fullscreen
          zIndex={-1}
        >
          <LinearGradient
            style={[StyleSheet.absoluteFill]}
            colors={[bgLightTranslucent, `rgba(255,255,255,0)`]}
          />
        </AbsoluteVStack>

        {/* container */}
        <AbsoluteVStack top={searchBarTopOffset} left={20} right={20} alignItems="center">
          {/* bg/shadows */}
          <VStack
            position="relative"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height={height}
            maxWidth={searchBarMaxWidth}
          >
            {/* SHADOW AND BACKGROUND */}
            <AbsoluteVStack
              borderRadius={borderRadius}
              className="searchbar-shadow"
              skewX="-12deg"
              overflow="hidden"
              zIndex={102}
              opacity={1}
              fullscreen
              height={height}
              justifyContent="center"
              alignItems="center"
              backgroundColor={background}
              shadowColor="#000"
              shadowOpacity={0.5}
              shadowOffset={{ height: 2, width: 0 }}
              shadowRadius={15}
            />
            <VStack
              position="relative"
              zIndex={104}
              flex={1}
              height={height}
              paddingRight={10}
              justifyContent="center"
              width="100%"
              maxWidth={searchBarMaxWidth}
            >
              <Suspense fallback={null}>
                <AppSearchBarContents isColored={isColored} />
              </Suspense>
            </VStack>
          </VStack>
        </AbsoluteVStack>
      </AbsoluteVStack>
    </Theme>
  )
}

const AppSearchBarContents = memo(({ isColored }: { isColored: boolean }) => {
  const autocompletes = useStoreInstance(autocompletesStore)
  const focus = autocompletes.visible ? autocompletes.target : false
  const media = useMedia()
  const showLocation = focus === 'location'

  const searchInputEl = <AppSearchInput key={0} />
  const searchLocationEl = <AppSearchInputLocation key={1} />

  return (
    <HStack
      flex={1}
      pointerEvents="auto"
      alignItems="center"
      justifyContent="center"
      userSelect="none"
      paddingHorizontal={media.xs ? 5 : 0}
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
              <VStack width="100%" maxWidth="100%" flex={1}>
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
              overflow="hidden"
              display={showLocation ? 'flex' : 'none'}
            >
              {searchLocationEl}
            </VStack>
            <VStack
              flex={1}
              maxWidth="100%"
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
          <Spacer size={10} />
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
          scale={0.97}
          pointerEvents={isDisabled ? 'none' : 'auto'}
          width={30}
          height={searchBarHeight + 5}
          borderTopLeftRadius={borderRadius}
          borderBottomLeftRadius={borderRadius}
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
