import { ArrowUp, ChevronLeft, Map, Search } from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  Spacer,
  VStack,
  useMedia,
} from 'snackui'

import { autocompletesStore } from './AppAutocomplete'
import { AppMenu } from './AppMenu'
import { AppSearchInput } from './AppSearchInput'
import { AppSearchInputLocation } from './AppSearchInputLocation'
import { bgLightTranslucent } from './colors'
import {
  searchBarHeight,
  searchBarMaxWidth,
  searchBarTopOffset,
  zIndexSearchBarFloating,
} from './constants'
import { DishHorizonView } from './DishHorizonView'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { useOvermind } from './state/useOvermind'
import { DishLogoButton } from './views/DishLogoButton'
import { LinkButton } from './views/ui/LinkButton'

const isWeb = Platform.OS === 'web'

export const AppSearchBar = () => {
  const media = useMedia()
  if (!media.sm) {
    return null
  }
  return (
    <VStack width="100%" paddingVertical={2} minHeight={searchBarHeight}>
      <AppSearchBarContents />
    </VStack>
  )
}

export const parentIds = {
  small: 'searchbar-small',
  large: 'searchbar-large',
}

export const AppSearchBarFloating = () => {
  const media = useMedia()
  // const { background, backgroundRgb } = useSearchBarTheme()
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

  return (
    <AbsoluteVStack
      className="searchbar-container ease-in-out"
      zIndex={zIndexSearchBarFloating}
      position="absolute"
      alignItems="center"
      pointerEvents="none"
      paddingLeft={6}
      paddingRight={6}
      paddingTop={searchBarTopOffset}
      left={0}
      right={0}
      top={0}
    >
      <AbsoluteVStack fullscreen zIndex={-1}>
        <LinearGradient
          style={[StyleSheet.absoluteFill]}
          colors={[bgLightTranslucent, `rgba(255,255,255,0)`]}
        />
      </AbsoluteVStack>
      <VStack
        position="relative"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height={height}
        maxWidth={searchBarMaxWidth + 20}
      >
        <AbsoluteVStack
          borderRadius={13}
          transform={[{ skewX: '-12deg' }]}
          overflow="hidden"
          zIndex={102}
          fullscreen
          height={height}
          justifyContent="center"
          alignItems="center"
          backgroundColor="#111"
          shadowColor="rgba(0,0,0,0.3)"
          shadowOffset={{ height: 1, width: 0 }}
          shadowRadius={15}
        >
          <AbsoluteVStack
            borderWidth={3}
            borderColor="rgba(0,0,0,0.2)"
            borderRadius={12}
            fullscreen
          />
          <AbsoluteVStack
            borderWidth={1}
            borderColor="rgba(0,0,0,0.35)"
            borderRadius={12}
            fullscreen
          />
          <LinearGradient
            style={[StyleSheet.absoluteFill]}
            colors={[
              'rgba(0,0,0,0.05)',
              `rgba(0,0,0,0.05)`,
              'rgba(0,0,0,0.05)',
            ]}
          />
          <AbsoluteVStack
            opacity={0.45}
            top={0}
            right={0}
            bottom={0}
            width={300}
            transform={[{ translateX: 240 }]}
          >
            <DishHorizonView />
          </AbsoluteVStack>
          <AbsoluteVStack
            fullscreen
            transform={[{ skewX: '12deg' }]}
          ></AbsoluteVStack>
        </AbsoluteVStack>
        <VStack
          position="relative"
          zIndex={104}
          flex={1}
          paddingHorizontal={3}
          height={height}
          justifyContent="center"
          overflow="hidden"
          width="100%"
          maxWidth={searchBarMaxWidth}
        >
          <Suspense fallback={null}>
            <AppSearchBarContents />
          </Suspense>
        </VStack>
      </VStack>
    </AbsoluteVStack>
  )
}

const AppSearchBarContents = memo(() => {
  const om = useOvermind()
  const autocompletes = useStoreInstance(autocompletesStore)
  const focus = autocompletes.visible ? autocompletes.target : false
  const media = useMedia()
  const { color, background } = useSearchBarTheme()
  const showLocation = focus === 'location'

  return (
    <HStack
      flex={1}
      overflow="hidden"
      pointerEvents="auto"
      alignItems="center"
      justifyContent="center"
      userSelect="none"
      paddingHorizontal={media.xs ? 5 : 10}
      minHeight={searchBarHeight}
    >
      <VStack paddingHorizontal={6}>
        <DishLogoButton />
      </VStack>

      {!media.xs && <SearchBarActionButton />}

      <HStack
        className="ease-in-out"
        position="relative"
        width={media.xs ? 'auto' : '43%'}
        maxWidth={
          media.xs ? 'auto' : media.sm && focus === 'location' ? 120 : '100%'
        }
        flex={1}
        alignItems="center"
      >
        {!media.xs && <AppSearchInput />}

        {/* Search Input Start */}
        {media.xs && !isWeb && (
          <>
            {showLocation && <AppSearchInputLocation />}
            {!showLocation && (
              <VStack flex={1}>
                <AppSearchInput />
              </VStack>
            )}
          </>
        )}

        {media.xs && isWeb && (
          <>
            {/* keep both in dom so we have access to ref */}
            <VStack display={showLocation ? 'contents' : 'none'}>
              <AppSearchInputLocation />
            </VStack>
            <VStack display={!showLocation ? 'contents' : 'none'}>
              <AppSearchInput />
            </VStack>
          </>
        )}
      </HStack>

      {!media.xs && (
        <>
          <Spacer size={12} />
          <VStack
            className="ease-in-out"
            overflow="hidden"
            minWidth={media.sm ? 240 : 310}
            width="19%"
            maxWidth={
              media.sm
                ? focus === 'search'
                  ? 120
                  : focus === 'location'
                  ? '100%'
                  : '25%'
                : '50%'
            }
            flex={1}
          >
            <AppSearchInputLocation />
          </VStack>
          <Spacer size={16} />
        </>
      )}

      {media.xs && (
        <HStack padding={12}>
          <TouchableOpacity
            onPress={() => {
              autocompletes.setTarget(showLocation ? 'search' : 'location')
            }}
          >
            {showLocation ? (
              <Search color={color} size={22} opacity={0.65} />
            ) : (
              <Map color={color} size={22} opacity={0.65} />
            )}
          </TouchableOpacity>
        </HStack>
      )}

      {!media.xs && (
        <Suspense fallback={null}>
          <AppMenu />
        </Suspense>
      )}
    </HStack>
  )
})

const SearchBarActionButton = memo(() => {
  // const media = useMedia()
  const { color } = useSearchBarTheme()
  const om = useOvermind()
  const autocompletes = useStoreInstance(autocompletesStore)
  const showAutocomplete = autocompletes.visible
  const isDisabled =
    !showAutocomplete && om.state.home.currentStateType === 'home'

  const Icon = (() => {
    if (showAutocomplete) {
      // if (media.sm) {
      //   return ArrowDown
      // }
      return ArrowUp
    }
    if (om.state.home.states.length === 2) {
      return ChevronLeft // Home
    }
    return ChevronLeft
  })()

  return (
    <LinkButton
      justifyContent="center"
      alignItems="center"
      pointerEvents="auto"
      width={32}
      opacity={isDisabled ? 0.1 : 0.7}
      disabled={isDisabled}
      onPress={() => {
        if (showAutocomplete) {
          autocompletes.setVisible(false)
        } else {
          om.actions.home.popBack()
        }
      }}
      {...(!isDisabled && {
        hoverStyle: {
          opacity: 1,
        },
        pressStyle: {
          opacity: 0.2,
        },
      })}
    >
      <Icon color={color} size={20} />
    </LinkButton>
  )
})
