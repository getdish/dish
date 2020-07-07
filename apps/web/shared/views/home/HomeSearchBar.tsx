import {
  Divider,
  HStack,
  LinearGradient,
  MediaQuery,
  Spacer,
  Text,
  VStack,
  mediaQueries,
} from '@dish/ui'
import React, { memo, useState } from 'react'
import { ChevronLeft, Loader, MapPin, Search } from 'react-feather'
import { StyleSheet } from 'react-native'

import {
  pageWidthMax,
  searchBarHeight,
  searchBarTopOffset,
} from '../../constants'
import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../ui/LinkButton'
import { brandColor, brandColorDark } from './colors'
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
  const borderRadius = 12

  return (
    <VStack
      className="searchbar-container"
      zIndex={2000}
      position="absolute"
      marginTop={searchBarTopOffset}
      left={isSmall ? 2 : 16}
      right={isSmall ? 2 : 16}
      alignItems="center"
    >
      <HomeAutocompleteBackground />
      <VStack
        maxWidth={pageWidthMax - 150}
        zIndex={12}
        position="relative"
        width="100%"
        height={searchBarHeight}
        borderRadius={borderRadius}
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
          shadowColor="rgba(0,0,0,0.2)"
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
          shadowColor={brandColor}
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
              colors={[brandColor, brandColorDark]}
              style={[StyleSheet.absoluteFill]}
            />
          </VStack>
          <HStack
            className="unskewX"
            alignItems="center"
            justifyContent="center"
            marginTop={-1}
          >
            <DishLogoButton />

            {!isSmall && <HomeSearchBarHomeButton />}

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
                    <Search color="#fff" size={18} opacity={0.45} />
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
          </HStack>
        </VStack>
        <HomeAutocomplete />
      </VStack>
    </VStack>
  )
})

const HomeSearchBarHomeButton = memo(() => {
  const om = useOvermind()
  return (
    <MediaQuery query={mediaQueries.md} style={{ display: 'none' }}>
      <LinkButton
        justifyContent="center"
        alignItems="center"
        pointerEvents="auto"
        paddingRight={16}
        opacity={om.state.home.currentStateType === 'home' ? 0 : 1}
        onPress={() => om.actions.home.popTo(-1)}
        pressStyle={{
          opacity: 0.6,
        }}
      >
        <ChevronLeft
          color="#fff"
          size={22}
          opacity={0.6}
          style={{ marginTop: 3 }}
        />
      </LinkButton>
    </MediaQuery>
  )
})
