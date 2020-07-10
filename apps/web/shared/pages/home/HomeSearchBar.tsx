import {
  AbsoluteVStack,
  Divider,
  HStack,
  LinearGradient,
  MediaQuery,
  Spacer,
  VStack,
  mediaQueries,
} from '@dish/ui'
import React, { memo, useState } from 'react'
import { ChevronLeft, Loader, MapPin, Search, Settings } from 'react-feather'
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
import HomeAutocomplete from './HomeAutocomplete'
import { HomeAutocompleteBackground } from './HomeAutocompleteBackground'
import { HomeSearchInput } from './HomeSearchInput'
import { HomeSearchLocationInput } from './HomeSearchLocationInput'
import { HomeUserMenu } from './HomeUserMenu'
import { useMediaQueryIsSmall } from './HomeViewDrawer'

const divider = <Divider vertical flexLine={1} marginHorizontal={4} />

export default memo(function HomeSearchBar() {
  const [showLocation, setShowLocation] = useState(false)
  const isSmall = useMediaQueryIsSmall()
  const om = useOvermind()
  const lense = om.state.home.currentStateLense
  const color = rgbString(lense?.rgb ?? [0, 0, 0])
  const colorBottom = rgbString(lense?.rgb.map((x) => x - 10) ?? [30, 30, 30])
  const borderRadius = 12

  console.log('ok', color, colorBottom)

  return (
    <AbsoluteVStack
      className="searchbar-container"
      zIndex={2000}
      position="absolute"
      fullscreen
      marginTop={searchBarTopOffset}
      left={isSmall ? 2 : 16}
      right={isSmall ? 2 : 16}
      alignItems="center"
      pointerEvents="none"
    >
      <HomeAutocompleteBackground />
      <VStack
        maxWidth={pageWidthMax - 150}
        zIndex={12}
        position="relative"
        width="100%"
        height={searchBarHeight}
        borderRadius={borderRadius}
        pointerEvents="auto"
      >
        {/* shadow */}
        <VStack
          height={searchBarHeight}
          borderRadius={borderRadius}
          className="skewX"
          position="absolute"
          top={0}
          right={0}
          bottom={0}
          left={0}
          shadowColor="rgba(0,0,0,0.4)"
          shadowOffset={{ height: 1, width: 0 }}
          shadowRadius={14}
        />
        <VStack
          className="skewX"
          position="relative"
          zIndex={100}
          flex={1}
          paddingHorizontal={8}
          height={searchBarHeight}
          borderRadius={borderRadius}
          shadowColor={color}
          shadowOpacity={0.25}
          shadowRadius={0}
          shadowOffset={{ height: 3, width: 3 }}
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
              colors={[color, colorBottom]}
              style={[StyleSheet.absoluteFill]}
            />
          </VStack>
          <HStack
            className="unskewX"
            alignItems="center"
            justifyContent="center"
            marginTop={-1}
          >
            <VStack paddingHorizontal={14}>
              <DishLogoButton />
            </VStack>

            {!isSmall && <HomeSearchBarHomeBackButton />}

            <HStack
              flex={100}
              maxWidth={550}
              alignItems="center"
              overflow="hidden"
            >
              {/* Loading / Search Icon */}
              {!isSmall && (
                <>
                  {om.state.home.isLoading ? (
                    <VStack className="rotating" opacity={0.45}>
                      <Loader color="#fff" size={18} />
                    </VStack>
                  ) : (
                    <Search color="#fff" size={18} opacity={0.25} />
                  )}
                </>
              )}

              {/* Search Input Start */}
              {isSmall && (
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
              {!isSmall && <HomeSearchInput />}
              <Spacer size={1} />
            </HStack>

            {!isSmall && (
              <>
                <Spacer />
                <HomeSearchLocationInput />
                {divider}
                <VStack flex={1} />
              </>
            )}

            {isSmall && (
              <LinkButton
                onPress={() => setShowLocation((x) => !x)}
                padding={12}
              >
                <MapPin color="#fff" size={22} opacity={0.65} />
              </LinkButton>
            )}

            <HomeUserMenu />

            {om.state.user.user?.username === 'admin' && (
              <LinkButton padding={12} name="admin">
                <Settings color="#fff" size={22} opacity={0.65} />
              </LinkButton>
            )}
          </HStack>
        </VStack>
        <HomeAutocomplete />
      </VStack>
    </AbsoluteVStack>
  )
})

const HomeSearchBarHomeBackButton = memo(() => {
  const om = useOvermind()
  const isDisabled = om.state.home.currentStateType === 'home'
  return (
    <MediaQuery query={mediaQueries.md} style={{ display: 'none' }}>
      <LinkButton
        justifyContent="center"
        alignItems="center"
        pointerEvents="auto"
        paddingRight={16}
        opacity={isDisabled ? 0 : 0.7}
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
        <ChevronLeft color="#fff" size={22} style={{ marginTop: 3 }} />
      </LinkButton>
    </MediaQuery>
  )
})
