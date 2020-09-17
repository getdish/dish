import { ChevronLeft, Home, MapPin, Search } from '@dish/react-feather'
import { AbsoluteVStack, HStack, Spacer, VStack } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { Platform } from 'react-native'

import { AppSearchInput } from './AppSearchInput'
import { AppSearchLocationInput } from './AppSearchLocationInput'
import {
  pageWidthMax,
  searchBarHeight,
  searchBarTopOffset,
  zIndexSearchBarFloating,
} from './constants'
import { rgbString } from './helpers/rgbString'
import { HomeMenu } from './HomeMenu'
import { useCurrentLenseColor } from './hooks/useCurrentLenseColor'
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
  const rgb = useCurrentLenseColor()
  const backgroundColor = rgbString(rgb)

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
    <Suspense fallback={null}>
      <AbsoluteVStack
        className="searchbar-container ease-in-out"
        zIndex={zIndexSearchBarFloating}
        position="absolute"
        fullscreen
        marginTop={searchBarTopOffset}
        left={16}
        right={16}
        alignItems="center"
        pointerEvents="none"
        {...(isSmall && {
          left: -6,
          right: -6,
          top: '20%',
        })}
      >
        <VStack
          zIndex={12}
          position="relative"
          alignItems="center"
          width="100%"
          height={searchBarHeight}
        >
          <VStack
            flex={1}
            pointerEvents="auto"
            width="100%"
            maxWidth={pageWidthMax - 200}
            position="relative"
          >
            {/* shadow */}
            {!isSmall && (
              <>
                <VStack
                  height={searchBarHeight - 1}
                  borderRadius={borderRadius}
                  zIndex={0}
                  className="skewX"
                  position="absolute"
                  top={0}
                  left={1}
                  width={isWeb ? `calc(100% - 1px)` : '100%'}
                  shadowColor="rgba(0,0,0,0.2)"
                  shadowOffset={{ height: 3, width: 0 }}
                  shadowRadius={12}
                />
              </>
            )}
            <VStack
              className="skewX"
              position="relative"
              zIndex={100}
              flex={1}
              paddingHorizontal={8}
              height={searchBarHeight}
              backgroundColor={backgroundColor}
              borderRadius={borderRadius}
              justifyContent="center"
              overflow="hidden"
            >
              <HStack
                className="unskewX"
                alignItems="center"
                justifyContent="center"
              >
                <VStack
                  maxWidth="100%"
                  flex={1}
                  transform={[{ translateY: -1 }]}
                >
                  <HomeSearchBar />
                </VStack>
              </HStack>

              {/* inner borders */}
              <AbsoluteVStack
                borderRadius={borderRadius}
                fullscreen
                pointerEvents="none"
                borderTopColor="rgba(255,255,255,0.2)"
                borderTopWidth={1}
                borderBottomColor="rgba(0,0,0,0.1)"
                borderBottomWidth={2}
              />
            </VStack>
          </VStack>
        </VStack>
      </AbsoluteVStack>
    </Suspense>
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
  const { color } = useSearchBarTheme()
  const isShowingAutocompleteWhenSmall =
    !!om.state.home.showAutocomplete && isSmall

  return (
    <HStack
      flex={1}
      overflow="hidden"
      pointerEvents="auto"
      alignItems="center"
      justifyContent="center"
      userSelect="none"
      width="100%"
    >
      <VStack paddingHorizontal={8}>
        <DishLogoButton />
      </VStack>

      <VStack
        {...(isShowingAutocompleteWhenSmall && {
          opacity: 0,
          width: 0,
        })}
      >
        <HomeSearchBarHomeBackButton />
      </VStack>

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
            <MapPin color={color} size={22} opacity={0.65} />
          )}
        </LinkButton>
      )}

      <HomeMenu />
    </HStack>
  )
})

const HomeSearchBarHomeBackButton = memo(() => {
  const { color } = useSearchBarTheme()
  const om = useOvermind()
  const isDisabled = om.state.home.currentStateType === 'home'
  const iconProps = {
    color,
    size: 20,
    style: { marginTop: 3 },
  }
  return (
    <LinkButton
      justifyContent="center"
      alignItems="center"
      pointerEvents="auto"
      width={32}
      opacity={isDisabled ? 0.1 : 0.7}
      disabled={isDisabled}
      onPress={() => om.actions.home.popBack()}
      {...(!isDisabled && {
        hoverStyle: {
          opacity: 1,
        },
        pressStyle: {
          opacity: 0.2,
        },
      })}
    >
      {om.state.home.states.length === 2 ? (
        <Home {...iconProps} />
      ) : (
        <ChevronLeft {...iconProps} />
      )}
    </LinkButton>
  )
})
