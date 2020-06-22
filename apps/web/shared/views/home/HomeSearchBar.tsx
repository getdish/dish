import {
  Divider,
  HStack,
  MediaQuery,
  Spacer,
  VStack,
  ZStack,
  mediaQueries,
} from '@dish/ui'
import React, { memo, useState } from 'react'
import { ChevronLeft, Loader, MapPin, Navigation, Search } from 'react-feather'

import {
  pageWidthMax,
  searchBarHeight,
  searchBarTopOffset,
} from '../../constants'
import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../ui/LinkButton'
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
  const borderRadius = 54

  const locationSearchElement = (
    <VStack
      position="relative"
      flex={65}
      minWidth={180}
      borderColor="#eee"
      borderWidth={1}
      borderRadius={100}
    >
      <HomeSearchLocationInput />
      <SearchLocationButton />
    </VStack>
  )

  const searchElement = <HomeSearchInput />

  return (
    <VStack
      zIndex={2000}
      position="absolute"
      marginTop={searchBarTopOffset}
      left={isSmall ? 2 : 16}
      right={isSmall ? 2 : 16}
      alignItems="center"
      height={searchBarHeight}
    >
      <HomeAutocompleteBackground />
      <VStack
        maxWidth={pageWidthMax - 90}
        zIndex={12}
        position="relative"
        width="100%"
        height="100%"
        borderRadius={borderRadius}
        shadowColor="rgba(0,0,0,0.07)"
        shadowOffset={{ height: 5, width: 0 }}
        shadowRadius={40}
      >
        <VStack
          position="relative"
          zIndex={100}
          flex={1}
          backgroundColor="#fff"
          paddingHorizontal={8}
          flexDirection="row"
          borderRadius={borderRadius}
          shadowColor="rgba(0,0,0,0.065)"
          shadowRadius={3}
          shadowOffset={{ height: 3, width: 0 }}
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
        >
          <DishLogoButton />

          <MediaQuery query={mediaQueries.md} style={{ display: 'none' }}>
            <HomeSearchBarHomeButton />
          </MediaQuery>

          <HStack
            flex={145}
            maxWidth={550}
            alignItems="center"
            spacing
            overflow="hidden"
          >
            {/* Loading / Search Icon */}
            <MediaQuery query={mediaQueries.sm} style={{ display: 'none' }}>
              {om.state.home.isLoading ? (
                <VStack className="rotating" opacity={0.5}>
                  <Loader size={18} />
                </VStack>
              ) : (
                <Search size={18} opacity={0.5} />
              )}
            </MediaQuery>

            {/* Search Input Start */}
            {isSmall && (
              <>
                {/* keep both in dom so we have access to ref */}
                <VStack display={showLocation ? 'contents' : 'none'}>
                  {locationSearchElement}
                </VStack>
                <VStack display={!showLocation ? 'contents' : 'none'}>
                  {searchElement}
                </VStack>
              </>
            )}
            {!isSmall && <>{searchElement}</>}
            <Spacer size={1} />
          </HStack>

          {!isSmall && (
            <>
              {locationSearchElement}
              {divider}
              <MediaQuery query={mediaQueries.md} style={{ display: 'none' }}>
                <VStack flex={1} />
              </MediaQuery>
            </>
          )}

          {isSmall && (
            <LinkButton onPress={() => setShowLocation((x) => !x)} padding={15}>
              <MapPin size={22} opacity={0.5} />
            </LinkButton>
          )}

          <HomeUserMenu />
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
        paddingHorizontal={4}
        marginRight={20}
        opacity={om.state.home.currentStateType === 'home' ? 0 : 1}
        onPress={() => om.actions.home.popTo(-1)}
        pressStyle={{
          opacity: 0.6,
        }}
      >
        <ChevronLeft size={22} opacity={0.6} style={{ marginTop: 4 }} />
      </LinkButton>
    </MediaQuery>
  )
})

const SearchLocationButton = memo(() => {
  const om = useOvermind()
  return (
    <ZStack fullscreen pointerEvents="none">
      <HStack flex={1} alignItems="center" justifyContent="center">
        <Spacer flex={1} />
        <VStack
          pointerEvents="auto"
          alignItems="center"
          justifyContent="center"
          padding={10}
          opacity={0.5}
          pressStyle={{
            opacity: 0.4,
          }}
          onPressOut={() => {
            om.actions.home.popTo('home')
          }}
        >
          <Navigation size={18} color="blue" />
        </VStack>
      </HStack>
    </ZStack>
  )
})
