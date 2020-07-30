import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  MediaQuery,
  Spacer,
  VStack,
  mediaQueries,
} from '@dish/ui'
import React, { Suspense, memo, useState } from 'react'
import { ChevronLeft, MapPin } from 'react-feather'
import { StyleSheet } from 'react-native'

import {
  pageWidthMax,
  searchBarHeight,
  searchBarTopOffset,
} from '../../constants'
import { rgbString } from '../../helpers/rgbString'
import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../../views/ui/LinkButton'
import { DishLogoButton } from './DishLogoButton'
import { HomeMenu } from './HomeMenu'
import { HomeSearchInput } from './HomeSearchInput'
import { HomeSearchLocationInput } from './HomeSearchLocationInput'
import { useCurrentLenseColor } from './useCurrentLenseColor'
import {
  useMediaQueryIsReallySmall,
  useMediaQueryIsSmall,
} from './useMediaQueryIs'

export const useSearchBarTheme = () => {
  const isSmall = useMediaQueryIsSmall()
  return {
    theme: isSmall ? 'light' : 'dark',
    color: isSmall ? '#444' : '#fff',
    background: isSmall ? '#eee' : 'transparent',
    isSmall,
  }
}

export const HomeSearchBarDrawer = () => {
  const isSmall = useMediaQueryIsSmall()
  if (!isSmall) {
    return null
  }
  return (
    <VStack paddingVertical={2}>
      <HomeSearchBar />
    </VStack>
  )
}

export const parentIds = {
  small: 'searchbar-small',
  large: 'searchbar-large',
}

export const HomeSearchBarFloating = () => {
  const isSmall = useMediaQueryIsSmall()
  const borderRadius = 10
  const rgb = useCurrentLenseColor()
  const backgroundColor = rgbString(rgb.map((x) => x + 5))
  const backgroundColorBottom = rgbString(rgb.map((x) => x - 5) ?? [30, 30, 30])

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
        zIndex={2000}
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
        {/* <Reparentable id={parentIds.large}>
          {isSmall ? null : <HomeSearchBar />}
        </Reparentable> */}
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
                  width="100%"
                  shadowColor="rgba(0,0,0,0.3)"
                  shadowOffset={{ height: 2, width: 4 }}
                  shadowRadius={18}
                />
                <VStack
                  height={searchBarHeight - 1}
                  borderRadius={borderRadius}
                  zIndex={-1}
                  className="skewX"
                  position="absolute"
                  top={0}
                  width="100%"
                  shadowColor="rgba(0,0,0,0.1)"
                  shadowOffset={{ height: 2, width: 3 }}
                  shadowRadius={3}
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
              borderRadius={borderRadius}
              // shadowColor="#fff"
              // shadowOpacity={0.5}
              // shadowRadius={0}
              // shadowOffset={{ height: 4, width: -3 }}
              justifyContent="center"
              overflow="hidden"
            >
              {/* bg */}
              <VStack
                position="absolute"
                top={0}
                bottom={0}
                right={-100}
                left={-100}
              >
                <LinearGradient
                  colors={[backgroundColor, backgroundColorBottom]}
                  style={[StyleSheet.absoluteFill]}
                />
              </VStack>

              <HStack
                className="unskewX"
                alignItems="center"
                justifyContent="center"
                marginTop={-1}
              >
                <HomeSearchBar />
              </HStack>
            </VStack>
          </VStack>
        </VStack>
      </AbsoluteVStack>
    </Suspense>
  )
}

const HomeSearchBar = memo(() => {
  const [showLocation, setShowLocation] = useState(false)
  const isReallySmall = useMediaQueryIsReallySmall()
  const { color } = useSearchBarTheme()

  return (
    <HStack
      flex={1}
      overflow="hidden"
      pointerEvents="auto"
      alignItems="center"
      justifyContent="center"
    >
      <VStack paddingHorizontal={10}>
        <DishLogoButton />
      </VStack>

      <HomeSearchBarHomeBackButton />

      <HStack flex={100} maxWidth={550} alignItems="center" overflow="hidden">
        {/* Search Input Start */}
        {isReallySmall && (
          <>
            {/* keep both in dom so we have access to ref */}
            <VStack display={showLocation ? 'contents' : 'none'}>
              <HomeSearchLocationInput />
            </VStack>
            <VStack display={!showLocation ? 'contents' : 'none'}>
              <HomeSearchInput />
            </VStack>
          </>
        )}
        {!isReallySmall && <HomeSearchInput />}
      </HStack>

      {!isReallySmall && (
        <>
          <Spacer size={6} />
          <HomeSearchLocationInput />
          <VStack flex={1} />
        </>
      )}

      {isReallySmall && (
        <LinkButton onPress={() => setShowLocation((x) => !x)} padding={12}>
          <MapPin color={color} size={22} opacity={0.65} />
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
  // const isOneLevelUpFromHome = om.state.home.previousState?.type === 'home'
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
      width={30}
      marginLeft={-10}
      marginRight={5}
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
      <ChevronLeft {...iconProps} />
    </LinkButton>
  )
})
