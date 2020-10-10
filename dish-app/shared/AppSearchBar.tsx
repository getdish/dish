import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  Home,
  Map,
  Search,
} from '@dish/react-feather'
import { AbsoluteVStack, HStack, Spacer, VStack } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { Platform } from 'react-native'

import { AppMenu } from './AppMenu'
import { AppSearchInput } from './AppSearchInput'
import { AppSearchLocationInput } from './AppSearchLocationInput'
import {
  pageWidthMax,
  searchBarHeight,
  searchBarMaxWidth,
  searchBarTopOffset,
  zIndexSearchBarFloating,
} from './constants'
import { useIsNarrow, useIsReallyNarrow } from './hooks/useIs'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { InputStore } from './InputStore'
import { useOvermind } from './state/om'
import { DishLogoButton } from './views/DishLogoButton'
import { LinkButton } from './views/ui/LinkButton'

const isWeb = Platform.OS === 'web'

export const AppSearchBarDrawer = () => {
  const isSmall = useIsNarrow()

  if (!isSmall) {
    return null
  }

  return (
    <VStack width="100%" paddingVertical={2} minHeight={searchBarHeight}>
      <HomeSearchBar />
    </VStack>
  )
}

export const parentIds = {
  small: 'searchbar-small',
  large: 'searchbar-large',
}

const borderRadius = 14

export const HomeSearchBarFloating = () => {
  const isSmall = useIsNarrow()
  const { background } = useSearchBarTheme()

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
      zIndex={zIndexSearchBarFloating}
      position="absolute"
      fullscreen
      marginTop={searchBarTopOffset}
      alignItems="center"
      pointerEvents="none"
      left={6}
      right={6}
    >
      <VStack
        zIndex={12}
        position="relative"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height={searchBarHeight}
        maxWidth={searchBarMaxWidth + 20}
      >
        <AbsoluteVStack
          className="blur skewX"
          borderRadius={12}
          overflow="hidden"
          zIndex={102}
          fullscreen
          height={searchBarHeight}
          justifyContent="center"
          alignItems="center"
          shadowColor="rgba(0,0,0,0.2)"
          shadowOffset={{ height: 3, width: 0 }}
          shadowRadius={14}
        >
          <AbsoluteVStack
            // opacity={0.76}
            backgroundColor={background}
            fullscreen
          />
        </AbsoluteVStack>
        <VStack
          position="relative"
          zIndex={104}
          flex={1}
          paddingHorizontal={12}
          height={searchBarHeight}
          justifyContent="center"
          overflow="hidden"
          width="100%"
          maxWidth={searchBarMaxWidth}
        >
          <HStack alignItems="center" justifyContent="center">
            <VStack maxWidth="100%" flex={1} transform={[{ translateY: -1 }]}>
              <Suspense fallback={null}>
                <HomeSearchBar />
              </Suspense>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    </AbsoluteVStack>
  )
}

export class SearchBarStore extends Store {
  showLocation = false

  setShowLocation(val: boolean) {
    this.showLocation = val
  }
}

const HomeSearchBar = memo(() => {
  const om = useOvermind()
  const locationInputStore = useStore(InputStore, { name: 'location' })
  const inputStore = useStore(InputStore, { name: 'search' })
  const focus = om.state.home.showAutocomplete
  const store = useStore(SearchBarStore)
  const isSmall = useIsNarrow()
  const isReallySmall = useIsReallyNarrow()
  const { color, background } = useSearchBarTheme()

  return (
    <HStack
      flex={1}
      overflow="hidden"
      pointerEvents="auto"
      alignItems="center"
      justifyContent="center"
      userSelect="none"
      width="100%"
      minHeight={searchBarHeight}
    >
      <VStack paddingHorizontal={8}>
        <DishLogoButton />
      </VStack>

      {!isReallySmall && <SearchBarActionButton />}

      <HStack
        className="ease-in-out"
        position="relative"
        flex={1.5}
        maxWidth={
          isReallySmall
            ? 'auto'
            : isSmall && om.state.home.showAutocomplete === 'location'
            ? 120
            : '100%'
        }
        alignItems="center"
        overflow="hidden"
      >
        {/* Search Input Start */}
        {isReallySmall && !isWeb && (
          <>
            {store.showLocation && <AppSearchLocationInput />}
            {!store.showLocation && <AppSearchInput />}
          </>
        )}

        {isReallySmall && isWeb && (
          <>
            {/* keep both in dom so we have access to ref */}
            <VStack display={store.showLocation ? 'contents' : ('none' as any)}>
              <AppSearchLocationInput />
            </VStack>
            <VStack
              display={!store.showLocation ? 'contents' : ('none' as any)}
            >
              <AppSearchInput />
            </VStack>
          </>
        )}
        {!isReallySmall && <AppSearchInput />}
      </HStack>

      {!isReallySmall && (
        <>
          <Spacer size={6} />
          <VStack
            className="ease-in-out"
            overflow="hidden"
            minWidth={310}
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
        <LinkButton
          onPress={() => {
            const next = !store.showLocation
            // todo put this in effect...
            if (next) {
              locationInputStore.node?.focus()
            } else {
              inputStore.node?.focus()
            }
            store.setShowLocation(next)
          }}
          padding={12}
        >
          {store.showLocation ? (
            <Search color={color} size={22} opacity={0.65} />
          ) : (
            <VStack width={22} height={22} position="relative">
              {/* <AbsoluteVStack
                bottom={-10}
                left={-10}
                backgroundColor={background}
                width={22}
                height={22}
                zIndex={-2}
                alignItems="center"
                justifyContent="center"
                borderRadius={20}
              >
                <Search color={color} size={20} opacity={0.65} />
              </AbsoluteVStack> */}
              <Map color={color} size={22} opacity={0.65} />
            </VStack>
          )}
        </LinkButton>
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
      return Home
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
