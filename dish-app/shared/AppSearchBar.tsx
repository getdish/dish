import { ArrowUp, ChevronLeft, Map, Search } from '@dish/react-feather'
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

import { AppMenu } from './AppMenu'
import { AppSearchInput } from './AppSearchInput'
import { AppSearchLocationInput } from './AppSearchLocationInput'
import {
  searchBarHeight,
  searchBarMaxWidth,
  searchBarTopOffset,
  zIndexSearchBarFloating,
} from './constants'
import { DishHorizonView } from './DishHorizonView'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { omStatic } from './state/omStatic'
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
      left={6}
      right={6}
      zIndex={zIndexSearchBarFloating}
      position="absolute"
      marginTop={searchBarTopOffset}
      alignItems="center"
      pointerEvents="none"
    >
      <VStack
        position="relative"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height={height}
        maxWidth={searchBarMaxWidth + 20}
      >
        <AbsoluteVStack
          borderRadius={15}
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
          {/* <BlurView
            position="absolute"
            fullscreen
            fallbackBackgroundColor="#000"
          /> */}
          <AbsoluteVStack
            borderWidth={3}
            borderColor="rgba(0,0,0,0.2)"
            borderRadius={14}
            fullscreen
          />
          <AbsoluteVStack
            borderWidth={1}
            borderColor="rgba(0,0,0,0.35)"
            borderRadius={14}
            fullscreen
          />
          <LinearGradient
            style={[StyleSheet.absoluteFill]}
            colors={[
              'rgba(0,0,0,0.05)',
              `rgba(255,255,255,0.05)`,
              'rgba(0,0,0,0.05)',
            ]}
          />
          <AbsoluteVStack
            opacity={0.45}
            fullscreen
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
  const focus = om.state.home.showAutocomplete
  const media = useMedia()
  const { color, background } = useSearchBarTheme()
  const showLocation = om.state.home.showAutocomplete === 'location'

  return (
    <HStack
      flex={1}
      overflow="hidden"
      pointerEvents="auto"
      alignItems="center"
      justifyContent="center"
      userSelect="none"
      paddingHorizontal={10}
      minHeight={searchBarHeight}
    >
      <VStack paddingHorizontal={media.xs ? 0 : 6}>
        <DishLogoButton />
      </VStack>

      {!media.xs && <SearchBarActionButton />}

      <HStack
        className="ease-in-out"
        position="relative"
        width={media.xs ? 'auto' : '43%'}
        maxWidth={
          media.xs
            ? 'auto'
            : media.sm && om.state.home.showAutocomplete === 'location'
            ? 120
            : '100%'
        }
        flex={1}
        alignItems="center"
      >
        {!media.xs && <AppSearchInput />}

        {/* Search Input Start */}
        {media.xs && !isWeb && (
          <>
            {showLocation && <AppSearchLocationInput />}
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
              <AppSearchLocationInput />
            </VStack>
            <VStack display={!showLocation ? 'contents' : 'none'}>
              <AppSearchInput />
            </VStack>
          </>
        )}
      </HStack>

      {!media.xs && (
        <>
          <Spacer size={16} />
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
            <AppSearchLocationInput />
          </VStack>
          <Spacer size={16} />
        </>
      )}

      {media.xs && (
        <HStack padding={12}>
          <TouchableOpacity
            onPress={() => {
              omStatic.actions.home.setShowAutocomplete(
                showLocation ? 'search' : 'location'
              )
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
  const { showAutocomplete } = om.state.home
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
          om.actions.home.setShowAutocomplete(false)
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
      <Icon color={color} size={20} style={{ marginTop: 3 }} />
    </LinkButton>
  )
})
