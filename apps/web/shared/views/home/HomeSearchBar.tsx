import {
  Divider,
  HStack,
  MediaQuery,
  Spacer,
  VStack,
  mediaQueries,
} from '@dish/ui'
import React, { memo, useState } from 'react'
import { ChevronLeft, Loader, MapPin, Search } from 'react-feather'

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
        shadowColor="rgba(0,0,0,0.05)"
        shadowOffset={{ height: 5, width: 0 }}
        shadowRadius={26}
      >
        <VStack
          position="relative"
          zIndex={100}
          flex={1}
          backgroundColor="#fff"
          paddingHorizontal={8}
          flexDirection="row"
          borderRadius={borderRadius}
          // height={searchBarHeight}
          shadowColor="rgba(0,0,0,0.065)"
          shadowRadius={3}
          shadowOffset={{ height: 3, width: 0 }}
          alignItems="center"
          justifyContent="center"
        >
          <VStack
            {...(isSmall && {
              position: 'absolute',
              top: -20,
              left: -10,
              transform: [{ scale: 0.65 }],
              backgroundColor: '#fff',
              paddingVertical: 3,
              paddingHorizontal: 5,
              borderRadius: 100,
            })}
          >
            <DishLogoButton />
          </VStack>

          {!isSmall && <HomeSearchBarHomeButton />}

          <HStack
            flex={145}
            maxWidth={550}
            alignItems="center"
            spacing
            overflow="hidden"
          >
            {/* Loading / Search Icon */}
            {!isSmall && (
              <>
                {om.state.home.isLoading ? (
                  <VStack className="rotating" opacity={0.5}>
                    <Loader size={18} />
                  </VStack>
                ) : (
                  <Search size={18} opacity={0.5} />
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
                  {searchElement}
                </VStack>
              </>
            )}
            {!isSmall && <>{searchElement}</>}
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
            <LinkButton onPress={() => setShowLocation((x) => !x)} padding={12}>
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
