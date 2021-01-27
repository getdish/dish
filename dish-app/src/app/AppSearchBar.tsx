import { ArrowUp, ChevronLeft, MapPin, Search } from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  Spacer,
  Theme,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import { bgLightTranslucent } from '../constants/colors'
import {
  searchBarHeight,
  searchBarMaxWidth,
  searchBarTopOffset,
  zIndexSearchBarFloating,
} from '../constants/constants'
import { autocompletesStore } from './AppAutocomplete'
import { AppMenu } from './AppMenu'
import { AppSearchInput } from './AppSearchInput'
import { AppSearchInputLocation } from './AppSearchInputLocation'
import { useHomeStore } from './homeStore'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { DishLogoButton } from './views/DishLogoButton'
import { Link } from './views/Link'

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
    <Theme name="dark">
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
        <AbsoluteVStack fullscreen zIndex={-1}>
          <LinearGradient
            style={[StyleSheet.absoluteFill]}
            colors={[bgLightTranslucent, `rgba(255,255,255,0)`]}
          />
        </AbsoluteVStack>

        {/* container */}
        <AbsoluteVStack
          top={searchBarTopOffset}
          left={20}
          right={20}
          alignItems="center"
        >
          {/* bg/shadows */}
          <VStack
            position="relative"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height={height}
            maxWidth={searchBarMaxWidth}
          >
            <AbsoluteVStack
              borderRadius={13}
              className="searchbar-shadow"
              transform={[{ skewX: '-12deg' }]}
              overflow="hidden"
              zIndex={102}
              fullscreen
              height={height}
              justifyContent="center"
              alignItems="center"
              backgroundColor="rgba(0,0,0,0.85)"
              shadowColor="rgba(0,0,0,0.523)"
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
            </AbsoluteVStack>
            <VStack
              position="relative"
              zIndex={104}
              flex={1}
              height={height}
              justifyContent="center"
              width="100%"
              maxWidth={searchBarMaxWidth}
            >
              <Suspense fallback={null}>
                <AppSearchBarContents />
              </Suspense>
            </VStack>
          </VStack>
        </AbsoluteVStack>
      </AbsoluteVStack>
    </Theme>
  )
}

const AppSearchBarContents = memo(() => {
  const autocompletes = useStoreInstance(autocompletesStore)
  const focus = autocompletes.visible ? autocompletes.target : false
  const media = useMedia()
  const { color, background } = useSearchBarTheme()
  const showLocation = focus === 'location'

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

      <VStack paddingHorizontal={media.sm ? 6 : 12}>
        <DishLogoButton />
      </VStack>

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
            <VStack
              flex={1}
              overflow="hidden"
              display={showLocation ? 'contents' : 'none'}
            >
              <AppSearchInputLocation />
            </VStack>
            <VStack
              flex={1}
              overflow="hidden"
              display={!showLocation ? 'contents' : 'none'}
            >
              <AppSearchInput />
            </VStack>
          </>
        )}
      </HStack>

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
              maxWidth:
                focus === 'search'
                  ? 120
                  : focus === 'location'
                  ? '100%'
                  : '25%',
            })}
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
              <MapPin color={color} size={22} opacity={0.65} />
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
  const home = useHomeStore()
  const autocompletes = useStoreInstance(autocompletesStore)
  const showAutocomplete = autocompletes.visible
  const isDisabled = !showAutocomplete && home.currentStateType === 'home'
  const theme = useTheme()

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
      {...home.upRoute}
      onPress={() => {
        if (showAutocomplete) {
          autocompletes.setVisible(false)
        } else {
          home.popBack()
        }
      }}
    >
      <VStack
        alignSelf="center"
        transform={[{ skewX: '-12deg' }]}
        pointerEvents={isDisabled ? 'none' : 'auto'}
        width={30}
        height={searchBarHeight + 5}
        borderTopLeftRadius={13.5}
        borderBottomLeftRadius={13.5}
        alignItems="center"
        justifyContent="center"
        opacity={0.1}
        padding={0}
        backgroundColor={theme.backgroundColorTertiary}
        {...(!isDisabled && {
          opacity: 0.7,
          hoverStyle: {
            opacity: 1,
          },
          pressStyle: {
            opacity: 0.2,
          },
        })}
      >
        <VStack transform={[{ skewX: '12deg' }]}>
          <Icon color={color} size={20} />
        </VStack>
      </VStack>
    </Link>
  )
})
