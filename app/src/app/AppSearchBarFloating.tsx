import { AbsoluteYStack, Theme, YStack, useMedia } from '@dish/ui'
import React, { Suspense } from 'react'

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
  const { themeName, background, isColored } = useSearchBarTheme()
  const height = searchBarHeight + 9

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
  const barThemeName = media.sm ? null : themeName

  return (
    <Theme name={barThemeName}>
      <AbsoluteYStack
        className="searchbar-container ease-in-out"
        zIndex={zIndexSearchBarFloating}
        position="absolute"
        alignItems="center"
        pointerEvents="none"
        left={0}
        right={0}
        top={0}
      >
        {/* container */}
        <AbsoluteYStack top={0} left={-20} right={-20} alignItems="center">
          {/* bg/shadows */}
          <YStack
            position="relative"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height={height}
          >
            {/* SHADOW AND BACKGROUND */}
            <AbsoluteYStack
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
            <YStack
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
            </YStack>
          </YStack>
        </AbsoluteYStack>
      </AbsoluteYStack>
    </Theme>
  )
}
