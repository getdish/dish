import React, { Suspense } from 'react'
import { StyleSheet } from 'react-native'
import { AbsoluteVStack, LinearGradient, Theme, VStack, useMedia, useThemeName } from 'snackui'

import { bgLightTranslucent } from '../constants/colors'
import {
  searchBarBorderRadius,
  searchBarHeight,
  searchBarMaxWidth,
  zIndexSearchBarFloating,
} from '../constants/constants'
import { AppSearchBarContents } from './AppSearchBarContents'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'

// export const parentIds = {
//   small: 'searchbar-small',
//   large: 'searchbar-large',
// }

export const AppSearchBarFloating = () => {
  const media = useMedia()
  const { theme: searchThemeName, background, isColored } = useSearchBarTheme()
  const height = searchBarHeight + 9
  const parentThemeName = useThemeName()

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
  const themeName = media.sm
    ? parentThemeName
    : searchThemeName === 'light'
    ? 'dark'
    : searchThemeName

  return (
    <Theme name={themeName}>
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
        {/* under fade (only useful if actually floating so things show behind) */}
        {/* <AbsoluteVStack
          // doesnt fix flickering
          // display={media.sm ? 'none' : 'flex'}
          fullscreen
          zIndex={-1}
        >
          <LinearGradient
            style={[StyleSheet.absoluteFill]}
            colors={[bgLightTranslucent, `rgba(255,255,255,0)`]}
          />
        </AbsoluteVStack> */}

        {/* container */}
        <AbsoluteVStack top={0} left={-20} right={-20} alignItems="center">
          {/* bg/shadows */}
          <VStack
            position="relative"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height={height}
          >
            {/* SHADOW AND BACKGROUND */}
            <AbsoluteVStack
              borderRadius={searchBarBorderRadius}
              className="searchbar-shadow"
              overflow="hidden"
              zIndex={102}
              opacity={1}
              fullscreen
              height={height}
              justifyContent="center"
              alignItems="center"
              backgroundColor={background}
              shadowColor="#000"
              shadowOpacity={0.25}
              shadowOffset={{ height: 0, width: 0 }}
              shadowRadius={5}
            />
            <VStack
              width="100%"
              position="relative"
              zIndex={104}
              flex={1}
              height={height}
              paddingRight={10}
              justifyContent="center"
              maxWidth={searchBarMaxWidth}
              alignItems="center"
            >
              <Suspense fallback={null}>
                <AppSearchBarContents isColored={isColored} />
              </Suspense>
            </VStack>
          </VStack>
        </AbsoluteVStack>
      </AbsoluteVStack>
    </Theme>
  )
}
