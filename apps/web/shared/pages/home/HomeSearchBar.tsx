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
import HomeAutocomplete from './HomeAutocomplete'
import { HomeMenu } from './HomeMenu'
import { HomeSearchInput } from './HomeSearchInput'
import { HomeSearchLocationInput } from './HomeSearchLocationInput'
import { useCurrentLenseColor } from './useCurrentLenseColor'
import {
  useMediaQueryIsReallySmall,
  useMediaQueryIsSmall,
} from './useMediaQueryIs'

const divider = <Divider vertical flexLine={1} marginHorizontal={4} />

export default memo(function HomeSearchBar() {
  const [showLocation, setShowLocation] = useState(false)
  const isSmall = useMediaQueryIsSmall()
  const isReallySmall = useMediaQueryIsReallySmall()
  const rgb = useCurrentLenseColor()
  const color = rgbString(rgb.map((x) => x + 5))
  const colorBottom = rgbString(rgb.map((x) => x - 5) ?? [30, 30, 30])
  const borderRadius = 12

  return (
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
        left: -2,
        right: -2,
        top: '20%',
      })}
    >
      <HomeAutocomplete />
      <VStack
        zIndex={12}
        position="relative"
        maxWidth={pageWidthMax}
        alignItems="center"
        width="100%"
        height={searchBarHeight}
        borderRadius={borderRadius}
      >
        <VStack
          flex={1}
          pointerEvents="auto"
          width="100%"
          maxWidth={pageWidthMax - 200}
          position="relative"
        >
          {/* shadow */}
          <VStack
            height={searchBarHeight - 1}
            borderRadius={borderRadius}
            zIndex={0}
            className="skewX"
            position="absolute"
            top={0}
            width="100%"
            shadowColor="rgba(0,0,0,0.2)"
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
              <VStack paddingHorizontal={10}>
                <DishLogoButton />
              </VStack>

              {!isSmall && (
                <>
                  <HomeSearchBarHomeBackButton />
                </>
              )}

              <HStack
                flex={100}
                maxWidth={550}
                alignItems="center"
                overflow="hidden"
              >
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
                <LinkButton
                  onPress={() => setShowLocation((x) => !x)}
                  padding={12}
                >
                  <MapPin color="#fff" size={22} opacity={0.65} />
                </LinkButton>
              )}

              <HomeMenu />
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </AbsoluteVStack>
  )
})

const HomeSearchBarHomeBackButton = memo(() => {
  const om = useOvermind()
  const isDisabled = om.state.home.currentStateType === 'home'
  const isOneLevelUpFromHome = om.state.home.previousState?.type === 'home'
  const iconProps = {
    color: '#fff',
    size: 20,
    style: { marginTop: 3 },
  }
  return (
    <MediaQuery query={mediaQueries.md}>
      <LinkButton
        justifyContent="center"
        alignItems="center"
        pointerEvents="auto"
        width={30}
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
        <ChevronLeft {...iconProps} />
      </LinkButton>
    </MediaQuery>
  )
})
