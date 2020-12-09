import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  Map,
  Search,
} from '@dish/react-feather'
import React, { Suspense, memo } from 'react'
import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import { AbsoluteVStack, HStack, LinearGradient, Spacer, VStack } from 'snackui'

import { AppMenu } from './AppMenu'
import { AppSearchInput } from './AppSearchInput'
import { AppSearchLocationInput } from './AppSearchLocationInput'
import {
  searchBarHeight,
  searchBarMaxWidth,
  searchBarTopOffset,
  zIndexSearchBarFloating,
} from './constants'
import { useIsNarrow, useIsReallyNarrow } from './hooks/useIs'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { omStatic } from './state/omStatic'
import { useOvermind } from './state/useOvermind'
import { DishLogoButton } from './views/DishLogoButton'
import { LinkButton } from './views/ui/LinkButton'

const isWeb = Platform.OS === 'web'

export const AppSearchBar = () => {
  const isSmall = useIsNarrow()

  if (!isSmall) {
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
  const isSmall = useIsNarrow()
  const { background, backgroundRgb } = useSearchBarTheme()
  const height = searchBarHeight + 4

  if (isSmall) {
    return null
  }

  // useLayoutEffect(() => {
  //   if (isInitial.current) {
  //     isInitial.current = false
  //     return
  //   }
  //   const parent = parentIds[isSmall ? 'large' : 'small']
  //   const newParent = parentIds[isSmall ? 'small' : 'large']
  //   sendReparentableChild(parent, newParent, 0, 0)
  // }, [isSmall])

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
          borderRadius={100}
          overflow="hidden"
          zIndex={102}
          fullscreen
          height={height}
          justifyContent="center"
          alignItems="center"
          shadowColor="rgba(0,0,0,0.24)"
          shadowOffset={{ height: 3, width: 0 }}
          shadowRadius={12}
        >
          <AbsoluteVStack
            // opacity={0.76}
            backgroundColor={background}
            fullscreen
          >
            <LinearGradient
              style={[StyleSheet.absoluteFill, { left: '80%' }]}
              start={[0.5, 0.5]}
              end={[1, 1]}
              colors={[background, `rgb(${backgroundRgb.map((x) => x * 0.8)})`]}
            />
            <LinearGradient
              style={[StyleSheet.absoluteFill]}
              colors={['rgba(255,255,255,0.03)', `rgba(255,255,255,0)`]}
            />
          </AbsoluteVStack>
        </AbsoluteVStack>
        <VStack
          position="relative"
          zIndex={104}
          flex={1}
          paddingHorizontal={12}
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
  const isSmall = useIsNarrow()
  const isReallySmall = useIsReallyNarrow()
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
      <VStack paddingHorizontal={8}>
        <DishLogoButton />
      </VStack>

      {!isReallySmall && <SearchBarActionButton />}

      <HStack
        className="ease-in-out"
        position="relative"
        width="43%"
        maxWidth={
          isReallySmall
            ? 'auto'
            : isSmall && om.state.home.showAutocomplete === 'location'
            ? 120
            : '100%'
        }
        alignItems="center"
      >
        {!isReallySmall && <AppSearchInput />}

        {/* Search Input Start */}
        {isReallySmall && !isWeb && (
          <>
            {showLocation && <AppSearchLocationInput />}
            {!showLocation && <AppSearchInput />}
          </>
        )}

        {isReallySmall && isWeb && (
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

      {!isReallySmall && (
        <>
          <Spacer size={6} />
          <VStack
            className="ease-in-out"
            overflow="hidden"
            minWidth={isSmall ? 240 : 310}
            width="19%"
            maxWidth={
              isSmall
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
        </>
      )}

      {isReallySmall && (
        <HStack padding={12}>
          <TouchableOpacity
            onPress={() => {
              console.log('toggling', showLocation)
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

      {!isReallySmall && (
        <Suspense fallback={null}>
          <AppMenu />
        </Suspense>
      )}
    </HStack>
  )
})

const SearchBarActionButton = memo(() => {
  const isSmall = useIsNarrow()
  const { color } = useSearchBarTheme()
  const om = useOvermind()
  const { showAutocomplete } = om.state.home
  const isDisabled =
    !showAutocomplete && om.state.home.currentStateType === 'home'

  const Icon = (() => {
    if (showAutocomplete) {
      if (isSmall) return ArrowDown
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
